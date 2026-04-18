/**
 * Handles unmatched API routes.
 */
export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Centralized Express error handler.
 */
export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    message: error.isOperational || statusCode < 500
      ? error.message
      : "Something went wrong. Please try again later.",
    stack: isProduction ? undefined : error.stack
  });
};
