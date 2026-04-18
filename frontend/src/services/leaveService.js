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
