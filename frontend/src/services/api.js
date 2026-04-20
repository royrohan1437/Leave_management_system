import axios from "axios";

/**
 * Normalizes the configured API base URL so deployed frontends still work
 * when the environment variable points at the backend root URL.
 * @param {string | undefined} rawValue Configured API base URL.
 * @returns {string} Normalized API base URL that ends with /api.
 */
const normalizeApiBaseUrl = (rawValue) => {
  const fallbackUrl = "http://localhost:5000/api";

  if (!rawValue) {
    return fallbackUrl;
  }

  const trimmedValue = rawValue.trim().replace(/\/+$/, "");

  try {
    const url = new URL(trimmedValue);
    const normalizedPath = url.pathname.replace(/\/+$/, "");

    if (!normalizedPath || normalizedPath === "/") {
      url.pathname = "/api";
    } else if (!normalizedPath.endsWith("/api")) {
      url.pathname = `${normalizedPath}/api`;
    }

    return url.toString().replace(/\/+$/, "");
  } catch (_error) {
    return trimmedValue.endsWith("/api") ? trimmedValue : `${trimmedValue}/api`;
  }
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

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
