import express from "express";
import {
  cancelLeaveRequest,
  createLeaveRequest,
  getMyLeaves,
  getMyLeaveSummary
} from "../controllers/leaveController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { ROLES } from "../utils/constants.js";

const router = express.Router();

router.use(protect, authorize(ROLES.EMPLOYEE));

router.route("/")
  .post(createLeaveRequest);

router.get("/mine", getMyLeaves);
router.get("/summary", getMyLeaveSummary);
router.delete("/:id", cancelLeaveRequest);

export default router;
