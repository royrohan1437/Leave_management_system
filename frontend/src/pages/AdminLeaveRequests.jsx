import { useEffect } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { LeaveRequestCard } from "@/components/leave/LeaveRequestCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/spinner";
import { useLeaveStore } from "@/store/leaveStore";
import { useNotificationStore } from "@/store/notificationStore";
import { LEAVE_STATUS } from "@/utils/constants";

/**
 * Admin page for pending leave approvals.
 */
export const AdminLeaveRequests = () => {
  const { adminLeaves, loading, actionId, fetchAdminLeaves, approveLeave, rejectLeave } = useLeaveStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchAdminLeaves({ status: LEAVE_STATUS.PENDING });
    fetchNotifications();
  }, [fetchAdminLeaves, fetchNotifications]);

  const refreshPending = () => {
    fetchAdminLeaves({ status: LEAVE_STATUS.PENDING });
    fetchNotifications();
  };

  const handleApprove = async (id) => {
    try {
      const data = await approveLeave(id);
      toast.success(data.message || "Leave request approved.");
      refreshPending();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleReject = async (id, reason) => {
    try {
      const data = await rejectLeave(id, reason);
      toast.success(data.message || "Leave request rejected.");
      refreshPending();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Leave Requests"
        description="Review pending employee leave requests."
        actions={<Button variant="outline" onClick={refreshPending}>Refresh</Button>}
      />

      {loading && !adminLeaves.length ? <PageLoader label="Loading requests..." /> : null}

      {!loading && !adminLeaves.length ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No pending leave requests.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4">
        {adminLeaves.map((leave) => (
          <LeaveRequestCard
            key={leave._id}
            leave={leave}
            actionId={actionId}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </div>
    </div>
  );
};
