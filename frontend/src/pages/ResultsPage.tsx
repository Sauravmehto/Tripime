import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchFlights } from "../api/flightApi";
import { getErrorMessage } from "../api/apiClient";
import { FlightCard } from "../components/FlightCard";
import { Layout } from "../components/Layout";
import { Card } from "../components/ui/Card";
import { Field, Select } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";
import { useBooking } from "../context/BookingContext";
import { formatDate } from "../lib/format";
import type { Flight } from "../types";

type SortKey = "cheapest" | "earliest" | "latest" | "shortest";

function FlightSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft">
      <div className="flex justify-between p-5">
        <div className="space-y-2">
          <div className="h-5 w-32 rounded bg-neutral-200" />
          <div className="h-3 w-20 rounded bg-neutral-100" />
        </div>
        <div className="h-8 w-24 rounded bg-neutral-200" />
      </div>
      <div className="h-24 border-y border-neutral-100 bg-neutral-50/80" />
      <div className="flex gap-2 p-5">
        <div className="h-6 w-20 rounded-full bg-neutral-100" />
        <div className="h-6 w-20 rounded-full bg-neutral-100" />
        <div className="h-6 w-24 rounded-full bg-neutral-100" />
      </div>
    </div>
  );
}

export function ResultsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setSearch, setSelectedFlight } = useBooking();

  const origin = params.get("origin") || "DEL";
  const destination = params.get("destination") || "BOM";
  const date = params.get("date") || "2026-08-20";
  const passengers = Number(params.get("passengers") || 1);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<SortKey>("cheapest");
  const [airlineFilter, setAirlineFilter] = useState("all");
  const [refundableOnly, setRefundableOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSearch({ origin, destination, date, passengers });

    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await searchFlights({ origin, destination, date, passengers });
        if (!cancelled) setFlights(result.flights);
      } catch (err) {
        if (!cancelled) {
          setFlights([]);
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [origin, destination, date, passengers, setSearch]);

  const airlines = useMemo(
    () => Array.from(new Set(flights.map((f) => f.airline.name))).sort(),
    [flights],
  );

  const visible = useMemo(() => {
    let list = [...flights];
    if (airlineFilter !== "all") {
      list = list.filter((f) => f.airline.name === airlineFilter);
    }
    if (refundableOnly) {
      list = list.filter((f) => f.refundable);
    }
    list.sort((a, b) => {
      if (sort === "cheapest") return a.fare.totalFare - b.fare.totalFare;
      if (sort === "earliest") return a.departureTime.localeCompare(b.departureTime);
      if (sort === "latest") return b.departureTime.localeCompare(a.departureTime);
      return a.durationMinutes - b.durationMinutes;
    });
    return list;
  }, [flights, airlineFilter, refundableOnly, sort]);

  function handleSelect(flight: Flight) {
    setSelectedFlight(flight);
    navigate("/booking/passengers");
  }

  function clearFilters() {
    setAirlineFilter("all");
    setRefundableOnly(false);
    setSort("cheapest");
  }

  return (
    <Layout>
      <PageHeader
        backTo="/"
        backLabel="Edit search"
        title={`${origin} → ${destination}`}
        subtitle={
          <>
            {formatDate(date)} · {passengers} passenger{passengers > 1 ? "s" : ""}
            {!loading && !error ? ` · ${visible.length} flights` : ""}
          </>
        }
      />

      <Card className="mb-5 !p-4 lg:sticky lg:top-20 lg:z-10">
        <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
          <Field label="Sort">
            <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="cheapest">Cheapest</option>
              <option value="earliest">Earliest departure</option>
              <option value="latest">Latest departure</option>
              <option value="shortest">Shortest duration</option>
            </Select>
          </Field>
          <Field label="Airline">
            <Select value={airlineFilter} onChange={(e) => setAirlineFilter(e.target.value)}>
              <option value="all">All airlines</option>
              {airlines.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          </Field>
          <label className="flex h-11 items-center gap-2 text-sm font-medium text-neutral-700 sm:h-12">
            <input
              type="checkbox"
              className="size-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              checked={refundableOnly}
              onChange={(e) => setRefundableOnly(e.target.checked)}
            />
            Refundable only
          </label>
        </div>
      </Card>

      {loading && (
        <div className="space-y-4">
          <FlightSkeleton />
          <FlightSkeleton />
          <FlightSkeleton />
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-danger-500/20 bg-danger-50 p-4 text-danger-700">
          {error}
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <Card className="flex flex-col items-center py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-warning-50 text-warning-600">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" />
            </svg>
          </span>
          <p className="mt-4 font-semibold text-neutral-900">No flights matched your filters</p>
          <p className="mt-1 text-sm text-neutral-600">
            Try clearing filters or picking a different date.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 text-sm font-semibold text-primary-700 hover:text-primary-800"
          >
            Clear filters
          </button>
        </Card>
      )}

      <div className="space-y-4">
        {visible.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onSelect={() => handleSelect(flight)} />
        ))}
      </div>
    </Layout>
  );
}
