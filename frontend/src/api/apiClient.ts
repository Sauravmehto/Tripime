import axios from "axios";

// Prefer same-origin requests in the browser so Vite's /api proxy handles
// the backend hop — that avoids CORS entirely during local development.
// Set VITE_API_BASE_URL only when you need to hit the API host directly.
const baseURL = import.meta.env.VITE_API_BASE_URL ?? "";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item) => (typeof item === "object" && item?.msg ? item.msg : String(item)))
        .join(", ");
    }
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
