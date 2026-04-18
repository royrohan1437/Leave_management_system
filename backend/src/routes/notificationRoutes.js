import express from "express";
import {
  getNotifications,
  markEmployeeNotificationsRead
} from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import { ROLES } from "../utils/constants.js";

const router = express.Router();

router.use(protect);

router.get("/", getNotifications);
router.patch("/employee/read", authorize(ROLES.EMPLOYEE), markEmployeeNotificationsRead);

export default router;
