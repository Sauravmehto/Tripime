import { apiClient } from "./apiClient";
import { getAdminToken } from "../lib/adminAuth";
import type { AdminLoginResponse, AdminStats, Booking } from "../types";

function authHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminLogin(
  username: string,
  password: string,
): Promise<AdminLoginResponse> {
  const { data } = await apiClient.post<AdminLoginResponse>("/api/admin/login", {
    username,
    password,
  });
  return data;
}

export async function listAdminBookings(): Promise<Booking[]> {
  const { data } = await apiClient.get<Booking[]>("/api/admin/bookings", {
    headers: authHeaders(),
  });
  return data;
}

export async function getAdminBooking(bookingId: string): Promise<Booking> {
  const { data } = await apiClient.get<Booking>(`/api/admin/bookings/${bookingId}`, {
    headers: authHeaders(),
  });
  return data;
}

export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await apiClient.get<AdminStats>("/api/admin/stats", {
    headers: authHeaders(),
  });
  return data;
}

export async function confirmAdminBooking(bookingId: string): Promise<Booking> {
  const { data } = await apiClient.post<Booking>(
    `/api/admin/bookings/${bookingId}/confirm`,
    {},
    { headers: authHeaders() },
  );
  return data;
}
