export const ROLES = Object.freeze({
  ADMIN: "Admin",
  EMPLOYEE: "Employee"
});

export const GENDERS = Object.freeze({
  MALE: "male",
  FEMALE: "female"
});

export const LEAVE_STATUS = Object.freeze({
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected"
});

export const LEAVE_ADJUSTMENT_TYPES = Object.freeze({
  EXTENSION: "Extension",
  SHORTENING: "Shortening"
});

export const LEAVE_TYPES = Object.freeze({
  SICK: "Sick Leave",
  CASUAL: "Casual Leave",
  BEREAVEMENT: "Bereavement Leave",
  UNPAID: "Unpaid Leave",
  MATERNITY: "Maternity Leave",
  MENSTRUAL: "Menstrual Leave"
});

export const NORMAL_PAID_LEAVE_TYPES = [
  LEAVE_TYPES.SICK,
  LEAVE_TYPES.CASUAL,
  LEAVE_TYPES.BEREAVEMENT
];

export const FEMALE_ONLY_LEAVE_TYPES = [
  LEAVE_TYPES.MATERNITY,
  LEAVE_TYPES.MENSTRUAL
];

export const LEAVE_POLICY = Object.freeze({
  PAID_DAYS_PER_YEAR: 25,
  UNPAID_DAYS_PER_YEAR: 84,
  MATERNITY_DAYS: 182,
  MATERNITY_PRE_DELIVERY_DAYS: 56,
  MENSTRUAL_DAYS_PER_MONTH: 3
});

export const ACTIVE_LEAVE_STATUSES = [
  LEAVE_STATUS.PENDING,
  LEAVE_STATUS.APPROVED
];
