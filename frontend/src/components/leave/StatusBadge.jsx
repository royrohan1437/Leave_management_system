import { Badge } from "@/components/ui/badge";
import { LEAVE_STATUS } from "@/utils/constants";

/**
 * Renders a leave status with consistent color semantics.
 */
export const StatusBadge = ({ status }) => {
  const variantMap = {
    [LEAVE_STATUS.PENDING]: "pending",
    [LEAVE_STATUS.APPROVED]: "approved",
    [LEAVE_STATUS.REJECTED]: "rejected"
  };

  return <Badge variant={variantMap[status] || "secondary"}>{status}</Badge>;
};
