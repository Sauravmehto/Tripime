import type { ReactNode } from "react";
import { Badge, PriceDisplay } from "../ui/Card";
import { formatDate, formatDuration, formatINR } from "../../lib/format";
import type { Booking } from "../../types";

interface BookingSummaryCardProps {
  booking: Booking;
  /** Action buttons rendered at the bottom of the card (e.g. download invoice). */
  footer?: ReactNode;
}

export function BookingSummaryCard({ booking, footer }: BookingSummaryCardProps) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white shadow-elevated ${
        booking.status === "CONFIRMED" ? "border-success-200" : "border-warning-500/40"
      }`}
    >
      <div
        className={`px-5 py-8 sm:px-6 ${
          booking.status === "CONFIRMED"
            ? "bg-gradient-to-r from-secondary-600 to-primary-700"
            : "bg-gradient-to-r from-warning-600 to-primary-700"
        } text-white`}
      >
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
            {booking.status === "CONFIRMED" ? (
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" />
              </svg>
            )}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
              {booking.status === "CONFIRMED" ? "Booking confirmed" : "Booking received — processing"}
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              {booking.status === "CONFIRMED"
                ? "You're all set to fly"
                : "Payment received — ticket pending confirmation"}
            </h1>
            <p className="mt-2 text-white/90">
              PNR <span className="font-mono text-xl font-bold tracking-widest">{booking.pnr}</span>
            </p>
          </div>
        </div>

        {booking.status === "PROCESSING" && (
          <div className="mt-6 rounded-2xl bg-white/10 p-4 ring-1 ring-white/20">
            <p className="text-sm text-white/90">
              Our team is reviewing your booking. You will receive a confirmation email at{" "}
              <strong>{booking.contact.email}</strong> once your ticket is confirmed.
            </p>
            <ol className="mt-4 grid gap-3 sm:grid-cols-3">
              <TimelineStep done label="Payment received" />
              <TimelineStep active label="Admin review" />
              <TimelineStep label="Confirmation email" />
            </ol>
          </div>
        )}
      </div>

      <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
        <Info label="Booking ID" value={booking.bookingId} mono />
        <div>
          <dt className="text-xs uppercase tracking-wide text-neutral-500">Status</dt>
          <dd className="mt-1">
            <Badge tone={booking.status === "CONFIRMED" ? "success" : "warning"}>
              {booking.status}
            </Badge>
          </dd>
        </div>
        <Info label="Flight" value={`${booking.flight.airline.name} · ${booking.flight.flightNumber}`} />
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

      <div className="border-t border-neutral-100 px-5 py-5 sm:px-6">
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

      <div className="grid gap-4 border-t border-neutral-100 px-5 py-5 sm:grid-cols-2 sm:px-6">
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
            <div className="flex justify-between gap-2">
              <dt>Transaction ID</dt>
              <dd className="truncate font-mono text-xs">{booking.payment.transactionId}</dd>
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

      {footer && (
        <div className="flex flex-col gap-3 border-t border-neutral-100 px-5 py-5 sm:flex-row sm:flex-wrap sm:px-6">
          {footer}
        </div>
      )}
    </div>
  );
}

function TimelineStep({ label, done, active }: { label: string; done?: boolean; active?: boolean }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <span
        className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          done
            ? "bg-white text-secondary-700"
            : active
              ? "bg-white/90 text-warning-600 ring-2 ring-white/50"
              : "bg-white/20 text-white/70"
        }`}
      >
        {done ? "✓" : active ? "2" : "3"}
      </span>
      <span className={done || active ? "font-medium text-white" : "text-white/70"}>{label}</span>
    </li>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className={`mt-1 text-sm font-medium text-neutral-900 ${mono ? "font-mono text-xs break-all" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
