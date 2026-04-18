import { api } from "./api";

/**
 * Fetches notification counters for the current user.
 * @returns {Promise<object>} Notification counters.
 */
export const getNotificationsRequest = async () => {
  const { data } = await api.get("/notifications");
  return data;
};

/**
 * Marks processed leave notifications as read for employees.
 * @returns {Promise<object>} API response.
 */
export const markEmployeeNotificationsReadRequest = async () => {
  const { data } = await api.patch("/notifications/employee/read");
  return data;
};
