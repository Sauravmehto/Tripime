import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { confirmAdminBooking, listAdminBookings } from "../../api/adminApi";
import { getErrorMessage } from "../../api/apiClient";
import { Badge, Card, Spinner } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { clearAdminToken } from "../../lib/adminAuth";
import { formatDate, formatINR } from "../../lib/format";
import type { Booking } from "../../types";

function formatBookedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AdminBookingRequestsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState<Booking | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await listAdminBookings();
        if (!cancelled) setBookings(data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          clearAdminToken();
          navigate("/admin/login");
          return;
        }
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function handleConfirm(booking: Booking) {
    const result = await Swal.fire({
      title: "Confirm this ticket?",
      html: `<p style="text-align:left;font-size:14px;color:#334155">PNR <strong>${booking.pnr}</strong> · ${booking.flight.origin.code} → ${booking.flight.destination.code}<br/>A confirmation email will be sent to <strong>${booking.contact.email}</strong>.</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm ticket",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    setConfirmingId(booking.bookingId);
    try {
      const updated = await confirmAdminBooking(booking.bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.bookingId === updated.bookingId ? updated : b)),
      );
      if (selected?.bookingId === updated.bookingId) setSelected(updated);
      await Swal.fire({
        title: "Ticket confirmed",
        text: `Confirmation email queued for ${updated.contact.email}.`,
        icon: "success",
        confirmButtonColor: "#2563eb",
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        clearAdminToken();
        navigate("/admin/login");
        return;
      }
      await Swal.fire({
        title: "Confirm failed",
        text: getErrorMessage(err),
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setConfirmingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Flight Booking</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Customer bookings after payment — confirm tickets to send email.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs font-bold uppercase tracking-wide">
          <span className="rounded bg-warning-500 px-2 py-1 text-white">PROC</span>
          <span className="rounded bg-success-600 px-2 py-1 text-white">CONF</span>
          <span className="rounded bg-primary-600 px-2 py-1 text-white">PAY</span>
        </div>
      </div>

      {loading && (
        <div className="mt-8">
          <Spinner label="Loading bookings…" />
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-danger-200 bg-danger-50 p-4 text-danger-700">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <Card className="mt-6 text-center text-sm text-neutral-500">No bookings yet.</Card>
      )}

      {bookings.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-300 bg-white shadow-soft">
          <table className="w-full min-w-[1100px] border-collapse text-left text-[12px]">
            <thead className="border-b border-neutral-300 bg-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
              <tr>
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">Date</th>
                <th className="px-2 py-2">BID</th>
                <th className="px-2 py-2">PNR</th>
                <th className="px-2 py-2">DEP</th>
                <th className="px-2 py-2">ARR</th>
                <th className="px-2 py-2">Travel</th>
                <th className="px-2 py-2">Pax</th>
                <th className="px-2 py-2">Air</th>
                <th className="px-2 py-2">Pay</th>
                <th className="px-2 py-2">Bkg</th>
                <th className="px-2 py-2">Amt</th>
                <th className="px-2 py-2">Act</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => {
                const pending = booking.status === "PROCESSING";
                return (
                  <tr
                    key={booking.bookingId}
                    className={`border-b border-neutral-200 ${
                      pending ? "bg-warning-50/40" : "bg-white"
                    } hover:bg-primary-50/40`}
                  >
                    <td className="px-2 py-2 font-semibold text-neutral-500">
                      {bookings.length - index}
                    </td>
                    <td className="px-2 py-2">
                      <div className="font-medium text-neutral-800">
                        {formatBookedAt(booking.createdAt)}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {formatINR(booking.totalAmount)}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() => setSelected(booking)}
                        className="font-mono text-[11px] font-semibold text-primary-700 hover:underline"
                      >
                        {booking.bookingId}
                      </button>
                    </td>
                    <td className="px-2 py-2">
                      <span className="inline-block rounded border border-primary-300 bg-primary-50 px-1.5 py-0.5 font-mono text-[11px] font-bold text-primary-800">
                        {booking.pnr}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <div className="font-bold text-neutral-900">{booking.flight.origin.code}</div>
                      <div className="text-[10px] text-neutral-500">{booking.flight.origin.city}</div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="font-bold text-neutral-900">
                        {booking.flight.destination.code}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {booking.flight.destination.city}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div>{formatDate(booking.flight.departureDate)}</div>
                      <div className="text-[10px] text-neutral-500">
                        {booking.flight.departureTime}
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center font-semibold">{booking.passengerCount}</td>
                    <td className="px-2 py-2">
                      <div className="font-semibold">{booking.flight.airline.code}</div>
                      <div className="text-[10px] text-neutral-500">
                        {booking.flight.flightNumber}
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="uppercase">{booking.payment.method}</div>
                      <span className="text-[10px] font-semibold text-success-700">
                        {booking.payment.status}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <Badge tone={pending ? "warning" : "success"}>{booking.status}</Badge>
                      {booking.confirmedAt && (
                        <div className="mt-0.5 text-[10px] text-neutral-500">
                          {formatBookedAt(booking.confirmedAt)}
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2 font-bold text-neutral-900">
                      {formatINR(booking.totalAmount)}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => setSelected(booking)}
                          className="rounded bg-neutral-100 px-2 py-1 text-[10px] font-bold uppercase text-neutral-700 hover:bg-neutral-200"
                        >
                          View
                        </button>
                        {pending && (
                          <button
                            type="button"
                            disabled={confirmingId === booking.bookingId}
                            onClick={() => void handleConfirm(booking)}
                            className="rounded bg-primary-600 px-2 py-1 text-[10px] font-bold uppercase text-white hover:bg-primary-700 disabled:opacity-60"
                          >
                            {confirmingId === booking.bookingId ? "…" : "Confirm"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <BookingDetailModal
          booking={selected}
          confirming={confirmingId === selected.bookingId}
          onClose={() => setSelected(null)}
          onConfirm={() => void handleConfirm(selected)}
        />
      )}
    </div>
  );
}

function BookingDetailModal({
  booking,
  confirming,
  onClose,
  onConfirm,
}: {
  booking: Booking;
  confirming: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const pending = booking.status === "PROCESSING";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">{booking.bookingId}</h2>
            <p className="text-sm text-neutral-500">
              PNR <span className="font-mono font-semibold text-primary-700">{booking.pnr}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-neutral-500 hover:bg-neutral-100"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Section title="Flight">
            <p>
              {booking.flight.airline.name} · {booking.flight.flightNumber}
            </p>
            <p>
              {booking.flight.origin.city} ({booking.flight.origin.code}) →{" "}
              {booking.flight.destination.city} ({booking.flight.destination.code})
            </p>
            <p>{formatDate(booking.flight.departureDate)}</p>
            <p>
              {booking.flight.departureTime} – {booking.flight.arrivalTime}
            </p>
          </Section>

          <Section title="Contact">
            <p>{booking.contact.email}</p>
            <p>{booking.contact.phone}</p>
          </Section>

          <Section title="Passengers & seats">
            <ul className="space-y-1">
              {booking.passengers.map((p, i) => (
                <li key={i}>
                  {p.title} {p.firstName} {p.lastName} — Seat {p.seatNumber ?? "—"}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Payment">
            <p>Method: {booking.payment.method.toUpperCase()}</p>
            <p>Status: {booking.payment.status}</p>
            <p className="font-mono text-xs">Txn: {booking.payment.transactionId}</p>
            <p className="font-semibold">Total paid: {formatINR(booking.totalAmount)}</p>
          </Section>
        </div>

        {pending && (
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <Button size="lg" disabled={confirming} onClick={onConfirm}>
              {confirming ? "Confirming…" : "Confirm ticket & send email"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </p>
      <div className="space-y-0.5 text-sm text-neutral-700">{children}</div>
    </div>
  );
}
