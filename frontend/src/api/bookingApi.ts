import { apiClient } from "./apiClient";
import type { Booking, BookingCreatePayload } from "../types";

export async function createBooking(payload: BookingCreatePayload): Promise<Booking> {
  const { data } = await apiClient.post<Booking>("/api/bookings", payload);
  return data;
}

export async function getBooking(bookingId: string): Promise<Booking> {
  const { data } = await apiClient.get<Booking>(`/api/bookings/${bookingId}`);
  return data;
}

export async function downloadInvoice(bookingId: string): Promise<void> {
  const response = await apiClient.get(`/api/bookings/${bookingId}/invoice`, {
    responseType: "blob",
  });
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `Flight-Invoice-${bookingId}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}
