import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { ROLES } from "@/utils/constants";

/**
 * Login page with role toggle and password visibility control.
 */
export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, login, loading } = useAuthStore();
  const [role, setRole] = useState(ROLES.ADMIN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (token && user) {
    return <Navigate to={user.role === ROLES.ADMIN ? "/admin/requests" : "/employee/dashboard"} replace />;
  }

  /**
   * Submits login credentials and routes the user by role.
   * @param {SubmitEvent} event Form submit event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const signedInUser = await login({ email, password, role });
      toast.success(`Hi, ${signedInUser.name}`);
      const fallback = signedInUser.role === ROLES.ADMIN ? "/admin/requests" : "/employee/dashboard";
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 pt-24 sm:pt-10 md:py-20">
      <div className="ai-overlay pointer-events-none absolute inset-0 opacity-80" />
      <div className="ai-grid pointer-events-none absolute inset-0 opacity-70" />

      <div className="absolute right-4 top-4 z-20 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <div className="relative z-10 grid w-full max-w-[1200px] gap-6 lg:grid-cols-[1fr_430px]">
        <section className="enterprise-surface relative flex min-h-[560px] flex-col justify-between overflow-hidden rounded-lg p-8 md:p-12">
          <div className="absolute right-0 top-0 h-72 w-72 translate-x-24 -translate-y-24 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-64 w-64 translate-y-24 rounded-full bg-secondary/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <p className="text-sm font-semibold text-primary">Penthara Leave Desk</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-normal sm:text-5xl">
              Your time off, simplified.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Manage your leave, track your balance, and get back to living.            </p>
          </div>

          <div className="relative z-10 mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-md border bg-background/80 p-4">
              <p className="text-2xl font-semibold text-foreground">25</p>
              <p className="mt-1 text-sm text-muted-foreground">Paid days</p>
            </div>
            <div className="rounded-md border bg-background/80 p-4">
              <p className="text-2xl font-semibold text-foreground">12w</p>
              <p className="mt-1 text-sm text-muted-foreground">Unpaid cover</p>
            </div>
            <div className="rounded-md border bg-background/80 p-4">
              <p className="text-2xl font-semibold text-foreground">AI</p>
              <p className="mt-1 text-sm text-muted-foreground">Policy layer</p>
            </div>
          </div>

          <div className="relative z-10 mt-10 h-44 overflow-hidden rounded-lg border bg-background/70">
            <div className="absolute inset-0 ai-grid opacity-90" />
            <div className="absolute left-8 top-8 h-3 w-3 rounded-full bg-primary shadow-[0_0_24px_rgba(37,99,235,0.8)]" />
            <div className="absolute left-1/3 top-20 h-2.5 w-2.5 rounded-full bg-secondary shadow-[0_0_24px_rgba(124,58,237,0.7)]" />
            <div className="absolute bottom-9 right-14 h-3 w-3 rounded-full bg-accent shadow-[0_0_24px_rgba(236,72,153,0.65)]" />
            <div className="absolute left-10 top-10 h-px w-1/3 rotate-[16deg] bg-[linear-gradient(90deg,#2563EB,transparent)]" />
            <div className="absolute bottom-14 right-16 h-px w-1/2 -rotate-[12deg] bg-[linear-gradient(90deg,transparent,#7C3AED,#EC4899)]" />
            <div className="absolute left-1/2 top-8 rounded-md border bg-card/90 px-4 py-3 shadow-soft">
              <p className="text-xs font-semibold text-muted-foreground">Balance Signal</p>
              <p className="mt-1 text-sm font-semibold text-foreground">Ready for review</p>
            </div>
          </div>
        </section>

        <Card className="enterprise-surface self-center">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Select your role and enter your credentials.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-2">
            <div className="mb-6 grid grid-cols-2 rounded-md border bg-muted p-1">
              {[ROLES.ADMIN, ROLES.EMPLOYEE].map((option) => (
                <Button
                  key={option}
                  type="button"
                  variant={role === option ? "default" : "ghost"}
                  onClick={() => setRole(option)}
                >
                  {option}
                </Button>
              ))}
            </div>

            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="pr-10"
                    placeholder="Enter password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" variant="gradient" size="lg" loading={loading}>
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
