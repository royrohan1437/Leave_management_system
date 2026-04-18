import { useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmployeeSummaryTable } from "@/components/leave/EmployeeSummaryTable";
import { LeaveHistoryTable } from "@/components/leave/LeaveHistoryTable";
import { PageLoader } from "@/components/ui/spinner";
import { useLeaveStore } from "@/store/leaveStore";

/**
 * Admin employee balance dashboard and drill-down history.
 */
export const AdminEmployeeDashboard = () => {
  const {
    employeeRows,
    selectedEmployeeHistory,
    loading,
    fetchEmployeeDashboard,
    fetchEmployeeHistory,
    clearSelectedEmployee
  } = useLeaveStore();

  useEffect(() => {
    fetchEmployeeDashboard();

    return () => clearSelectedEmployee();
  }, [clearSelectedEmployee, fetchEmployeeDashboard]);

  return (
    <div className="page-shell">
      <PageHeader title="Employee Leave Dashboard" description="Open an employee row to view full leave history." />

      {loading && !employeeRows.length ? (
        <PageLoader label="Loading employees..." />
      ) : (
        <EmployeeSummaryTable rows={employeeRows} onSelect={fetchEmployeeHistory} />
      )}

      {selectedEmployeeHistory ? (
        <div className="mt-6">
          <PageHeader
            title={selectedEmployeeHistory.employee.name}
            description={selectedEmployeeHistory.employee.email}
          />
          <LeaveHistoryTable leaves={selectedEmployeeHistory.leaves} />
        </div>
      ) : null}
    </div>
  );
};
