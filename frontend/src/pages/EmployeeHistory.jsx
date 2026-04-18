import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdjustmentHistoryTable } from "@/components/leave/AdjustmentHistoryTable";
import { LeaveAdjustmentForm } from "@/components/leave/LeaveAdjustmentForm";
import { LeaveHistoryTable } from "@/components/leave/LeaveHistoryTable";
import { PageLoader } from "@/components/ui/spinner";
import { useLeaveStore } from "@/store/leaveStore";
import { useNotificationStore } from "@/store/notificationStore";

/**
 * Employee leave history page.
 */
export const EmployeeHistory = () => {
  const {
    myLeaves,
    myAdjustments,
    loading,
    actionId,
    fetchMyLeaves,
    fetchMyAdjustments,
    cancelLeave,
    fetchSummary
  } = useLeaveStore();
  const { markEmployeeRead, fetchNotifications } = useNotificationStore();
  const [selectedLeave, setSelectedLeave] = useState(null);

  useEffect(() => {
    fetchMyLeaves();
    fetchMyAdjustments();
    markEmployeeRead().then(fetchNotifications);
  }, [fetchMyAdjustments, fetchMyLeaves, fetchNotifications, markEmployeeRead]);

  /**
   * Cancels a pending leave request after employee confirmation.
   * @param {string} id Leave request id.
   * @returns {Promise<void>}
   */
  const handleCancel = async (id) => {
    try {
      const data = await cancelLeave(id);
      toast.success(data.message || "Leave request cancelled.");
      fetchSummary();
    } catch (error) {
      toast.error(error.message);
    }
  };

  /**
   * Refreshes employee leave and adjustment data after an adjustment is submitted.
   * @returns {void}
   */
  const handleAdjustmentSubmitted = () => {
    fetchMyLeaves();
    fetchMyAdjustments();
    fetchSummary();
    fetchNotifications();
  };

  return (
    <div className="page-shell">
      <PageHeader
        title="Leave History"
        description="Track requests and ask to extend or shorten current and future leaves."
      />
      {loading && !myLeaves.length ? (
        <PageLoader label="Loading history..." />
      ) : (
        <>
          <LeaveHistoryTable
            leaves={myLeaves}
            onCancel={handleCancel}
            onAdjust={setSelectedLeave}
            actionId={actionId}
          />

          {selectedLeave ? (
            <LeaveAdjustmentForm
              leave={selectedLeave}
              onClose={() => setSelectedLeave(null)}
              onSubmitted={handleAdjustmentSubmitted}
            />
          ) : null}

          <div className="mt-8">
            <PageHeader
              title="Adjustment Requests"
              description="Extensions and shortenings sent to admin for approval."
            />
            <AdjustmentHistoryTable adjustments={myAdjustments} />
          </div>
        </>
      )}
    </div>
  );
};
