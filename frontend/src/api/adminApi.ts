import { apiClient } from "./apiClient";
import { getAdminToken } from "../lib/adminAuth";
import type {
  AdminLoginResponse,
  AdminStats,
  Booking,
  Enquiry,
  EnquiryStatus,
  PackageInput,
  TravelPackage,
} from "../types";

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

export async function listAdminPackages(): Promise<TravelPackage[]> {
  const { data } = await apiClient.get<TravelPackage[]>("/api/admin/packages", {
    headers: authHeaders(),
  });
  return data;
}

export async function createAdminPackage(payload: PackageInput): Promise<TravelPackage> {
  const { data } = await apiClient.post<TravelPackage>("/api/admin/packages", payload, {
    headers: authHeaders(),
  });
  return data;
}

export async function updateAdminPackage(
  packageId: string,
  payload: PackageInput,
): Promise<TravelPackage> {
  const { data } = await apiClient.put<TravelPackage>(
    `/api/admin/packages/${packageId}`,
    payload,
    { headers: authHeaders() },
  );
  return data;
}

export async function deleteAdminPackage(packageId: string): Promise<void> {
  await apiClient.delete(`/api/admin/packages/${packageId}`, {
    headers: authHeaders(),
  });
}

export async function listAdminEnquiries(): Promise<Enquiry[]> {
  const { data } = await apiClient.get<Enquiry[]>("/api/admin/enquiries", {
    headers: authHeaders(),
  });
  return data;
}

export async function updateAdminEnquiryStatus(
  enquiryId: string,
  status: EnquiryStatus,
): Promise<Enquiry> {
  const { data } = await apiClient.post<Enquiry>(
    `/api/admin/enquiries/${enquiryId}/status`,
    { status },
    { headers: authHeaders() },
  );
  return data;
}
