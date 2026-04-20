import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { cn } from "@/utils/cn";
import { ROLES } from "@/utils/constants";

/**
 * Authenticated app frame with sidebar, top bar, and notifications.
 */
export const AppShell = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { pendingRequests, processedUpdates, fetchNotifications, reset } = useNotificationStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 45000);

    return () => window.clearInterval(interval);
  }, [fetchNotifications]);

  const notificationCount = user?.role === ROLES.ADMIN ? pendingRequests : processedUpdates;

  /**
   * Clears the authenticated session and returns to login.
   * @returns {void}
   */
  const handleLogout = () => {
    logout();
    reset();
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="ai-overlay pointer-events-none fixed inset-x-0 top-0 h-[960px] opacity-70" />
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={handleLogout}
        role={user?.role}
        notifications={{ pendingRequests, processedUpdates }}
      />

      <div className={cn("relative z-10 min-h-screen transition-all duration-200", collapsed ? "lg:pl-20" : "lg:pl-64")}>
        <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div className="min-w-0">
                <p className="truncate text-xl font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative rounded-md border bg-card p-2 shadow-soft">
                <Bell className="h-4 w-4 text-muted-foreground" />
                {notificationCount > 0 ? (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
                ) : null}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
