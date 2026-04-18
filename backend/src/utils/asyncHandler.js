/**
 * Wraps async route handlers and forwards errors to Express.
 * @param {Function} fn Express async route handler.
 * @returns {Function} Wrapped route handler.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
