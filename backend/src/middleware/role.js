import { AppError } from "../utils/AppError.js";

/**
 * Restricts a route to the provided roles.
 * @param {...string} roles Roles allowed to access the route.
 * @returns {Function} Express middleware.
 */
export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new AppError("You do not have permission to perform this action.", 403));
  }

  return next();
};
