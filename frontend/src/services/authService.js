import { api } from "./api";

/**
 * Logs in a predefined user.
 * @param {object} credentials Login credentials.
 * @returns {Promise<object>} Auth response.
 */
export const loginRequest = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

/**
 * Fetches the authenticated user's profile.
 * @returns {Promise<object>} Profile response.
 */
export const meRequest = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};
