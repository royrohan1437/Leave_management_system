import { useEffect } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdjustmentRequestCard } from "@/components/leave/AdjustmentRequestCard";
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
  const {
    adminLeaves,
    adminAdjustments,
    loading,
    actionId,
    fetchAdminLeaves,
    fetchAdminAdjustments,
    approveLeave,
    rejectLeave,
    approveAdjustment,
    rejectAdjustment
  } = useLeaveStore();
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchAdminLeaves({ status: LEAVE_STATUS.PENDING });
    fetchAdminAdjustments({ status: LEAVE_STATUS.PENDING });
    fetchNotifications();
  }, [fetchAdminAdjustments, fetchAdminLeaves, fetchNotifications]);

  /**
   * Refreshes all pending admin work queues and notification counters.
   * @returns {void}
   */
  const refreshPending = () => {
    fetchAdminLeaves({ status: LEAVE_STATUS.PENDING });
    fetchAdminAdjustments({ status: LEAVE_STATUS.PENDING });
    fetchNotifications();
  };

  /**
   * Approves a pending new leave request.
   * @param {string} id Leave request id.
   * @returns {Promise<void>}
   */
  const handleApprove = async (id) => {
    try {
      const data = await approveLeave(id);
      toast.success(data.message || "Leave request approved.");
      refreshPending();
    } catch (error) {
      toast.error(error.message);
    }
  };

  /**
   * Rejects a pending new leave request.
   * @param {string} id Leave request id.
   * @param {string} reason Optional rejection note.
   * @returns {Promise<void>}
   */
  const handleReject = async (id, reason) => {
    try {
      const data = await rejectLeave(id, reason);
      toast.success(data.message || "Leave request rejected.");
      refreshPending();
    } catch (error) {
      toast.error(error.message);
    }
  };

  /**
   * Approves a leave extension/shortening request.
   * @param {string} id Adjustment request id.
   * @returns {Promise<void>}
   */
  const handleAdjustmentApprove = async (id) => {
    try {
      const data = await approveAdjustment(id);
      toast.success(data.message || "Leave adjustment approved.");
      refreshPending();
    } catch (error) {
      toast.error(error.message);
    }
  };

  /**
   * Rejects a leave extension/shortening request.
   * @param {string} id Adjustment request id.
   * @param {string} reason Optional rejection note.
   * @returns {Promise<void>}
   */
  const handleAdjustmentReject = async (id, reason) => {
    try {
      const data = await rejectAdjustment(id, reason);
      toast.success(data.message || "Leave adjustment rejected.");
      refreshPending();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const hasNoPendingWork = !adminLeaves.length && !adminAdjustments.length;

  return (
    <div className="page-shell">
      <PageHeader
        title="Leave Requests"
        description="Review new leave requests and extension/shortening requests."
        actions={<Button variant="outline" onClick={refreshPending}>Refresh</Button>}
      />

      {loading && hasNoPendingWork ? <PageLoader label="Loading requests..." /> : null}

      {!loading && hasNoPendingWork ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No pending leave or adjustment requests.
          </CardContent>
        </Card>
      ) : null}

      {adminLeaves.length ? (
        <section className="grid gap-4">
          <h2 className="text-lg font-semibold">New Leave Requests</h2>
          {adminLeaves.map((leave) => (
            <LeaveRequestCard
              key={leave._id}
              leave={leave}
              actionId={actionId}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </section>
      ) : null}

      {adminAdjustments.length ? (
        <section className="mt-8 grid gap-4">
          <h2 className="text-lg font-semibold">Leave Adjustment Requests</h2>
          {adminAdjustments.map((adjustment) => (
            <AdjustmentRequestCard
              key={adjustment._id}
              adjustment={adjustment}
              actionId={actionId}
              onApprove={handleAdjustmentApprove}
              onReject={handleAdjustmentReject}
            />
          ))}
        </section>
      ) : null}
    </div>
  );
};
