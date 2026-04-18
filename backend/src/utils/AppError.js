/**
 * Operational application error with an HTTP status code.
 */
export class AppError extends Error {
  /**
   * Creates a new application error.
   * @param {string} message Human-readable error message.
   * @param {number} statusCode HTTP status code.
   */
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
