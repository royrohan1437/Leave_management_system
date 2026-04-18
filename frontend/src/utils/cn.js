import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names and resolves Tailwind conflicts.
 * @param {...import("clsx").ClassValue} inputs Class name values.
 * @returns {string} Merged class name string.
 */
export const cn = (...inputs) => twMerge(clsx(inputs));
