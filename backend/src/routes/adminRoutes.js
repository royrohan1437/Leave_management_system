import express from "express";
import {
  approveLeaveRequest,
  getEmployeeLeaveDashboard,
  getEmployeeLeaveHistory,
  getLeaveRequests,
  rejectLeaveRequest
} from "../controllers/adminController.js";
import {
  approveLeaveAdjustmentRequest,
  getLeaveAdjustmentRequests,
  rejectLeaveAdjustmentRequest
} from "../controllers/leaveAdjustmentController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { ROLES } from "../utils/constants.js";

const router = express.Router();

router.use(protect, authorize(ROLES.ADMIN));

router.get("/leaves", getLeaveRequests);
router.patch("/leaves/:id/approve", approveLeaveRequest);
router.patch("/leaves/:id/reject", rejectLeaveRequest);
router.get("/adjustments", getLeaveAdjustmentRequests);
router.patch("/adjustments/:id/approve", approveLeaveAdjustmentRequest);
router.patch("/adjustments/:id/reject", rejectLeaveAdjustmentRequest);
router.get("/employees/summary", getEmployeeLeaveDashboard);
router.get("/employees/:employeeId/leaves", getEmployeeLeaveHistory);

export default router;
