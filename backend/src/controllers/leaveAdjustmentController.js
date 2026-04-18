import mongoose from "mongoose";
import { LeaveAdjustmentRequest } from "../models/LeaveAdjustmentRequest.js";
import { LeaveRequest } from "../models/LeaveRequest.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { LEAVE_STATUS } from "../utils/constants.js";
import { toStartOfDay } from "../utils/date.js";
import { validateAndAllocateAdjustment } from "../utils/leaveAdjustmentPolicy.js";

/**
 * Builds a filter object for admin adjustment request lists.
 * @param {object} query Express query parameters.
 * @returns {object} MongoDB filter object.
 */
const buildAdjustmentFilters = (query) => {
  const filters = {};

  if (query.status && Object.values(LEAVE_STATUS).includes(query.status)) {
    filters.status = query.status;
  } else if (query.processed === "true") {
    filters.status = { $in: [LEAVE_STATUS.APPROVED, LEAVE_STATUS.REJECTED] };
  }

  if (query.employee && mongoose.Types.ObjectId.isValid(query.employee)) {
    filters.employee = query.employee;
  }

  if (query.startDate || query.endDate) {
    const startDate = query.startDate ? toStartOfDay(query.startDate) : null;
    const endDate = query.endDate ? toStartOfDay(query.endDate) : null;

    // Date filtering checks whether the requested adjusted range intersects the filter range.
    if (startDate && endDate) {
      filters.requestedStartDate = { $lte: endDate };
      filters.requestedEndDate = { $gte: startDate };
    } else if (startDate) {
      filters.requestedEndDate = { $gte: startDate };
    } else if (endDate) {
      filters.requestedStartDate = { $lte: endDate };
    }
  }

  return filters;
};

/**
 * Creates an employee request to extend or shorten an existing current/future leave.
 */
export const createLeaveAdjustmentRequest = asyncHandler(async (req, res) => {
  const { requestedStartDate, requestedEndDate, reason } = req.body;

  const leave = await LeaveRequest.findOne({
    _id: req.params.id,
    employee: req.user._id
  });

  if (!leave) {
    throw new AppError("Leave request not found.", 404);
  }

  const existingAdjustment = await LeaveAdjustmentRequest.findOne({
    leave: leave._id,
    status: LEAVE_STATUS.PENDING
  }).lean();

  if (existingAdjustment) {
    throw new AppError("This leave already has a pending adjustment request.", 409);
  }

  const allocation = await validateAndAllocateAdjustment({
    user: req.user,
    leave,
    requestedStartDate,
    requestedEndDate
  });

  const adjustment = await LeaveAdjustmentRequest.create({
    employee: req.user._id,
    leave: leave._id,
    employeeSnapshot: {
      name: req.user.name,
      email: req.user.email,
      gender: req.user.gender
    },
    originalLeaveSnapshot: {
      leaveType: leave.leaveType,
      numberOfDays: leave.numberOfDays,
      paidDays: leave.paidDays,
      unpaidDays: leave.unpaidDays,
      startDate: leave.startDate,
      endDate: leave.endDate,
      deliveryDate: leave.deliveryDate,
      status: leave.status
    },
    adjustmentType: allocation.adjustmentType,
    requestedStartDate: allocation.requestedStartDate,
    requestedEndDate: allocation.requestedEndDate,
    requestedNumberOfDays: allocation.requestedNumberOfDays,
    requestedPaidDays: allocation.requestedPaidDays,
    requestedUnpaidDays: allocation.requestedUnpaidDays,
    reason: reason || "",
    employeeViewed: true
  });

  res.status(201).json({
    message: `${allocation.adjustmentType} request submitted for admin review.`,
    adjustment
  });
});

/**
 * Returns the authenticated employee's leave adjustment request history.
 */
export const getMyLeaveAdjustments = asyncHandler(async (req, res) => {
  const adjustments = await LeaveAdjustmentRequest.find({ employee: req.user._id })
    .populate("leave", "leaveType startDate endDate numberOfDays status")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ adjustments });
});

/**
 * Returns leave adjustment requests for admins with filtering support.
 */
export const getLeaveAdjustmentRequests = asyncHandler(async (req, res) => {
  const adjustments = await LeaveAdjustmentRequest.find(buildAdjustmentFilters(req.query))
    .populate("leave", "leaveType startDate endDate numberOfDays status")
    .populate("employee", "name email gender")
    .populate("adminActionBy", "name email")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ adjustments });
});

/**
 * Approves an adjustment request and applies the requested dates to the original leave.
 */
export const approveLeaveAdjustmentRequest = asyncHandler(async (req, res) => {
  const adjustment = await LeaveAdjustmentRequest.findById(req.params.id);

  if (!adjustment) {
    throw new AppError("Leave adjustment request not found.", 404);
  }

  if (adjustment.status !== LEAVE_STATUS.PENDING) {
    throw new AppError("Only pending adjustment requests can be approved.", 400);
  }

  const [leave, employee] = await Promise.all([
    LeaveRequest.findById(adjustment.leave),
    User.findById(adjustment.employee)
  ]);

  if (!leave || !employee) {
    throw new AppError("The leave or employee linked to this adjustment no longer exists.", 404);
  }

  const allocation = await validateAndAllocateAdjustment({
    user: employee,
    leave,
    requestedStartDate: adjustment.requestedStartDate,
    requestedEndDate: adjustment.requestedEndDate
  });

  leave.startDate = allocation.requestedStartDate;
  leave.endDate = allocation.requestedEndDate;
  leave.deliveryDate = allocation.deliveryDate;
  leave.numberOfDays = allocation.requestedNumberOfDays;
  leave.paidDays = allocation.requestedPaidDays;
  leave.unpaidDays = allocation.requestedUnpaidDays;
  leave.employeeViewed = false;

  adjustment.adjustmentType = allocation.adjustmentType;
  adjustment.requestedNumberOfDays = allocation.requestedNumberOfDays;
  adjustment.requestedPaidDays = allocation.requestedPaidDays;
  adjustment.requestedUnpaidDays = allocation.requestedUnpaidDays;
  adjustment.status = LEAVE_STATUS.APPROVED;
  adjustment.adminActionAt = new Date();
  adjustment.adminActionBy = req.user._id;
  adjustment.employeeViewed = false;

  await Promise.all([leave.save(), adjustment.save()]);

  res.json({
    message: "Leave adjustment approved and applied.",
    adjustment,
    leave
  });
});

/**
 * Rejects a pending adjustment request without changing the original leave.
 */
export const rejectLeaveAdjustmentRequest = asyncHandler(async (req, res) => {
  const adjustment = await LeaveAdjustmentRequest.findById(req.params.id);

  if (!adjustment) {
    throw new AppError("Leave adjustment request not found.", 404);
  }

  if (adjustment.status !== LEAVE_STATUS.PENDING) {
    throw new AppError("Only pending adjustment requests can be rejected.", 400);
  }

  adjustment.status = LEAVE_STATUS.REJECTED;
  adjustment.rejectionReason = req.body.reason || "";
  adjustment.adminActionAt = new Date();
  adjustment.adminActionBy = req.user._id;
  adjustment.employeeViewed = false;

  await adjustment.save();

  res.json({ message: "Leave adjustment request rejected.", adjustment });
});
