import { useState, type FormEvent } from "react";
import { ProductHero } from "../marketing/ProductHero";
import { InventoryNotice } from "../marketing/InventoryNotice";
import { Button } from "../ui/Button";
import { Field, Select, Input } from "../ui/Input";

const DESTINATIONS = [
  { code: "BOM", label: "Mumbai (BOM)" },
  { code: "BLR", label: "Bangalore (BLR)" },
];

// First image is LCP — keep a higher width. Rotating slides load later at a lighter size.
const HERO_IMAGES = [
  "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

const TRUST = ["Instant e-tickets", "No hidden fees", "24/7 support"];

interface SearchFormValues {
  destination: string;
  date: string;
  passengers: number;
}

interface HeroSearchProps {
  initial?: Partial<SearchFormValues>;
  onSearch: (values: SearchFormValues) => void;
}

export function HeroSearch({ initial, onSearch }: HeroSearchProps) {
  const [destination, setDestination] = useState(initial?.destination ?? "BOM");
  const [date, setDate] = useState(initial?.date ?? "2026-08-20");
  const [passengers, setPassengers] = useState(initial?.passengers ?? 1);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch({ destination, date, passengers });
  }

  return (
    <ProductHero
      eyebrow="Domestic flights"
      title={
        <>
          Travel India with <span className="text-accent">trusted airlines</span>
        </>
      }
      subtitle="Search, compare and book domestic fares in a few taps — Delhi to Mumbai and Bangalore."
      images={HERO_IMAGES}
      trustItems={TRUST}
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white/95 p-4 shadow-elevated ring-1 ring-neutral-900/5 backdrop-blur-sm sm:p-5"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-[1.15fr_1.15fr_1fr_0.85fr_auto] lg:items-end">
          <Field label="From">
            <div className="flex h-11 w-full items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm font-medium text-neutral-700 sm:h-12">
              Delhi (DEL)
            </div>
          </Field>

          <Field label="To">
            <Select value={destination} onChange={(e) => setDestination(e.target.value)}>
              {DESTINATIONS.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Departure">
            <Input
              type="date"
              min="2026-08-04"
              max="2026-08-31"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>

          <Field label="Passengers">
            <Select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "passenger" : "passengers"}
                </option>
              ))}
            </Select>
          </Field>

          <div className="sm:col-span-2 lg:col-span-1">
            <Button type="submit" size="lg" className="h-11 w-full sm:h-12 lg:min-w-[150px]">
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              Search
            </Button>
          </div>
        </div>

        <InventoryNotice compact className="mt-3" />
      </form>
    </ProductHero>
  );
}
