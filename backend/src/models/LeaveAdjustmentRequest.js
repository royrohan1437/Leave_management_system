import mongoose from "mongoose";
import { LEAVE_ADJUSTMENT_TYPES, LEAVE_STATUS } from "../utils/constants.js";

const leaveAdjustmentRequestSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    leave: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveRequest",
      required: true,
      index: true
    },
    employeeSnapshot: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      gender: { type: String, default: null }
    },
    originalLeaveSnapshot: {
      leaveType: { type: String, required: true },
      numberOfDays: { type: Number, required: true },
      paidDays: { type: Number, required: true },
      unpaidDays: { type: Number, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      deliveryDate: { type: Date, default: null },
      status: { type: String, required: true }
    },
    adjustmentType: {
      type: String,
      enum: Object.values(LEAVE_ADJUSTMENT_TYPES),
      required: true
    },
    requestedStartDate: {
      type: Date,
      required: true
    },
    requestedEndDate: {
      type: Date,
      required: true
    },
    requestedNumberOfDays: {
      type: Number,
      required: true,
      min: 1
    },
    requestedPaidDays: {
      type: Number,
      required: true,
      min: 0
    },
    requestedUnpaidDays: {
      type: Number,
      required: true,
      min: 0
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

leaveAdjustmentRequestSchema.index({ leave: 1, status: 1 });
leaveAdjustmentRequestSchema.index({ employee: 1, createdAt: -1 });

export const LeaveAdjustmentRequest = mongoose.model(
  "LeaveAdjustmentRequest",
  leaveAdjustmentRequestSchema
);
