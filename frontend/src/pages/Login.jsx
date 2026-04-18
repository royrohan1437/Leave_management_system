import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_420px]">
        <section className="flex flex-col justify-center rounded-lg border bg-card p-6 shadow-soft">
          <p className="text-sm font-semibold text-primary">Penthara Leave Desk</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-normal sm:text-5xl">
            Simple leave tracking for employees and admins.
          </h1>
          <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="rounded-md border bg-background p-4">Paid leave balance</div>
            <div className="rounded-md border bg-background p-4">Approval workflow</div>
            <div className="rounded-md border bg-background p-4">Policy checks</div>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Select your role and enter your credentials.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-5 grid grid-cols-2 rounded-md border bg-muted p-1">
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

            <form className="grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
              <Button type="submit" loading={loading}>
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
