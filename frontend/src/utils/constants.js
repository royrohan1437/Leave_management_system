export const ROLES = Object.freeze({
  ADMIN: "Admin",
  EMPLOYEE: "Employee"
});

export const LEAVE_STATUS = Object.freeze({
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected"
});

export const LEAVE_TYPES = Object.freeze({
  SICK: "Sick Leave",
  CASUAL: "Casual Leave",
  BEREAVEMENT: "Bereavement Leave",
  UNPAID: "Unpaid Leave",
  MATERNITY: "Maternity Leave",
  MENSTRUAL: "Menstrual Leave"
});

export const NORMAL_LEAVE_TYPES = [
  LEAVE_TYPES.SICK,
  LEAVE_TYPES.CASUAL,
  LEAVE_TYPES.BEREAVEMENT,
  LEAVE_TYPES.UNPAID
];

export const FEMALE_ONLY_LEAVE_TYPES = [
  LEAVE_TYPES.MATERNITY,
  LEAVE_TYPES.MENSTRUAL
];
