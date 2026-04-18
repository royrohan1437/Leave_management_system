import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/utils/cn";

/**
 * Toggles between dark and light themes with a labeled switch control.
 */
export const ThemeToggle = ({ className }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className={cn(
        "group inline-flex h-12 items-center gap-3 rounded-md px-1 text-sm font-bold tracking-normal outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <span className={cn("min-w-10 transition-colors", isDark ? "text-muted-foreground/45" : "text-foreground")}>
        Light
      </span>

      <span
        className={cn(
          "relative h-12 w-24 overflow-hidden rounded-[24px] border shadow-inner transition-colors",
          isDark
            ? "border-black/30 bg-[#101522]"
            : "border-blue-300/80 bg-[#2563EB]"
        )}
      >
        <span
          className={cn(
            "absolute top-1/2 z-10 h-9 w-9 -translate-y-1/2 rounded-full transition-all duration-300",
            isDark
              ? "left-[52px] bg-white shadow-[inset_-12px_0_0_#101522,0_5px_14px_rgba(0,0,0,0.25)]"
              : "left-2 bg-white shadow-[0_5px_14px_rgba(38,86,164,0.28)]"
          )}
        />

        <span
          className={cn(
            "absolute h-2.5 w-2.5 rounded-full bg-white transition-opacity",
            isDark ? "left-6 top-3 opacity-0" : "left-[58px] top-4 opacity-100"
          )}
        />
        <span
          className={cn(
            "absolute h-1.5 w-1.5 rounded-full bg-white transition-opacity",
            isDark ? "left-5 top-7 opacity-0" : "left-[48px] top-7 opacity-100"
          )}
        />

        <span
          className={cn(
            "absolute left-7 top-3 h-1.5 w-1.5 rotate-45 bg-white transition-opacity",
            isDark ? "opacity-100" : "opacity-0"
          )}
        />
        <span
          className={cn(
            "absolute left-11 top-5 h-1 w-1 rounded-full bg-white transition-opacity",
            isDark ? "opacity-100" : "opacity-0"
          )}
        />
        <span
          className={cn(
            "absolute left-9 top-8 h-1.5 w-1.5 rotate-45 bg-white transition-opacity",
            isDark ? "opacity-100" : "opacity-0"
          )}
        />
      </span>

      <span className={cn("min-w-9 transition-colors", isDark ? "text-foreground" : "text-muted-foreground/45")}>
        Dark
      </span>
    </button>
  );
};
