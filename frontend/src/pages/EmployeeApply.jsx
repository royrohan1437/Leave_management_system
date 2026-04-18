import { PageHeader } from "@/components/layout/PageHeader";
import { LeaveApplicationForm } from "@/components/leave/LeaveApplicationForm";

/**
 * Employee leave application page.
 */
export const EmployeeApply = () => (
  <div className="page-shell">
    <PageHeader title="Apply Leave" description="Submit a leave request for admin review." />
    <LeaveApplicationForm />
  </div>
);
