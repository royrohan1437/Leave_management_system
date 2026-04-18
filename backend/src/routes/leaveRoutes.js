import express from "express";
import {
  cancelLeaveRequest,
  createLeaveRequest,
  getMyLeaves,
  getMyLeaveSummary
} from "../controllers/leaveController.js";
import {
  createLeaveAdjustmentRequest,
  getMyLeaveAdjustments
} from "../controllers/leaveAdjustmentController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { ROLES } from "../utils/constants.js";

const router = express.Router();

router.use(protect, authorize(ROLES.EMPLOYEE));

router.route("/")
  .post(createLeaveRequest);

router.get("/mine", getMyLeaves);
router.get("/summary", getMyLeaveSummary);
router.get("/adjustments/mine", getMyLeaveAdjustments);
router.post("/:id/adjustments", createLeaveAdjustmentRequest);
router.delete("/:id", cancelLeaveRequest);

export default router;
