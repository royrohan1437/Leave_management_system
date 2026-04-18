import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ROLES } from "../utils/constants.js";

/**
 * Creates a signed JWT for a user id.
 * @param {string} id User id.
 * @param {string} role User role.
 * @returns {string} Signed JWT.
 */
const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

/**
 * Authenticates a predefined user and returns a JWT.
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    throw new AppError("Email, password, and login role are required.", 400);
  }

  if (!Object.values(ROLES).includes(role)) {
    throw new AppError("Please select a valid login role.", 400);
  }

  const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (user.role !== role) {
    throw new AppError(`This account is registered as ${user.role}. Please use the correct login type.`, 403);
  }

  res.json({
    token: signToken(user._id, user.role),
    user: user.toSafeObject()
  });
});

/**
 * Returns the authenticated user's profile.
 */
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeObject() });
});
