import { useEffect } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { LeaveHistoryTable } from "@/components/leave/LeaveHistoryTable";
import { PageLoader } from "@/components/ui/spinner";
import { useLeaveStore } from "@/store/leaveStore";
import { useNotificationStore } from "@/store/notificationStore";

/**
 * Employee leave history page.
 */
export const EmployeeHistory = () => {
  const { myLeaves, loading, actionId, fetchMyLeaves, cancelLeave, fetchSummary } = useLeaveStore();
  const { markEmployeeRead, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchMyLeaves();
    markEmployeeRead().then(fetchNotifications);
  }, [fetchMyLeaves, fetchNotifications, markEmployeeRead]);

  const handleCancel = async (id) => {
    try {
      const data = await cancelLeave(id);
      toast.success(data.message || "Leave request cancelled.");
      fetchSummary();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="page-shell">
      <PageHeader title="Leave History" description="Track pending, approved, and rejected requests." />
      {loading && !myLeaves.length ? (
        <PageLoader label="Loading history..." />
      ) : (
        <LeaveHistoryTable leaves={myLeaves} onCancel={handleCancel} actionId={actionId} />
      )}
    </div>
  );
};
