import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { downloadInvoice, getBooking } from "../api/bookingApi";
import { getErrorMessage } from "../api/apiClient";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { Badge, PriceDisplay } from "../components/ui/Card";
import { useBooking } from "../context/BookingContext";
import { formatDate, formatDuration, formatINR } from "../lib/format";
import type { Booking } from "../types";

export function ConfirmationPage() {
  const { bookingId } = useParams();
  const { reset } = useBooking();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!bookingId) return;
      setLoading(true);
      try {
        const data = await getBooking(bookingId);
        if (!cancelled) {
          setBooking(data);
          reset();
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [bookingId, reset]);

  async function handleDownload() {
    if (!bookingId) return;
    setDownloading(true);
    setError("");
    try {
      await downloadInvoice(bookingId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Layout>
      {loading && (
        <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-8 shadow-soft">
          <div className="h-4 w-40 rounded bg-neutral-200" />
          <div className="mt-4 h-8 w-64 rounded bg-neutral-200" />
          <div className="mt-6 h-32 rounded bg-neutral-100" />
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-danger-700">
          {error}
        </div>
      )}
      {booking && (
        <div
          className={`overflow-hidden rounded-2xl border bg-white shadow-elevated ${
            booking.status === "CONFIRMED" ? "border-success-200" : "border-warning-500/40"
          }`}
        >
          <div
            className={`px-6 py-8 text-white ${
              booking.status === "CONFIRMED"
                ? "bg-gradient-to-r from-secondary-600 to-primary-700"
                : "bg-gradient-to-r from-warning-600 to-primary-700"
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
              {booking.status === "CONFIRMED"
                ? "Booking confirmed"
                : "Booking received — processing"}
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              {booking.status === "CONFIRMED"
                ? "You're all set to fly"
                : "Payment received — ticket pending confirmation"}
            </h1>
            <p className="mt-2 text-white/90">
              PNR{" "}
              <span className="font-mono text-xl font-bold tracking-widest">{booking.pnr}</span>
            </p>
            {booking.status === "PROCESSING" && (
              <p className="mt-3 max-w-xl text-sm text-white/85">
                Our team is reviewing your booking. You will receive a confirmation email at{" "}
                {booking.contact.email} once your ticket is confirmed.
              </p>
            )}
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <Info label="Booking ID" value={booking.bookingId} mono />
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">Status</dt>
              <dd className="mt-1">
                <Badge tone={booking.status === "CONFIRMED" ? "success" : "warning"}>
                  {booking.status}
                </Badge>
              </dd>
            </div>
            <Info
              label="Flight"
              value={`${booking.flight.airline.name} · ${booking.flight.flightNumber}`}
            />
            <Info
              label="Route"
              value={`${booking.flight.origin.city} → ${booking.flight.destination.city}`}
            />
            <Info label="Travel date" value={formatDate(booking.flight.departureDate)} />
            <Info
              label="Schedule"
              value={`${booking.flight.departureTime} – ${booking.flight.arrivalTime} (${formatDuration(booking.flight.durationMinutes)})`}
            />
            <Info label="Cabin" value={booking.flight.cabinClass} />
            <Info
              label="Baggage"
              value={`Cabin ${booking.flight.baggage.cabin} · Check-in ${booking.flight.baggage.checkIn}`}
            />
          </div>

          <div className="border-t border-neutral-100 px-6 py-5">
            <h2 className="mb-3 font-semibold text-neutral-900">Passengers &amp; seats</h2>
            <ul className="space-y-2 text-sm text-neutral-700">
              {booking.passengers.map((p, i) => (
                <li
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-neutral-50 px-4 py-3"
                >
                  <span>
                    {p.title} {p.firstName} {p.lastName}
                  </span>
                  <span className="rounded-lg bg-primary-50 px-2.5 py-1 font-mono text-sm font-semibold text-primary-800">
                    {p.seatNumber ?? booking.seats[i]?.seatNumber ?? "—"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 border-t border-neutral-100 px-6 py-5 sm:grid-cols-2">
            <div>
              <h2 className="mb-3 font-semibold text-neutral-900">Payment</h2>
              <dl className="space-y-2 text-sm text-neutral-700">
                <div className="flex justify-between">
                  <dt>Status</dt>
                  <dd className="font-semibold text-success-700">{booking.payment.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Method</dt>
                  <dd className="uppercase">{booking.payment.method}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Transaction ID</dt>
                  <dd className="font-mono text-xs">{booking.payment.transactionId}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Amount paid</dt>
                  <dd>
                    <PriceDisplay amount={formatINR(booking.totalAmount)} />
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <h2 className="mb-3 font-semibold text-neutral-900">Fare breakdown</h2>
              <dl className="space-y-2 text-sm text-neutral-700">
                <div className="flex justify-between">
                  <dt>Base fare</dt>
                  <dd>{formatINR(booking.fare.baseFare)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Taxes</dt>
                  <dd>{formatINR(booking.fare.taxes)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Flight fare</dt>
                  <dd>{formatINR(booking.fare.totalFare)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Seat charges</dt>
                  <dd>{formatINR(booking.seatCharges)}</dd>
                </div>
                <div className="flex justify-between border-t border-neutral-100 pt-2 font-bold">
                  <dt>Total</dt>
                  <dd>
                    <PriceDisplay amount={formatINR(booking.totalAmount)} />
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-neutral-100 px-6 py-5">
            <Button size="lg" disabled={downloading} onClick={() => void handleDownload()}>
              {downloading ? "Preparing PDF…" : "Download invoice"}
            </Button>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3.5 text-base font-semibold text-neutral-800 transition hover:bg-neutral-50"
            >
              Back to home
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
}

function Info({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd
        className={`mt-1 text-sm font-medium text-neutral-900 ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
