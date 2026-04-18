import { LeaveRequest } from "../models/LeaveRequest.js";
import { AppError } from "./AppError.js";
import {
  ACTIVE_LEAVE_STATUSES,
  FEMALE_ONLY_LEAVE_TYPES,
  GENDERS,
  LEAVE_POLICY,
  LEAVE_STATUS,
  LEAVE_TYPES,
  NORMAL_PAID_LEAVE_TYPES
} from "./constants.js";
import {
  getInclusiveDays,
  getIntersectionDays,
  getMonthRange,
  getToday,
  getYearRange,
  toStartOfDay
} from "./date.js";

/**
 * Builds a reusable query for leaves that overlap a date range.
 * @param {string} employeeId Employee id.
 * @param {Date} startDate Start date.
 * @param {Date} endDate End date.
 * @param {string[]} statuses Statuses to include.
 * @param {string|null} excludeLeaveId Leave id to ignore during adjustment checks.
 * @returns {object} Mongoose query object.
 */
export const buildOverlapQuery = (
  employeeId,
  startDate,
  endDate,
  statuses = ACTIVE_LEAVE_STATUSES,
  excludeLeaveId = null
) => {
  const query = {
    employee: employeeId,
    status: { $in: statuses },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate }
  };

  if (excludeLeaveId) {
    query._id = { $ne: excludeLeaveId };
  }

  return query;
};

/**
 * Computes leave usage for an employee in a policy year.
 * @param {string} employeeId Employee id.
 * @param {object} options Calculation options.
 * @param {Date} options.referenceDate Date used to select the year.
 * @param {string[]} options.statuses Leave statuses to include.
 * @param {string|null} options.excludeLeaveId Leave id to exclude from policy usage.
 * @returns {Promise<object>} Usage summary.
 */
export const getLeaveUsage = async (
  employeeId,
  { referenceDate = new Date(), statuses = [LEAVE_STATUS.APPROVED], excludeLeaveId = null } = {}
) => {
  const { start: yearStart, end: yearEnd } = getYearRange(referenceDate);
  const { start: monthStart, end: monthEnd } = getMonthRange(referenceDate);

  const usageQuery = {
    employee: employeeId,
    status: { $in: statuses },
    startDate: { $lte: yearEnd },
    endDate: { $gte: yearStart }
  };

  if (excludeLeaveId) {
    usageQuery._id = { $ne: excludeLeaveId };
  }

  const leaves = await LeaveRequest.find(usageQuery).lean();

  const breakdown = {
    [LEAVE_TYPES.SICK]: 0,
    [LEAVE_TYPES.CASUAL]: 0,
    [LEAVE_TYPES.BEREAVEMENT]: 0
  };

  const summary = {
    totalPaid: LEAVE_POLICY.PAID_DAYS_PER_YEAR,
    paidUsed: 0,
    paidLeft: LEAVE_POLICY.PAID_DAYS_PER_YEAR,
    unpaidUsed: 0,
    unpaidLeft: LEAVE_POLICY.UNPAID_DAYS_PER_YEAR,
    maternityUsed: 0,
    maternityLeft: LEAVE_POLICY.MATERNITY_DAYS,
    menstrualThisMonth: 0,
    menstrualThisYear: 0,
    breakdown
  };

  leaves.forEach((leave) => {
    const daysInYear = getIntersectionDays(leave.startDate, leave.endDate, yearStart, yearEnd);

    if (daysInYear <= 0) {
      return;
    }

    if (NORMAL_PAID_LEAVE_TYPES.includes(leave.leaveType)) {
      summary.paidUsed += Math.min(leave.paidDays, daysInYear);
      summary.unpaidUsed += Math.min(leave.unpaidDays, daysInYear);
      breakdown[leave.leaveType] += daysInYear;
    }

    if (leave.leaveType === LEAVE_TYPES.UNPAID) {
      summary.unpaidUsed += daysInYear;
    }

    if (leave.leaveType === LEAVE_TYPES.MATERNITY) {
      summary.maternityUsed += daysInYear;
    }

    if (leave.leaveType === LEAVE_TYPES.MENSTRUAL) {
      summary.menstrualThisYear += daysInYear;
      summary.menstrualThisMonth += getIntersectionDays(leave.startDate, leave.endDate, monthStart, monthEnd);
    }
  });

  summary.paidLeft = Math.max(LEAVE_POLICY.PAID_DAYS_PER_YEAR - summary.paidUsed, 0);
  summary.unpaidLeft = Math.max(LEAVE_POLICY.UNPAID_DAYS_PER_YEAR - summary.unpaidUsed, 0);
  summary.maternityLeft = Math.max(LEAVE_POLICY.MATERNITY_DAYS - summary.maternityUsed, 0);

  return summary;
};

/**
 * Validates a leave request and calculates paid/unpaid day allocation.
 * @param {object} params Validation input.
 * @param {import("../models/User.js").User} params.user Authenticated employee.
 * @param {string} params.leaveType Requested leave type.
 * @param {string|number} params.numberOfDays Requested number of days.
 * @param {string|Date} params.startDate Requested start date.
 * @param {string|Date} params.endDate Requested end date.
 * @param {string|Date} [params.deliveryDate] Expected delivery date for maternity leave.
 * @param {boolean} [params.allowPastStart] Allows current-leave adjustments to retain past start dates.
 * @param {string|null} [params.excludeLeaveId] Leave id to exclude from overlap and balance calculations.
 * @returns {Promise<object>} Normalized request data and allocation.
 */
