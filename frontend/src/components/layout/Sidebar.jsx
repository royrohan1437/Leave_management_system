import { NavLink } from "react-router-dom";
import {
  ClipboardList,
  FileClock,
  FilePlus2,
  History,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { ROLES } from "@/utils/constants";

const employeeNav = [
  { label: "Dashboard", to: "/employee/dashboard", icon: LayoutDashboard },
  { label: "Apply Leave", to: "/employee/apply", icon: FilePlus2 },
  { label: "Leave History", to: "/employee/history", icon: History, notificationKey: "processedUpdates" }
];

const adminNav = [
  { label: "Leave Requests", to: "/admin/requests", icon: ClipboardList, notificationKey: "pendingRequests" },
  { label: "Employee Dashboard", to: "/admin/employees", icon: Users },
  { label: "History", to: "/admin/history", icon: FileClock }
];

/**
 * Role-aware collapsible sidebar navigation.
 */
export const Sidebar = ({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
  onLogout,
  role,
  notifications
}) => {
  const navItems = role === ROLES.ADMIN ? adminNav : employeeNav;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-foreground/30 lg:hidden",
          mobileOpen ? "block" : "hidden"
        )}
        onClick={onCloseMobile}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card/95 shadow-soft backdrop-blur-xl transition-all duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <div className="relative flex h-16 items-center justify-between overflow-hidden border-b px-4">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(135deg,#2563EB,#7C3AED,#EC4899)]" />
          <div className={cn("min-w-0", collapsed && "lg:hidden")}>
            <p className="text-xl font-logo tracking-widest ">PENTHARA AI</p>
            <p className="text-xs text-muted-foreground">Leave Desk</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            onClick={onToggleCollapse}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const showDot = item.notificationKey && notifications?.[item.notificationKey] > 0;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    "relative flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    collapsed && "lg:justify-center lg:px-0"
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className={cn("truncate", collapsed && "lg:hidden")}>{item.label}</span>
                {showDot ? (
                  <span className="ml-auto h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card" />
                ) : null}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
            <span className={cn(collapsed && "lg:hidden")}>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
};
