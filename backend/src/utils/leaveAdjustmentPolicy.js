import { AppError } from "./AppError.js";
import { LEAVE_ADJUSTMENT_TYPES, LEAVE_STATUS } from "./constants.js";
import { getInclusiveDays, getToday, toStartOfDay } from "./date.js";
import { validateAndAllocateLeave } from "./leavePolicy.js";

const ADJUSTABLE_LEAVE_STATUSES = [LEAVE_STATUS.PENDING, LEAVE_STATUS.APPROVED];

/**
 * Checks whether an existing leave can be adjusted by an employee.
 * @param {object} leave Leave request document or plain object.
 * @param {Date} today Normalized current date.
 * @returns {boolean} Whether the leave is pending/approved and has not ended.
 */
export const isLeaveAdjustable = (leave, today = getToday()) => {
  return ADJUSTABLE_LEAVE_STATUSES.includes(leave.status) && toStartOfDay(leave.endDate) >= today;
};

/**
 * Validates a leave adjustment request and calculates the updated paid/unpaid allocation.
 * @param {object} params Adjustment validation input.
 * @param {import("../models/User.js").User} params.user Employee who owns the leave.
 * @param {import("../models/LeaveRequest.js").LeaveRequest} params.leave Existing leave request.
 * @param {string|Date} params.requestedStartDate Requested adjusted start date.
 * @param {string|Date} params.requestedEndDate Requested adjusted end date.
 * @returns {Promise<object>} Normalized dates, adjustment type, and updated allocation.
 */
export const validateAndAllocateAdjustment = async ({
  user,
  leave,
  requestedStartDate,
  requestedEndDate
}) => {
  const today = getToday();
  const originalStart = toStartOfDay(leave.startDate);
  const originalEnd = toStartOfDay(leave.endDate);
  const normalizedStart = toStartOfDay(requestedStartDate);
  const normalizedEnd = toStartOfDay(requestedEndDate);

  if (!isLeaveAdjustable(leave, today)) {
    throw new AppError("Only pending, current, or future leave requests can be adjusted.", 400);
  }

  if (!normalizedStart || !normalizedEnd) {
    throw new AppError("Please provide valid adjusted start and end dates.", 400);
  }

  if (normalizedStart > normalizedEnd) {
    throw new AppError("Adjusted start date must be before or equal to adjusted end date.", 400);
  }

  if (normalizedEnd < today) {
    throw new AppError("Adjusted leave cannot end before today.", 400);
  }

  const isCurrentLeave = originalStart <= today && originalEnd >= today;

  if (isCurrentLeave && normalizedStart.getTime() !== originalStart.getTime()) {
    throw new AppError("Current leave start date is locked. Please change only the end date.", 400);
  }

  if (!isCurrentLeave && normalizedStart < today) {
    throw new AppError("Future leave adjustments cannot start in the past.", 400);
  }

  const requestedNumberOfDays = getInclusiveDays(normalizedStart, normalizedEnd);

  if (requestedNumberOfDays === leave.numberOfDays) {
    throw new AppError("Adjusted dates must either extend or shorten the leave.", 400);
  }

  const adjustmentType = requestedNumberOfDays > leave.numberOfDays
    ? LEAVE_ADJUSTMENT_TYPES.EXTENSION
    : LEAVE_ADJUSTMENT_TYPES.SHORTENING;

  // Exclude the original leave so the proposed range can overlap the record being edited.
  const allocation = await validateAndAllocateLeave({
    user,
    leaveType: leave.leaveType,
    numberOfDays: requestedNumberOfDays,
    startDate: normalizedStart,
    endDate: normalizedEnd,
    deliveryDate: leave.deliveryDate,
    allowPastStart: isCurrentLeave,
    excludeLeaveId: leave._id
  });

  return {
    adjustmentType,
    requestedStartDate: allocation.startDate,
    requestedEndDate: allocation.endDate,
    requestedNumberOfDays: allocation.numberOfDays,
    requestedPaidDays: allocation.paidDays,
    requestedUnpaidDays: allocation.unpaidDays,
    deliveryDate: allocation.deliveryDate
  };
};
