import { LeaveRequest } from "../models/LeaveRequest.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { LEAVE_STATUS } from "../utils/constants.js";
import { getLeaveUsage, validateAndAllocateLeave } from "../utils/leavePolicy.js";

/**
 * Creates a new employee leave request.
 */
export const createLeaveRequest = asyncHandler(async (req, res) => {
  const { leaveType, numberOfDays, startDate, endDate, reason, deliveryDate } = req.body;

  const allocation = await validateAndAllocateLeave({
    user: req.user,
    leaveType,
    numberOfDays,
    startDate,
    endDate,
    deliveryDate
  });

  const leave = await LeaveRequest.create({
    employee: req.user._id,
    employeeSnapshot: {
      name: req.user.name,
      email: req.user.email,
      gender: req.user.gender
    },
    leaveType,
    numberOfDays: allocation.numberOfDays,
    paidDays: allocation.paidDays,
    unpaidDays: allocation.unpaidDays,
    startDate: allocation.startDate,
    endDate: allocation.endDate,
    deliveryDate: allocation.deliveryDate,
    reason: reason || "",
    employeeViewed: true
  });

  res.status(201).json({
    message: allocation.unpaidDays > 0
      ? `Leave request submitted. ${allocation.unpaidDays} day(s) will be treated as unpaid.`
      : "Leave request submitted successfully.",
    leave
  });
});

/**
 * Returns the authenticated employee's leave history.
 */
export const getMyLeaves = asyncHandler(async (req, res) => {
  const leaves = await LeaveRequest.find({ employee: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ leaves });
});

/**
 * Returns the authenticated employee's dashboard summary.
 */
export const getMyLeaveSummary = asyncHandler(async (req, res) => {
  const summary = await getLeaveUsage(req.user._id);
  const pendingCount = await LeaveRequest.countDocuments({
    employee: req.user._id,
    status: LEAVE_STATUS.PENDING
  });

  res.json({ summary, pendingCount });
});

/**
 * Cancels a pending leave request owned by the authenticated employee.
 */
export const cancelLeaveRequest = asyncHandler(async (req, res) => {
  const leave = await LeaveRequest.findOne({
    _id: req.params.id,
    employee: req.user._id
  });

  if (!leave) {
    throw new AppError("Leave request not found.", 404);
  }

  if (leave.status !== LEAVE_STATUS.PENDING) {
    throw new AppError("Only pending leave requests can be cancelled.", 400);
  }

  await leave.deleteOne();

  res.json({ message: "Leave request cancelled successfully." });
});
