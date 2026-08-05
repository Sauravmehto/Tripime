import { useState, type ReactNode } from "react";
import {
  Armchair,
  ChevronDown,
  Clock,
  Luggage,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { AirlineMark } from "./AirlineMark";
import { Button } from "../ui/Button";
import { formatDuration, formatINR } from "../../lib/format";
import type { Flight } from "../../types";

type DetailTab = "flight" | "fare" | "baggage" | "policy";

const DETAIL_TABS: { id: DetailTab; label: string }[] = [
  { id: "flight", label: "Flight detail" },
  { id: "fare", label: "Fare breakup" },
  { id: "baggage", label: "Baggage" },
  { id: "policy", label: "Fare policy" },
];

interface FlightResultCardProps {
  flight: Flight;
  passengers: number;
  onSelect: () => void;
  /** Position in the list, used to stagger the entrance animation. */
  index?: number;
  cheapest?: boolean;
  fastest?: boolean;
}

export function FlightResultCard({
  flight,
  passengers,
  onSelect,
  index = 0,
  cheapest = false,
  fastest = false,
}: FlightResultCardProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<DetailTab>("flight");

  return (
    <article
      className="animate-fade-up overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft transition hover:border-primary-200 hover:shadow-medium"
      style={{ animationDelay: `${Math.min(index, 6) * 45}ms` }}
    >
      {(cheapest || fastest || flight.availableSeats <= 5) && (
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-100 bg-neutral-50/80 px-4 py-1.5">
          {cheapest && (
            <Tag tone="success">
              <Sparkles className="size-3" aria-hidden /> Cheapest fare
            </Tag>
          )}
          {fastest && (
            <Tag tone="primary">
              <Clock className="size-3" aria-hidden /> Fastest flight
            </Tag>
          )}
          {flight.availableSeats <= 5 && (
            <Tag tone="danger">Only {flight.availableSeats} seats left</Tag>
          )}
        </div>
      )}

      <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="grid gap-3 sm:grid-cols-[minmax(120px,0.8fr)_minmax(0,1.6fr)] sm:items-center sm:gap-4">
          <div className="flex items-center gap-2.5">
            <AirlineMark code={flight.airline.code} name={flight.airline.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-900">
                {flight.airline.name}
              </p>
              <p className="truncate text-xs text-neutral-500">
                {flight.flightNumber} · {flight.aircraft}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
            <div className="min-w-0">
              <p className="text-lg font-bold leading-tight text-neutral-900 sm:text-xl">
                {flight.departureTime}
              </p>
              <p className="truncate text-xs font-semibold text-neutral-600">
                {flight.origin.code}
              </p>
            </div>

            <div className="flex flex-col items-center px-1 text-center">
              <p className="text-[11px] font-medium text-neutral-500">
                {formatDuration(flight.durationMinutes)}
              </p>
              <div className="relative my-1.5 w-16 sm:w-24">
                <div className="h-px w-full bg-neutral-300" />
                <Plane
                  className="absolute -top-[7px] left-1/2 size-3.5 -translate-x-1/2 rotate-90 bg-white text-primary-500"
                  aria-hidden
                />
              </div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-success-600">
                Non-stop
              </p>
            </div>

            <div className="min-w-0 text-right">
              <p className="text-lg font-bold leading-tight text-neutral-900 sm:text-xl">
                {flight.arrivalTime}
              </p>
              <p className="truncate text-xs font-semibold text-neutral-600">
                {flight.destination.code}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-3 sm:min-w-[168px] sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          <div className="text-left sm:text-right">
            <p className="text-xl font-bold text-neutral-900">{formatINR(flight.fare.totalFare)}</p>
            <p className="text-[11px] text-neutral-500">per adult</p>
          </div>
          <Button variant="coral" onClick={onSelect} className="min-w-[112px] uppercase">
            Book
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-100 bg-neutral-50/60 px-4 py-2">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 transition hover:text-primary-800"
        >
          View details
          <ChevronDown
            className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-neutral-600">
          <Chip>
            <Luggage className="size-3" aria-hidden /> {flight.baggage.checkIn} check-in
          </Chip>
          <Chip>{flight.baggage.cabin} cabin</Chip>
          <Chip tone={flight.refundable ? "success" : "neutral"}>
            {flight.refundable ? "Refundable" : "Non-refundable"}
          </Chip>
        </div>
      </div>

      {open && (
        <div className="animate-panel-in border-t border-neutral-200 bg-white">
          <div
            role="tablist"
            aria-label="Flight information"
            className="no-scrollbar flex gap-1 overflow-x-auto border-b border-neutral-100 px-3 pt-2"
          >
            {DETAIL_TABS.map((detail) => (
              <button
                key={detail.id}
                type="button"
                role="tab"
                aria-selected={tab === detail.id}
                onClick={() => setTab(detail.id)}
                className={`shrink-0 border-b-2 px-3 pb-2 text-xs font-semibold transition ${
                  tab === detail.id
                    ? "border-primary-600 text-primary-700"
                    : "border-transparent text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {detail.label}
              </button>
            ))}
          </div>

          <div className="p-4 text-sm text-neutral-700">
            {tab === "flight" && <FlightDetail flight={flight} />}
            {tab === "fare" && <FareBreakup flight={flight} passengers={passengers} />}
            {tab === "baggage" && <BaggageDetail flight={flight} />}
            {tab === "policy" && <PolicyDetail flight={flight} />}
          </div>
        </div>
      )}
    </article>
  );
}

function FlightDetail({ flight }: { flight: Flight }) {
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1">
        <span className="mt-1 flex flex-col items-center">
          <span className="size-2 rounded-full bg-primary-600" />
          <span className="my-1 h-10 w-px bg-neutral-200" />
          <span className="size-2 rounded-full bg-success-500" />
        </span>
        <div>
          <p className="font-semibold text-neutral-900">
            {flight.departureTime} · {flight.origin.city} ({flight.origin.code})
          </p>
          <p className="text-xs text-neutral-500">{flight.origin.airport}</p>
          <p className="my-2 inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-600">
            <Clock className="size-3" aria-hidden /> {formatDuration(flight.durationMinutes)}
          </p>
          <p className="font-semibold text-neutral-900">
            {flight.arrivalTime} · {flight.destination.city} ({flight.destination.code})
          </p>
          <p className="text-xs text-neutral-500">{flight.destination.airport}</p>
        </div>
      </div>

      <ul className="space-y-1.5 text-xs text-neutral-600 sm:min-w-[180px]">
        <li className="flex items-center gap-2">
          <Plane className="size-3.5 text-primary-600" aria-hidden /> {flight.aircraft}
        </li>
        <li className="flex items-center gap-2">
          <Armchair className="size-3.5 text-primary-600" aria-hidden /> {flight.cabinClass} ·{" "}
          {flight.availableSeats} seats left
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-primary-600" aria-hidden />{" "}
          {flight.refundable ? "Partially refundable" : "Non-refundable fare"}
        </li>
      </ul>
    </div>
  );
}

function FareBreakup({ flight, passengers }: { flight: Flight; passengers: number }) {
  const base = flight.fare.baseFare * passengers;
  const taxes = flight.fare.taxes * passengers;
  const total = flight.fare.totalFare * passengers;

  return (
    <dl className="max-w-sm space-y-2">
      <Row label={`Base fare × ${passengers}`} value={formatINR(base)} />
      <Row label={`Taxes and fees × ${passengers}`} value={formatINR(taxes)} />
      <div className="flex items-center justify-between border-t border-neutral-100 pt-2 text-base font-bold text-neutral-900">
        <dt>Total fare</dt>
        <dd>{formatINR(total)}</dd>
      </div>
    </dl>
  );
}

function BaggageDetail({ flight }: { flight: Flight }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <InfoTile title="Cabin baggage" value={flight.baggage.cabin} />
      <InfoTile title="Check-in baggage" value={flight.baggage.checkIn} />
      <p className="text-xs text-neutral-500 sm:col-span-2">
        Baggage allowance is per passenger. Excess baggage is charged by the airline at the airport.
      </p>
    </div>
  );
}

function PolicyDetail({ flight }: { flight: Flight }) {
  return (
    <ul className="space-y-2 text-xs text-neutral-600">
      <li>
        <span className="font-semibold text-neutral-900">Cancellation:</span>{" "}
        {flight.refundable
          ? "Refundable after airline and Tripime cancellation charges."
          : "This fare is non-refundable. Statutory taxes may still be refunded."}
      </li>
      <li>
        <span className="font-semibold text-neutral-900">Date change:</span> Allowed with airline
        change fee plus fare difference.
      </li>
      <li>
        <span className="font-semibold text-neutral-900">Seats:</span> Seat selection is chargeable
        and confirmed at checkout.
      </li>
    </ul>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-neutral-700">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function InfoTile({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">{title}</p>
      <p className="text-sm font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function Chip({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success";
}) {
  const tones = {
    neutral: "border-neutral-200 bg-white text-neutral-600",
    success: "border-success-200 bg-success-50 text-success-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Tag({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "success" | "primary" | "danger";
}) {
  const tones = {
    success: "bg-success-50 text-success-700",
    primary: "bg-primary-50 text-primary-700",
    danger: "bg-danger-50 text-danger-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