export const validateAndAllocateLeave = async ({
  user,
  leaveType,
  numberOfDays,
  startDate,
  endDate,
  deliveryDate,
  allowPastStart = false,
  excludeLeaveId = null
}) => {
  const normalizedStart = toStartOfDay(startDate);
  const normalizedEnd = toStartOfDay(endDate);
  const requestedDays = Number(numberOfDays);

  if (!Object.values(LEAVE_TYPES).includes(leaveType)) {
    throw new AppError("Please choose a valid leave type.", 400);
  }

  if (!normalizedStart || !normalizedEnd) {
    throw new AppError("Please provide valid start and end dates.", 400);
  }

  if (normalizedStart > normalizedEnd) {
    throw new AppError("Start date must be before or equal to end date.", 400);
  }

  if (!allowPastStart && normalizedStart < getToday()) {
    throw new AppError("Leave requests can only be created for today or a future date.", 400);
  }

  const calculatedDays = getInclusiveDays(normalizedStart, normalizedEnd);

  if (!Number.isInteger(requestedDays) || requestedDays < 1) {
    throw new AppError("Number of days must be a positive whole number.", 400);
  }

  if (requestedDays !== calculatedDays) {
    throw new AppError(`Number of days must match the selected date range (${calculatedDays} days).`, 400);
  }

  const overlap = await LeaveRequest.findOne(
    buildOverlapQuery(user._id, normalizedStart, normalizedEnd, ACTIVE_LEAVE_STATUSES, excludeLeaveId)
  ).lean();

  if (overlap) {
    throw new AppError("You already have a pending or approved leave request in this date range.", 409);
  }

  if (FEMALE_ONLY_LEAVE_TYPES.includes(leaveType) && user.gender !== GENDERS.FEMALE) {
    throw new AppError(`${leaveType} is available only for female employees.`, 403);
  }

  let paidDays = 0;
  let unpaidDays = 0;
  const committedUsage = await getLeaveUsage(user._id, {
    referenceDate: normalizedStart,
    statuses: ACTIVE_LEAVE_STATUSES,
    excludeLeaveId
  });

  if (NORMAL_PAID_LEAVE_TYPES.includes(leaveType)) {
    paidDays = Math.min(requestedDays, committedUsage.paidLeft);
    unpaidDays = requestedDays - paidDays;

    if (unpaidDays > committedUsage.unpaidLeft) {
      throw new AppError("This request exceeds the yearly unpaid leave limit of 12 weeks.", 400);
    }
  }

  if (leaveType === LEAVE_TYPES.UNPAID) {
    unpaidDays = requestedDays;

    if (unpaidDays > committedUsage.unpaidLeft) {
      throw new AppError("This request exceeds the yearly unpaid leave limit of 12 weeks.", 400);
    }
  }

  if (leaveType === LEAVE_TYPES.MENSTRUAL) {
    if (requestedDays > LEAVE_POLICY.MENSTRUAL_DAYS_PER_MONTH) {
      throw new AppError("Menstrual leave can be between 1 and 3 days per month.", 400);
    }

    if (committedUsage.menstrualThisMonth + requestedDays > LEAVE_POLICY.MENSTRUAL_DAYS_PER_MONTH) {
      throw new AppError("This request exceeds the monthly menstrual leave limit of 3 days.", 400);
    }

    paidDays = requestedDays;
  }

  let normalizedDeliveryDate = null;

  if (leaveType === LEAVE_TYPES.MATERNITY) {
    normalizedDeliveryDate = toStartOfDay(deliveryDate);

    if (!normalizedDeliveryDate) {
      throw new AppError("Expected delivery date is required for maternity leave.", 400);
    }

    if (requestedDays > LEAVE_POLICY.MATERNITY_DAYS) {
      throw new AppError("Maternity leave cannot exceed 26 weeks.", 400);
    }

    if (committedUsage.maternityUsed + requestedDays > LEAVE_POLICY.MATERNITY_DAYS) {
      throw new AppError("This request exceeds the 26-week maternity leave entitlement.", 400);
    }

    if (normalizedStart < normalizedDeliveryDate) {
      const preDeliveryEnd = normalizedEnd < normalizedDeliveryDate ? normalizedEnd : normalizedDeliveryDate;
      const preDeliveryDays = getInclusiveDays(normalizedStart, preDeliveryEnd);

      if (preDeliveryDays > LEAVE_POLICY.MATERNITY_PRE_DELIVERY_DAYS) {
        throw new AppError("Maternity leave before delivery cannot exceed 8 weeks.", 400);
      }
    }

    paidDays = requestedDays;
  }

  return {
    startDate: normalizedStart,
    endDate: normalizedEnd,
    deliveryDate: normalizedDeliveryDate,
    numberOfDays: requestedDays,
    paidDays,
    unpaidDays
  };
};
