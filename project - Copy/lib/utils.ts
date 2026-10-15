import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names, letting later classes win over earlier ones.
 *
 * Standard shadcn helper. Required by every component in components/ui/, which
 * was generated but this file was never committed alongside it.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
