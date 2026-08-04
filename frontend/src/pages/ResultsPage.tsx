import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { searchFlights } from "../api/flightApi";
import { getErrorMessage } from "../api/apiClient";
import { FlightCard } from "../components/FlightCard";
import { Layout } from "../components/Layout";
import { Card, Spinner } from "../components/ui/Card";
import { Field, Select } from "../components/ui/Input";
import { useBooking } from "../context/BookingContext";
import { formatDate } from "../lib/format";
import type { Flight } from "../types";

type SortKey = "cheapest" | "earliest" | "latest" | "shortest";

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

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/" className="text-sm font-medium text-primary-700 hover:text-primary-800">
          ← Edit search
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">
          {origin} → {destination}
        </h1>
        <p className="mt-1 text-neutral-600">
          {formatDate(date)} · {passengers} passenger{passengers > 1 ? "s" : ""}
          {!loading && !error ? ` · ${visible.length} flights` : ""}
        </p>
      </div>

      <Card className="mb-5 !p-4">
        <div className="flex flex-wrap items-end gap-4">
          <Field label="Sort" className="min-w-[160px]">
            <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="cheapest">Cheapest</option>
              <option value="earliest">Earliest departure</option>
              <option value="latest">Latest departure</option>
              <option value="shortest">Shortest duration</option>
            </Select>
          </Field>
          <Field label="Airline" className="min-w-[160px]">
            <Select value={airlineFilter} onChange={(e) => setAirlineFilter(e.target.value)}>
              <option value="all">All airlines</option>
              {airlines.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          </Field>
          <label className="mb-2.5 flex items-center gap-2 text-sm font-medium text-neutral-700">
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
        <Card>
          <Spinner label="Searching flights…" />
        </Card>
      )}
      {error && (
        <div className="rounded-2xl border border-danger-500/20 bg-danger-50 p-4 text-danger-700">
          {error}
        </div>
      )}
      {!loading && !error && visible.length === 0 && (
        <div className="rounded-2xl border border-warning-500/20 bg-warning-50 p-4 text-warning-600">
          No flights matched your filters.
        </div>
      )}

      <div className="space-y-4">
        {visible.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onSelect={() => handleSelect(flight)} />
        ))}
      </div>
    </Layout>
  );
}
