import { api } from "./api";

/**
 * Fetches leave requests for admins with optional filters.
 * @param {object} filters Query filters.
 * @returns {Promise<object>} API response.
 */
export const getAdminLeavesRequest = async (filters = {}) => {
  const { data } = await api.get("/admin/leaves", { params: filters });
  return data;
};

/**
 * Approves a pending leave request.
 * @param {string} id Leave request id.
 * @returns {Promise<object>} API response.
 */
export const approveLeaveRequest = async (id) => {
  const { data } = await api.patch(`/admin/leaves/${id}/approve`);
  return data;
};

/**
 * Rejects a pending leave request.
 * @param {string} id Leave request id.
 * @param {string} reason Rejection note.
 * @returns {Promise<object>} API response.
 */
export const rejectLeaveRequest = async (id, reason = "") => {
  const { data } = await api.patch(`/admin/leaves/${id}/reject`, { reason });
  return data;
};

/**
 * Fetches leave adjustment requests for admins with optional filters.
 * @param {object} filters Query filters.
 * @returns {Promise<object>} API response.
 */
export const getAdminAdjustmentsRequest = async (filters = {}) => {
  const { data } = await api.get("/admin/adjustments", { params: filters });
  return data;
};

/**
 * Approves a pending leave adjustment request.
 * @param {string} id Adjustment request id.
 * @returns {Promise<object>} API response.
 */
export const approveLeaveAdjustmentRequest = async (id) => {
  const { data } = await api.patch(`/admin/adjustments/${id}/approve`);
  return data;
};

/**
 * Rejects a pending leave adjustment request.
 * @param {string} id Adjustment request id.
 * @param {string} reason Rejection note.
 * @returns {Promise<object>} API response.
 */
export const rejectLeaveAdjustmentRequest = async (id, reason = "") => {
  const { data } = await api.patch(`/admin/adjustments/${id}/reject`, { reason });
  return data;
};

/**
 * Fetches employee leave dashboard rows for admins.
 * @returns {Promise<object>} API response.
 */
export const getEmployeeDashboardRequest = async () => {
  const { data } = await api.get("/admin/employees/summary");
  return data;
};

/**
 * Fetches leave history for a selected employee.
 * @param {string} employeeId Employee id.
 * @returns {Promise<object>} API response.
 */
export const getEmployeeHistoryRequest = async (employeeId) => {
  const { data } = await api.get(`/admin/employees/${employeeId}/leaves`);
  return data;
};
