import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** shadcn-style class merger used by every admin UI component. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
