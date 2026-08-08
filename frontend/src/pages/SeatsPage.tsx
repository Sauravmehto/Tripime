import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FareSummaryCard } from "../components/flights/FareSummaryCard";
import { FlightRouteBar } from "../components/flights/FlightRouteBar";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Stepper } from "../components/ui/Stepper";
import { StickyActionBar } from "../components/ui/StickyActionBar";
import { useBooking } from "../context/BookingContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatINR } from "../lib/format";
import {
  generateSeatMap,
  seatLabel,
  type SeatCell,
} from "../lib/seatMap";
import type { SelectedSeat } from "../types";

export function SeatsPage() {
  usePageTitle("Select seats", "Choose seats for your Tripime flight booking.");
  const navigate = useNavigate();
  const {
    selectedFlight,
    passengers,
    contact,
    selectedSeats,
    seatCharges,
    setSelectedSeats,
  } = useBooking();

  const [map, setMap] = useState<SeatCell[]>([]);

  useEffect(() => {
    if (!selectedFlight || passengers.length === 0 || !contact.email) {
      navigate("/booking/review");
      return;
    }
    setMap(generateSeatMap(selectedFlight.id));
  }, [selectedFlight, passengers, contact, navigate]);

  const selectedNumbers = useMemo(
    () => new Set(selectedSeats.map((s) => s.seatNumber)),
    [selectedSeats],
  );

  const required = passengers.length;
  const selectedCount = selectedSeats.length;
  const complete = selectedCount === required;

  const flightFare = selectedFlight
    ? selectedFlight.fare.totalFare * passengers.length
    : 0;
  const total = flightFare + seatCharges;

  function handleSeatClick(cell: SeatCell) {
    if (cell.status === "occupied") return;

    const already = selectedSeats.find((s) => s.seatNumber === cell.seatNumber);
    if (already) {
      const remaining = selectedSeats
        .filter((s) => s.seatNumber !== cell.seatNumber)
        .map((s, i) => ({ ...s, passengerIndex: i }));
      setSelectedSeats(remaining);
      return;
    }

    if (selectedSeats.length >= required) return;

    const next: SelectedSeat = {
      passengerIndex: selectedSeats.length,
      seatNumber: cell.seatNumber,
      seatType: cell.seatType,
      price: cell.price,
    };
    setSelectedSeats([...selectedSeats, next]);
  }

  function seatClass(cell: SeatCell): string {
    const selected = selectedNumbers.has(cell.seatNumber);
    if (cell.status === "occupied") {
      return "cursor-not-allowed bg-neutral-300 text-neutral-500";
    }
    if (selected) {
      return "bg-primary-600 text-white ring-2 ring-primary-300";
    }
    if (cell.status === "extra_legroom" || cell.seatType === "extra_legroom") {
      return "bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300";
    }
    if (cell.seatType === "preferred") {
      return "bg-violet-50 text-violet-900 hover:bg-violet-100 border border-violet-200";
    }
    if (cell.seatType === "window") {
      return "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200";
    }
    return "bg-white text-neutral-700 hover:bg-primary-50 border border-neutral-200";
  }

  if (!selectedFlight) return null;

  const rows = Array.from({ length: 25 }, (_, i) => i + 1);

  return (
    <Layout>
      <div className="pb-24 lg:pb-0">
        <Stepper current="seats" />

        <FlightRouteBar
          flight={selectedFlight}
          passengers={passengers.length}
          className="mb-4"
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <Card padded={false} className="p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-lg font-bold text-neutral-900">Select seats</h1>
              <p className="text-xs font-semibold text-neutral-500">
                {selectedCount} of {required} seat{required > 1 ? "s" : ""} selected
              </p>
            </div>
            <div className="mb-4 flex flex-wrap gap-2 text-xs text-neutral-600">
              <Legend swatch="bg-white border" label="Available" />
              <Legend swatch="bg-primary-600" label="Selected" />
              <Legend swatch="bg-neutral-300" label="Occupied" />
              <Legend swatch="bg-amber-100 border-amber-300" label="Extra legroom ₹699" />
              <Legend swatch="bg-violet-50 border-violet-200" label="Preferred ₹299" />
              <Legend swatch="bg-emerald-50 border-emerald-200" label="Window ₹199" />
            </div>

            <div className="overflow-x-auto">
              <div className="mx-auto inline-block min-w-[300px]">
                <div className="mb-2 grid grid-cols-[2rem_repeat(3,2.25rem)_1rem_repeat(3,2.25rem)] justify-center gap-1 text-center text-[10px] font-semibold text-neutral-400">
                  <span />
                  <span>A</span>
                  <span>B</span>
                  <span>C</span>
                  <span />
                  <span>D</span>
                  <span>E</span>
                  <span>F</span>
                </div>
                {rows.map((row) => (
                  <div
                    key={row}
                    className="mb-1 grid grid-cols-[2rem_repeat(3,2.25rem)_1rem_repeat(3,2.25rem)] justify-center gap-1"
                  >
                    <span className="flex items-center justify-center text-xs text-neutral-400">
                      {row}
                    </span>
                    {(["A", "B", "C"] as const).map((letter) => {
                      const cell = map.find((s) => s.seatNumber === `${row}${letter}`);
                      if (!cell) return <span key={letter} />;
                      return (
                        <button
                          key={letter}
                          type="button"
                          disabled={cell.status === "occupied"}
                          onClick={() => handleSeatClick(cell)}
                          className={`flex size-9 items-center justify-center rounded-md text-[10px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${seatClass(cell)}`}
                          title={`${cell.seatNumber} · ${seatLabel(cell.seatType)} · ${formatINR(cell.price)}`}
                        >
                          {letter}
                        </button>
                      );
                    })}
                    <span />
                    {(["D", "E", "F"] as const).map((letter) => {
                      const cell = map.find((s) => s.seatNumber === `${row}${letter}`);
                      if (!cell) return <span key={letter} />;
                      return (
                        <button
                          key={letter}
                          type="button"
                          disabled={cell.status === "occupied"}
                          onClick={() => handleSeatClick(cell)}
                          className={`flex size-9 items-center justify-center rounded-md text-[10px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${seatClass(cell)}`}
                          title={`${cell.seatNumber} · ${seatLabel(cell.seatType)} · ${formatINR(cell.price)}`}
                        >
                          {letter}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="space-y-4 lg:sticky lg:top-20">
            <Card padded={false} className="p-4">
              <h2 className="mb-3 text-sm font-bold text-neutral-900">Seat assignment</h2>
              <ul className="space-y-2 text-sm">
                {passengers.map((p, i) => {
                  const seat = selectedSeats.find((s) => s.passengerIndex === i);
                  return (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-2 rounded-xl bg-neutral-50 px-3 py-2"
                    >
                      <span className="truncate text-neutral-700">
                        {p.firstName} {p.lastName}
                      </span>
                      <span className="shrink-0 font-mono font-semibold text-primary-700">
                        {seat?.seatNumber ?? "—"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>

            <FareSummaryCard
              sticky={false}
              rows={[
                { label: "Flight fare", amount: flightFare },
                { label: "Seat selection", amount: seatCharges },
              ]}
              total={total}
              totalLabel="Total payable"
              note="Seat charges are added to your final payment."
            >
              <Button
                className="hidden w-full lg:inline-flex"
                size="lg"
                variant="coral"
                disabled={!complete}
                onClick={() => navigate("/booking/payment")}
              >
                Continue to payment
              </Button>
            </FareSummaryCard>
          </div>
        </div>
      </div>

      <StickyActionBar
        total={formatINR(total)}
        ctaLabel="Continue to payment"
        disabled={!complete}
        onClick={() => navigate("/booking/payment")}
        extra={
          !complete ? (
            <p className="text-xs text-neutral-500">
              Select {required - selectedCount} more seat{required - selectedCount > 1 ? "s" : ""}
            </p>
          ) : null
        }
      />
    </Layout>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1">
      <span className={`inline-block size-3.5 rounded border border-neutral-200 ${swatch}`} />
      {label}
    </span>
  );
}
