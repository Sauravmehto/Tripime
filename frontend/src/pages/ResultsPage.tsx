import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PlaneTakeoff, SearchX, SlidersHorizontal, X } from "lucide-react";
import { searchFlights } from "../api/flightApi";
import { getErrorMessage } from "../api/apiClient";
import { Layout } from "../components/Layout";
import { FlightDateStrip } from "../components/flights/FlightDateStrip";
import {
  FlightFareHint,
  type NeighborFareHint,
} from "../components/flights/FlightFareHint";
import { FlightFiltersSidebar } from "../components/flights/FlightFiltersSidebar";
import { FlightResultCard } from "../components/flights/FlightResultCard";
import {
  FlightSearchModifyBar,
  type ModifySearchValues,
} from "../components/flights/FlightSearchModifyBar";
import { FlightSortBar } from "../components/flights/FlightSortBar";
import { InventoryNotice } from "../components/marketing/InventoryNotice";
import { FaqList, type FaqItem } from "../components/marketing/FaqList";
import {
  EMPTY_FILTERS,
  airlineFacets,
  applyFilters,
  countActiveFilters,
  priceBounds,
  slotCounts,
  sortFlights,
  sortTeasers,
  type FlightFilters,
  type SortKey,
} from "../components/flights/flightFilters";
import { Button } from "../components/ui/Button";
import { useBooking } from "../context/BookingContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { INVENTORY_END, INVENTORY_START, addDays, clampDate } from "../lib/airports";
import { formatDate } from "../lib/format";
import type { Flight } from "../types";

const FLIGHT_FAQS: FaqItem[] = [
  {
    question: "Is the fare shown per person or the total?",
    answer:
      "Prices here are per adult. Your exact total for all travellers is shown clearly on the next step before you pay — no surprises.",
  },
  {
    question: "Can I change dates or passengers after booking?",
    answer:
      "Not directly on the site yet. Call or WhatsApp us with your booking reference and we'll help you rebook the best way.",
  },
  {
    question: "What if my route isn't listed here?",
    answer:
      "We're covering select domestic routes for now. Call or WhatsApp us — our team can often still help you book it directly.",
  },
];

