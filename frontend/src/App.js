import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";
import { ROLES } from "@/utils/constants";
import { Login } from "@/pages/Login";
import { EmployeeDashboard } from "@/pages/EmployeeDashboard";
import { EmployeeApply } from "@/pages/EmployeeApply";
import { EmployeeHistory } from "@/pages/EmployeeHistory";
import { AdminLeaveRequests } from "@/pages/AdminLeaveRequests";
import { AdminEmployeeDashboard } from "@/pages/AdminEmployeeDashboard";
import { AdminHistory } from "@/pages/AdminHistory";

/**
 * Redirects authenticated users to their role-specific landing route.
 */
const HomeRedirect = () => {
  const { token, user } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.role === ROLES.ADMIN ? "/admin/requests" : "/employee/dashboard"} replace />;
};

/**
 * Application route tree.
 */
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomeRedirect />} />

        <Route element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]} />}>
          <Route element={<AppShell />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/apply" element={<EmployeeApply />} />
            <Route path="/employee/history" element={<EmployeeHistory />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route element={<AppShell />}>
            <Route path="/admin/requests" element={<AdminLeaveRequests />} />
            <Route path="/admin/employees" element={<AdminEmployeeDashboard />} />
            <Route path="/admin/history" element={<AdminHistory />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
}
