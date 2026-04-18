import { format, parseISO } from "date-fns";

/**
 * Formats a backend date for display.
 * @param {string|Date} value Date value.
 * @returns {string} Display date.
 */
export const formatDate = (value) => {
  if (!value) return "-";

  const date = typeof value === "string" ? parseISO(value) : value;
  return Number.isNaN(date.getTime()) ? "-" : format(date, "dd MMM yyyy");
};

/**
 * Converts a date range into a compact display string.
 * @param {string|Date} startDate Start date.
 * @param {string|Date} endDate End date.
 * @returns {string} Date range label.
 */
export const formatDateRange = (startDate, endDate) => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

/**
 * Gets today's date in yyyy-mm-dd format for date inputs.
 * @returns {string} Date input value.
 */
export const getTodayInputValue = () => {
  const today = new Date();
  const offsetDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
};

/**
 * Converts an API date into yyyy-mm-dd format for date inputs.
 * @param {string|Date} value API date value.
 * @returns {string} Date input value.
 */
export const toDateInputValue = (value) => {
  if (!value) return "";

  const date = typeof value === "string" ? parseISO(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
};

/**
 * Calculates inclusive days between two yyyy-mm-dd values.
 * @param {string} startDate Date input start value.
 * @param {string} endDate Date input end value.
 * @returns {number} Inclusive day count.
 */
export const calculateInclusiveDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    return 0;
  }

  return Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
};

/**
 * Extracts a user-friendly API error message.
 * @param {unknown} error Error object from axios or JavaScript.
 * @returns {string} Friendly message.
 */
export const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
};
