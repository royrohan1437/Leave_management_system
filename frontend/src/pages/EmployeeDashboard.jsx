import { useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/leave/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";
import { useLeaveStore } from "@/store/leaveStore";
import { LEAVE_TYPES } from "@/utils/constants";

/**
 * Employee dashboard with leave balances and breakdowns.
 */
export const EmployeeDashboard = () => {
  const { user } = useAuthStore();
  const { summary, pendingCount, loading, error, fetchSummary } = useLeaveStore();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (loading && !summary) {
    return <PageLoader label="Loading dashboard..." />;
  }

  const paidUsed = summary?.paidUsed || 0;
  const paidTotal = summary?.totalPaid || 25;
  const paidLeft = summary?.paidLeft ?? paidTotal;
  const paidPercent = Math.min((paidUsed / paidTotal) * 100, 100);
  const breakdown = summary?.breakdown || {};
  const isFemale = user?.gender === "female";

  return (
    <div className="page-shell">
      <PageHeader
        title={`Hi, ${user?.name}`}
        description="Your leave balance and recent policy usage."
      />

      {error ? <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Paid Leaves Left" value={`${paidLeft} / ${paidTotal}`} helper={`${paidUsed} day(s) used`} />
        <StatCard title="Pending Requests" value={pendingCount} helper="Awaiting admin action" />
        <StatCard title="Unpaid Leave Left" value={summary?.unpaidLeft ?? 84} helper="12 weeks yearly limit" />
      </div>

      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Paid Leave Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-3 rounded-md bg-muted">
            <div className="h-3 rounded-md bg-primary" style={{ width: `${paidPercent}%` }} />
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <StatCard title="Sick" value={breakdown[LEAVE_TYPES.SICK] || 0} helper="Days this year" />
            <StatCard title="Casual" value={breakdown[LEAVE_TYPES.CASUAL] || 0} helper="Days this year" />
            <StatCard title="Bereavement" value={breakdown[LEAVE_TYPES.BEREAVEMENT] || 0} helper="Days this year" />
          </div>
        </CardContent>
      </Card>

      {isFemale ? (
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <StatCard
            title="Maternity Leave"
            value={`${summary?.maternityUsed || 0} / 182`}
            helper="26 weeks paid"
          />
          <StatCard
            title="Menstrual This Month"
            value={`${summary?.menstrualThisMonth || 0} / 3`}
            helper="Paid days"
          />
          <StatCard
            title="Menstrual This Year"
            value={summary?.menstrualThisYear || 0}
            helper="Total days used"
          />
        </div>
      ) : null}
    </div>
  );
};
