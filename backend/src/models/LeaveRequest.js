import mongoose from "mongoose";
import { LEAVE_STATUS, LEAVE_TYPES } from "../utils/constants.js";

const leaveRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    employeeSnapshot: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      gender: { type: String, default: null }
    },
    leaveType: {
      type: String,
      enum: Object.values(LEAVE_TYPES),
      required: true
    },
    numberOfDays: {
      type: Number,
      required: true,
      min: 1
    },
    paidDays: {
      type: Number,
      default: 0,
      min: 0
    },
    unpaidDays: {
      type: Number,
      default: 0,
      min: 0
    },
    startDate: {
      type: Date,
      required: true,
      index: true
    },
    endDate: {
      type: Date,
      required: true,
      index: true
    },
    deliveryDate: {
      type: Date,
      default: null
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ""
    },
    status: {
      type: String,
      enum: Object.values(LEAVE_STATUS),
      default: LEAVE_STATUS.PENDING,
      index: true
    },
    adminActionAt: {
      type: Date,
      default: null
    },
    adminActionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ""
    },
    employeeViewed: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

leaveRequestSchema.index({ employee: 1, startDate: 1, endDate: 1 });
leaveRequestSchema.index({ status: 1, createdAt: -1 });

export const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);
