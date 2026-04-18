import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Verifies a bearer token and attaches the authenticated user to the request.
 */
export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new AppError("Authentication token is missing.", 401);
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (_error) {
    throw new AppError("Authentication token is invalid or expired.", 401);
  }

  const user = await User.findById(payload.id);

  if (!user) {
    throw new AppError("Authenticated user no longer exists.", 401);
  }

  req.user = user;
  next();
});
