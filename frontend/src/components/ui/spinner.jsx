import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * Reusable loading spinner.
 */
export const Spinner = ({ className }) => (
  <Loader2 className={cn("h-5 w-5 animate-spin text-primary", className)} />
);

/**
 * Centered page-level loader.
 */
export const PageLoader = ({ label = "Loading..." }) => (
  <div className="flex min-h-72 items-center justify-center">
    <div className="flex items-center gap-3 rounded-md border bg-card px-4 py-3 text-sm text-muted-foreground shadow-soft">
      <Spinner />
      <span>{label}</span>
    </div>
  </div>
);
