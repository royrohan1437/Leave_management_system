import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
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
  const { adminLeaves, employeeRows, loading, fetchAdminLeaves, fetchEmployeeDashboard } = useLeaveStore();
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    fetchEmployeeDashboard();
    fetchAdminLeaves({ processed: "true" });
  }, [fetchAdminLeaves, fetchEmployeeDashboard]);

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
   * Applies filters to the leave history table.
   * @returns {void}
   */
  const applyFilters = () => {
    fetchAdminLeaves(buildQuery(filters));
  };

  /**
   * Clears filters and reloads processed histories.
   * @returns {void}
   */
  const resetFilters = () => {
    setFilters(defaultFilters);
    fetchAdminLeaves({ processed: "true" });
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
        {loading && !adminLeaves.length ? (
          <PageLoader label="Loading history..." />
        ) : (
          <LeaveHistoryTable
            leaves={adminLeaves}
            showEmployee
            emptyMessage="No leave records match these filters."
          />
        )}
      </div>
    </div>
  );
};
