import { useEffect, useState } from "react";

/**
 * Manages persisted dark/light mode on the document root.
 * @returns {{theme: string, toggleTheme: Function}} Theme controls.
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("lms-theme") || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("lms-theme", theme);
  }, [theme]);

  /**
   * Switches between the persisted light and dark themes.
   * @returns {void}
   */
  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
};
