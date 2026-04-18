const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Converts an input value into a local start-of-day Date.
 * @param {string|Date} value The incoming date value.
 * @returns {Date|null} A normalized Date or null when the value is invalid.
 */
export const toStartOfDay = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Returns today's date at local midnight.
 * @returns {Date} Today at the start of the day.
 */
export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/**
 * Calculates inclusive calendar days between two normalized dates.
 * @param {Date} startDate Start date.
 * @param {Date} endDate End date.
 * @returns {number} Inclusive number of days.
 */
export const getInclusiveDays = (startDate, endDate) => {
  return Math.floor((endDate.getTime() - startDate.getTime()) / MS_PER_DAY) + 1;
};

/**
 * Returns the beginning and end of the year containing the reference date.
 * @param {Date} referenceDate Date inside the desired year.
 * @returns {{start: Date, end: Date}} Year boundaries.
 */
export const getYearRange = (referenceDate = new Date()) => {
  const year = referenceDate.getFullYear();
  return {
    start: new Date(year, 0, 1, 0, 0, 0, 0),
    end: new Date(year, 11, 31, 23, 59, 59, 999)
  };
};

/**
 * Returns the beginning and end of the month containing the reference date.
 * @param {Date} referenceDate Date inside the desired month.
 * @returns {{start: Date, end: Date}} Month boundaries.
 */
export const getMonthRange = (referenceDate = new Date()) => {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  return {
    start: new Date(year, month, 1, 0, 0, 0, 0),
    end: new Date(year, month + 1, 0, 23, 59, 59, 999)
  };
};

/**
 * Counts days in the intersection of two date ranges.
 * @param {Date} firstStart First range start.
 * @param {Date} firstEnd First range end.
 * @param {Date} secondStart Second range start.
 * @param {Date} secondEnd Second range end.
 * @returns {number} Inclusive intersecting day count.
 */
export const getIntersectionDays = (firstStart, firstEnd, secondStart, secondEnd) => {
  const start = firstStart > secondStart ? firstStart : secondStart;
  const end = firstEnd < secondEnd ? firstEnd : secondEnd;

  if (start > end) {
    return 0;
  }

  return getInclusiveDays(toStartOfDay(start), toStartOfDay(end));
};
