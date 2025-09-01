import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getAuthToken(role) {
  if (role === 'parent') {
    return localStorage.getItem('parentToken');
  }
  return localStorage.getItem('token');
}
