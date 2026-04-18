import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdjustmentHistoryTable } from "@/components/leave/AdjustmentHistoryTable";
import { AdminFilters } from "@/components/leave/AdminFilters";
import { LeaveHistoryTable } from "@/components/leave/LeaveHistoryTable";
import { PageLoader } from "@/components/ui/spinner";
import { useLeaveStore } from "@/store/leaveStore";

const defaultFilters = {
  status: "",
  employee: "",
  startDate: "",
  endDate: ""
};

/**
 * Admin processed request history with filters.
 */
export const AdminHistory = () => {
  const {
    adminLeaves,
    adminAdjustments,
    employeeRows,
    loading,
    fetchAdminLeaves,
    fetchAdminAdjustments,
    fetchEmployeeDashboard
  } = useLeaveStore();
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    fetchEmployeeDashboard();
    fetchAdminLeaves({ processed: "true" });
    fetchAdminAdjustments({ processed: "true" });
  }, [fetchAdminAdjustments, fetchAdminLeaves, fetchEmployeeDashboard]);

  /**
   * Updates a single admin history filter.
   * @param {string} field Filter field name.
   * @param {string} value Filter value.
   */
  const updateFilter = (field, value) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  /**
   * Removes empty filter values and defaults to processed requests.
   * @param {object} source Current filter state.
   * @returns {object} API query parameters.
   */
  const buildQuery = (source) => {
    const query = Object.fromEntries(Object.entries(source).filter(([, value]) => Boolean(value)));

    if (!query.status) {
      query.processed = "true";
    }

    return query;
  };

  /**
   * Applies filters to both leave and adjustment histories.
   * @returns {void}
   */
  const applyFilters = () => {
    const query = buildQuery(filters);
    fetchAdminLeaves(query);
    fetchAdminAdjustments(query);
  };

  /**
   * Clears filters and reloads processed histories.
   * @returns {void}
   */
  const resetFilters = () => {
    setFilters(defaultFilters);
    fetchAdminLeaves({ processed: "true" });
    fetchAdminAdjustments({ processed: "true" });
  };

  return (
    <div className="page-shell">
      <PageHeader title="History" description="Filter processed and pending leave records." />
      <AdminFilters
        filters={filters}
        employees={employeeRows}
        loading={loading}
        onChange={updateFilter}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      <div className="mt-5">
        {loading && !adminLeaves.length && !adminAdjustments.length ? (
          <PageLoader label="Loading history..." />
        ) : (
          <div className="grid gap-8">
            <section className="grid gap-4">
              <h2 className="text-lg font-semibold">Leave Requests</h2>
              <LeaveHistoryTable
                leaves={adminLeaves}
                showEmployee
                emptyMessage="No leave records match these filters."
              />
            </section>

            <section className="grid gap-4">
              <h2 className="text-lg font-semibold">Adjustment Requests</h2>
              <AdjustmentHistoryTable
                adjustments={adminAdjustments}
                showEmployee
                emptyMessage="No adjustment records match these filters."
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
