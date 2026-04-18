import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Reads the persisted auth token without coupling axios to the auth store.
 * @returns {string|null} JWT token.
 */
const getPersistedToken = () => {
  try {
    const raw = localStorage.getItem("lms-auth");
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.state?.token || null;
  } catch (_error) {
    return null;
  }
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = getPersistedToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