export function ResultsPage() {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSearch, setSelectedFlight } = useBooking();

  const origin = params.get("origin") || "DEL";
  const destination = params.get("destination") || "BOM";

  usePageTitle(
    `Flights ${origin} to ${destination}`,
    `Compare and book flights from ${origin} to ${destination} on Tripime with transparent pricing.`,
  );
  const date = params.get("date") || "2026-08-20";
  const passengers = Number(params.get("passengers") || 1);

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<SortKey>("cheapest");
  const [filters, setFilters] = useState<FlightFilters>(EMPTY_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [fareHint, setFareHint] = useState<NeighborFareHint | null>(null);

  useEffect(() => {
    let cancelled = false;
    setSearch({ origin, destination, date, passengers });
    setFilters(EMPTY_FILTERS);
    setFareHint(null);

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

  // Probe ±2 days for a cheaper fare tip (doesn't block the main results).
  useEffect(() => {
    if (loading || flights.length === 0) return;

    let cancelled = false;
    const currentMin = Math.min(...flights.map((f) => f.fare.totalFare));
    const candidates = [-2, 2]
      .map((offset) => addDays(date, offset))
      .filter((d) => d >= INVENTORY_START && d <= INVENTORY_END && d !== date)
      .map((d) => clampDate(d, INVENTORY_START, INVENTORY_END));

    async function probe() {
      const results = await Promise.allSettled(
        candidates.map((d) =>
          searchFlights({ origin, destination, date: d, passengers }).then((r) => ({
            date: d,
            flights: r.flights,
          })),
        ),
      );
      if (cancelled) return;

      let best: NeighborFareHint | null = null;
      for (const result of results) {
        if (result.status !== "fulfilled" || result.value.flights.length === 0) continue;
        const minFare = Math.min(...result.value.flights.map((f) => f.fare.totalFare));
        const savings = currentMin - minFare;
        if (savings < 200) continue;
        if (!best || savings > best.savings) {
          best = { date: result.value.date, minFare, savings };
        }
      }
      setFareHint(best);
    }

    void probe();
    return () => {
      cancelled = true;
    };
  }, [loading, flights, origin, destination, date, passengers]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const bounds = useMemo(() => priceBounds(flights), [flights]);
  const facets = useMemo(() => airlineFacets(flights), [flights]);
  const counts = useMemo(() => slotCounts(flights), [flights]);
  const teasers = useMemo(() => sortTeasers(flights), [flights]);
  const activeCount = countActiveFilters(filters, bounds);

  const visible = useMemo(
    () => sortFlights(applyFilters(flights, filters), sort),
    [flights, filters, sort],
  );

  const cheapestId = teasers.cheapest
    ? sortFlights(flights, "cheapest")[0]?.id
    : undefined;
  const fastestId = teasers.shortest ? sortFlights(flights, "shortest")[0]?.id : undefined;

  function handleSelect(flight: Flight) {
    setSelectedFlight(flight);
    navigate("/booking/passengers");
  }

  function handleModifySearch(values: ModifySearchValues) {
    setParams({
      origin,
      destination: values.destination,
      date: values.date,
      passengers: String(values.passengers),
    });
  }

  function handleDateChange(nextDate: string) {
    setParams({ origin, destination, date: nextDate, passengers: String(passengers) });
  }

  const sidebar = (
    <FlightFiltersSidebar
      filters={filters}
      onChange={setFilters}
      facets={facets}
      bounds={bounds}
      slotCounts={counts}
      activeCount={activeCount}
      onClear={() => setFilters(EMPTY_FILTERS)}
    />
  );

  return (
    <Layout>
      <div className="space-y-4 pb-24 lg:pb-0">
        <FlightSearchModifyBar
          origin={origin}
          destination={destination}
          date={date}
          passengers={passengers}
          onSearch={handleModifySearch}
        />

        <InventoryNotice className="mx-1" />

        <FlightDateStrip date={date} onChange={handleDateChange} />

        {!loading && <FlightFareHint hint={fareHint} onSelectDate={handleDateChange} />}

        <div className="grid gap-5 lg:grid-cols-[268px_minmax(0,1fr)] lg:items-start">
          <aside className="hidden lg:sticky lg:top-20 lg:block">{sidebar}</aside>

          <div className="space-y-4">
            <FlightSortBar value={sort} onChange={setSort} teasers={teasers} />

            <div className="flex flex-wrap items-center justify-between gap-2 px-1">
              <p className="text-sm text-neutral-600">
                {loading ? (
                  "Searching flights…"
                ) : (
                  <>
                    <span className="font-semibold text-neutral-900">{visible.length}</span> flight
                    {visible.length === 1 ? "" : "s"} from {origin} to {destination}
                  </>
                )}
              </p>
              <p className="text-xs text-neutral-500">
                {formatDate(date)} · {passengers} {passengers === 1 ? "traveller" : "travellers"}
              </p>
            </div>

            {loading && (
              <div className="space-y-4">
                <FlightSkeleton />
                <FlightSkeleton />
                <FlightSkeleton />
              </div>
            )}

            {error && !loading && (
              <div
                role="alert"
                aria-live="assertive"
                className="rounded-2xl border border-danger-200 bg-danger-50 p-4 text-sm text-danger-700"
              >
                {error}
              </div>
            )}

            {!loading && !error && visible.length === 0 && (
              <div className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white py-12 text-center shadow-soft">
                <span className="flex size-12 items-center justify-center rounded-full bg-warning-50 text-warning-600">
                  <SearchX className="size-6" aria-hidden />
                </span>
                <p className="mt-4 font-semibold text-neutral-900">
                  No flights matched your filters
                </p>
                <p className="mt-1 max-w-sm text-sm text-neutral-600">
                  Try clearing a filter or picking a nearby date from the strip above.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setFilters(EMPTY_FILTERS)}
                >
                  Clear filters
                </Button>
              </div>
            )}

            {!loading &&
              !error &&
              visible.map((flight, index) => (
                <FlightResultCard
                  key={flight.id}
                  flight={flight}
                  passengers={passengers}
                  index={index}
                  cheapest={flight.id === cheapestId}
                  fastest={flight.id === fastestId && flight.id !== cheapestId}
                  onSelect={() => handleSelect(flight)}
                />
              ))}

            {!loading && (
              <div className="pt-2">
                <p className="mb-2 px-1 text-sm font-semibold text-neutral-900">
                  Frequently asked questions
                </p>
                <FaqList items={FLIGHT_FAQS} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-elevated backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-neutral-500">
              {loading ? "Searching…" : `${visible.length} flights`}
            </p>
            <p className="truncate text-sm font-semibold text-neutral-900">
              {origin} → {destination}
            </p>
          </div>
          <Button size="lg" className="h-12 shrink-0" onClick={() => setDrawerOpen(true)}>
            <SlidersHorizontal className="size-4" aria-hidden />
            Filters
            {activeCount > 0 && (
              <span className="rounded-full bg-white/20 px-1.5 text-xs">{activeCount}</span>
            )}
          </Button>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
            className="animate-overlay-in absolute inset-0 bg-neutral-900/50"
          />
          <div className="animate-sheet-up relative max-h-[85vh] overflow-y-auto rounded-t-3xl bg-neutral-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-2 text-base font-bold text-neutral-900">
                <PlaneTakeoff className="size-4 text-primary-600" aria-hidden />
                Filter flights
              </p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close"
                className="flex size-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            {sidebar}

            <Button size="lg" className="mt-4 w-full" onClick={() => setDrawerOpen(false)}>
              Show {visible.length} flight{visible.length === 1 ? "" : "s"}
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
}

function FlightSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft">
      <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="grid gap-3 sm:grid-cols-[minmax(120px,0.8fr)_minmax(0,1.6fr)] sm:items-center">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-neutral-200" />
            <div className="space-y-1.5">
              <div className="h-3 w-24 rounded bg-neutral-200" />
              <div className="h-2.5 w-16 rounded bg-neutral-100" />
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-3">
            <div className="h-6 rounded bg-neutral-200" />
            <div className="h-4 rounded bg-neutral-100" />
            <div className="h-6 rounded bg-neutral-200" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 sm:min-w-[168px] sm:flex-col sm:items-end">
          <div className="h-6 w-20 rounded bg-neutral-200" />
          <div className="h-9 w-28 rounded-xl bg-neutral-100" />
        </div>
      </div>
      <div className="h-10 border-t border-neutral-100 bg-neutral-50/60" />
    </div>
  );
}
