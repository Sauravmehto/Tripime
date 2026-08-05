import type { Flight } from "../types";
import { formatDuration, formatINR } from "../lib/format";
import { Badge } from "./ui/Card";
import { Button } from "./ui/Button";
import { PriceDisplay } from "./ui/Card";

interface Props {
  flight: Flight;
  onSelect?: () => void;
  showSelect?: boolean;
}

export function FlightCard({ flight, onSelect, showSelect = true }: Props) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft transition hover:border-primary-200 hover:shadow-medium">
      <div className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-base font-semibold text-neutral-900 sm:text-lg">
              {flight.airline.name}
            </p>
            <Badge tone="primary">{flight.airline.code}</Badge>
          </div>
          <p className="mt-0.5 text-sm text-neutral-500">{flight.flightNumber}</p>
        </div>
        <div className="shrink-0 text-right">
          <PriceDisplay amount={formatINR(flight.fare.totalFare)} className="text-xl sm:text-2xl" />
          <p className="text-xs text-neutral-500">{flight.availableSeats} seats left</p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-y border-neutral-100 bg-neutral-50/80 px-4 py-4 sm:gap-3 sm:px-5 sm:py-5">
        <div className="min-w-0">
          <p className="text-xl font-bold text-neutral-900 sm:text-2xl">{flight.departureTime}</p>
          <p className="text-sm font-semibold text-primary-700">{flight.origin.code}</p>
          <p className="truncate text-xs text-neutral-500">{flight.origin.city}</p>
        </div>
        <div className="flex flex-col items-center px-1 text-center text-xs text-neutral-500 sm:px-2">
          <p className="font-medium text-neutral-600">{formatDuration(flight.durationMinutes)}</p>
          <div className="relative my-2 w-14 sm:w-28">
            <div className="h-px w-full bg-neutral-300" />
            <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500" />
          </div>
          <p>Non-stop</p>
        </div>
        <div className="min-w-0 text-right">
          <p className="text-xl font-bold text-neutral-900 sm:text-2xl">{flight.arrivalTime}</p>
          <p className="text-sm font-semibold text-primary-700">{flight.destination.code}</p>
          <p className="truncate text-xs text-neutral-500">{flight.destination.city}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap gap-2">
          <Badge>{flight.baggage.checkIn} check-in</Badge>
          <Badge>{flight.baggage.cabin} cabin</Badge>
          <Badge tone={flight.refundable ? "success" : "neutral"}>
            {flight.refundable ? "Refundable" : "Non-refundable"}
          </Badge>
          <Badge tone="neutral">{flight.aircraft}</Badge>
        </div>
        {showSelect && onSelect && (
          <Button onClick={onSelect} size="md" className="w-full sm:w-auto">
            Select flight
          </Button>
        )}
      </div>
    </article>
  );
}
