import mongoose from "mongoose";
import { LeaveRequest } from "../models/LeaveRequest.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { LEAVE_STATUS, ROLES } from "../utils/constants.js";
import { getToday, toStartOfDay } from "../utils/date.js";
import { getLeaveUsage } from "../utils/leavePolicy.js";

/**
 * Builds a filter object for admin leave list endpoints.
 * @param {object} query Express query parameters.
 * @returns {object} MongoDB query.
 */
const buildLeaveFilters = (query) => {
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

    if (startDate && endDate) {
      filters.startDate = { $lte: endDate };
      filters.endDate = { $gte: startDate };
    } else if (startDate) {
      filters.endDate = { $gte: startDate };
    } else if (endDate) {
      filters.startDate = { $lte: endDate };
    }
  }

  return filters;
};

/**
 * Returns leave requests for admins with filtering support.
 */
export const getLeaveRequests = asyncHandler(async (req, res) => {
  const leaves = await LeaveRequest.find(buildLeaveFilters(req.query))
    .populate("employee", "name email gender")
    .populate("adminActionBy", "name email")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ leaves });
});

/**
 * Approves a pending leave request.
 */
export const approveLeaveRequest = asyncHandler(async (req, res) => {
  const leave = await LeaveRequest.findById(req.params.id);

  if (!leave) {
    throw new AppError("Leave request not found.", 404);
  }

  if (leave.status !== LEAVE_STATUS.PENDING) {
    throw new AppError("Only pending requests can be approved.", 400);
  }

  leave.status = LEAVE_STATUS.APPROVED;
  leave.adminActionAt = new Date();
  leave.adminActionBy = req.user._id;
  leave.employeeViewed = false;

  await leave.save();

  res.json({ message: "Leave request approved.", leave });
});

/**
 * Rejects a pending leave request.
 */
export const rejectLeaveRequest = asyncHandler(async (req, res) => {
  const leave = await LeaveRequest.findById(req.params.id);

  if (!leave) {
    throw new AppError("Leave request not found.", 404);
  }

  if (leave.status !== LEAVE_STATUS.PENDING) {
    throw new AppError("Only pending requests can be rejected.", 400);
  }

  leave.status = LEAVE_STATUS.REJECTED;
  leave.rejectionReason = req.body.reason || "";
  leave.adminActionAt = new Date();
  leave.adminActionBy = req.user._id;
  leave.employeeViewed = false;

  await leave.save();

  res.json({ message: "Leave request rejected.", leave });
});

/**
 * Returns a leave summary row for each employee.
 */
export const getEmployeeLeaveDashboard = asyncHandler(async (_req, res) => {
  const employees = await User.find({ role: ROLES.EMPLOYEE }).sort({ name: 1 }).lean();
  const today = getToday();

  const rows = await Promise.all(
    employees.map(async (employee) => {
      const [summary, activeLeave] = await Promise.all([
        getLeaveUsage(employee._id),
        LeaveRequest.findOne({
          employee: employee._id,
          status: LEAVE_STATUS.APPROVED,
          startDate: { $lte: today },
          endDate: { $gte: today }
        }).lean()
      ]);

      return {
        employee: {
          id: employee._id,
          name: employee.name,
          email: employee.email,
          gender: employee.gender
        },
        leaveSummary: summary,
        status: activeLeave ? "On Leave" : "Present",
        activeLeave
      };
    })
  );

  res.json({ employees: rows });
});

/**
 * Returns all leave records for a selected employee.
 */
export const getEmployeeLeaveHistory = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.employeeId)) {
    throw new AppError("Invalid employee id.", 400);
  }

  const employee = await User.findOne({
    _id: req.params.employeeId,
    role: ROLES.EMPLOYEE
  }).lean();

  if (!employee) {
    throw new AppError("Employee not found.", 404);
  }

  const leaves = await LeaveRequest.find({ employee: req.params.employeeId })
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    employee: {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      gender: employee.gender
    },
    leaves
  });
});
