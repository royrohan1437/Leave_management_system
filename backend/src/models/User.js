import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { GENDERS, ROLES } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true
    },
    gender: {
      type: String,
      enum: Object.values(GENDERS),
      default: null
    }
  },
  { timestamps: true }
);

/**
 * Compares a raw password with the stored password hash.
 * @param {string} candidatePassword The submitted password.
 * @returns {Promise<boolean>} Whether the password matches.
 */
userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Removes sensitive fields when serializing a user.
 * @returns {object} Sanitized user object.
 */
userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    gender: this.gender
  };
};

export const User = mongoose.model("User", userSchema);
