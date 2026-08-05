import { ArrowRight, CalendarDays, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../../lib/format";
import type { Flight } from "../../types";

interface FlightRouteBarProps {
  flight: Flight;
  passengers: number;
  /** Link back to the results page with the original search preserved. */
  changeFlightTo?: string;
  className?: string;
}

export function FlightRouteBar({
  flight,
  passengers,
  changeFlightTo,
  className = "",
}: FlightRouteBarProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-soft ${className}`}
    >
      <p className="flex items-center gap-2 text-sm font-bold text-neutral-900">
        {flight.origin.city.toUpperCase()} ({flight.origin.code})
        <ArrowRight className="size-4 text-primary-600" aria-hidden />
        {flight.destination.city.toUpperCase()} ({flight.destination.code})
      </p>

      <span className="hidden h-4 w-px bg-neutral-200 sm:block" aria-hidden />

      <p className="flex items-center gap-1.5 text-xs font-medium text-neutral-600">
        <CalendarDays className="size-3.5 text-neutral-400" aria-hidden />
        {formatDate(flight.departureDate)}
      </p>

      <p className="flex items-center gap-1.5 text-xs font-medium text-neutral-600">
        <Users className="size-3.5 text-neutral-400" aria-hidden />
        {passengers} {passengers === 1 ? "Adult" : "Adults"}
      </p>

      <span className="rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-success-700">
        Non-stop
      </span>

      {changeFlightTo && (
        <Link
          to={changeFlightTo}
          className="ml-auto text-xs font-semibold text-primary-700 transition hover:text-primary-800"
        >
          Choose different flight
        </Link>
      )}
    </div>
  );
}
