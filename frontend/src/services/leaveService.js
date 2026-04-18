import { api } from "./api";

/**
 * Creates a leave request for the current employee.
 * @param {object} payload Leave payload.
 * @returns {Promise<object>} API response.
 */
export const createLeaveRequest = async (payload) => {
  const { data } = await api.post("/leaves", payload);
  return data;
};

/**
 * Fetches the current employee leave history.
 * @returns {Promise<object>} API response.
 */
export const getMyLeavesRequest = async () => {
  const { data } = await api.get("/leaves/mine");
  return data;
};

/**
 * Fetches the current employee leave dashboard summary.
 * @returns {Promise<object>} API response.
 */
export const getMyLeaveSummaryRequest = async () => {
  const { data } = await api.get("/leaves/summary");
  return data;
};

/**
 * Cancels a pending leave request.
 * @param {string} id Leave request id.
 * @returns {Promise<object>} API response.
 */
export const cancelLeaveRequest = async (id) => {
  const { data } = await api.delete(`/leaves/${id}`);
  return data;
};

/**
 * Creates a leave adjustment request for an existing leave.
 * @param {string} id Leave request id.
 * @param {object} payload Adjusted date range and reason.
 * @returns {Promise<object>} API response.
 */
export const createLeaveAdjustmentRequest = async (id, payload) => {
  const { data } = await api.post(`/leaves/${id}/adjustments`, payload);
  return data;
};

/**
 * Fetches the current employee leave adjustment history.
 * @returns {Promise<object>} API response.
 */
export const getMyLeaveAdjustmentsRequest = async () => {
  const { data } = await api.get("/leaves/adjustments/mine");
  return data;
};
