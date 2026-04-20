import { LeaveRequest } from "../models/LeaveRequest.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { LEAVE_STATUS, ROLES } from "../utils/constants.js";

/**
 * Returns notification counters for the authenticated user.
 */
export const getNotifications = asyncHandler(async (req, res) => {
  if (req.user.role === ROLES.ADMIN) {
    const pendingRequests = await LeaveRequest.countDocuments({
      status: LEAVE_STATUS.PENDING
    });

    return res.json({ pendingRequests, processedUpdates: 0 });
  }

  const processedUpdates = await LeaveRequest.countDocuments({
    employee: req.user._id,
    status: { $in: [LEAVE_STATUS.APPROVED, LEAVE_STATUS.REJECTED] },
    employeeViewed: false
  });

  return res.json({ pendingRequests: 0, processedUpdates });
});

/**
 * Marks processed leave updates as seen for an employee.
 */
export const markEmployeeNotificationsRead = asyncHandler(async (req, res) => {
  await LeaveRequest.updateMany(
    {
      employee: req.user._id,
      status: { $in: [LEAVE_STATUS.APPROVED, LEAVE_STATUS.REJECTED] },
      employeeViewed: false
    },
    { employeeViewed: true }
  );

  res.json({ message: "Notifications marked as read." });
});
