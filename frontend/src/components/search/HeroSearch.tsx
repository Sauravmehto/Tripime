import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button } from "../ui/Button";
import { Field, Select, Input } from "../ui/Input";

const DESTINATIONS = [
  { code: "BOM", label: "Mumbai (BOM)" },
  { code: "BLR", label: "Bangalore (BLR)" },
];

const HERO_IMAGES = [
  "https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/62623/wing-plane-flying-airplane-62623.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1920",
  "https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg?auto=compress&cs=tinysrgb&w=1920",
];

export interface SearchFormValues {
  destination: string;
  date: string;
  passengers: number;
}

interface HeroSearchProps {
  initial?: Partial<SearchFormValues>;
  onSearch: (values: SearchFormValues) => void;
}

export function HeroSearch({ initial, onSearch }: HeroSearchProps) {
  const images = useMemo(() => HERO_IMAGES, []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [destination, setDestination] = useState(initial?.destination ?? "BOM");
  const [date, setDate] = useState(initial?.date ?? "2026-08-20");
  const [passengers, setPassengers] = useState(initial?.passengers ?? 1);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => window.clearInterval(id);
  }, [images.length]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSearch({ destination, date, passengers });
  }

  return (
    <section className="relative z-10 flex min-h-[520px] flex-col overflow-hidden pb-16 pt-10 sm:min-h-[600px] sm:pb-20 sm:pt-14 lg:min-h-[640px]">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            activeIndex === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a2a6b]/85 via-[#123a82]/70 to-[#1c52b8]/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a2a6b]/90 via-[#1c52b8]/50 to-transparent" />
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(0 0, 72% 0, 52% 100%, 0 100%)",
          background: "linear-gradient(135deg, rgba(10,42,107,0.9), rgba(28,82,184,0.78))",
        }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-secondary-400/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="mt-4 max-w-2xl sm:mt-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-white/90">
            Find flights
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-md sm:text-4xl lg:text-5xl">
            Travel India with{" "}
            <span className="text-accent">trusted airlines</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">
            Search, compare &amp; book mock domestic fares — DEL → BOM / BLR · Aug 2026 inventory
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative z-20 mt-8 grid gap-4 rounded-2xl bg-white p-4 shadow-elevated sm:p-5 lg:mt-10 lg:grid-cols-[1.1fr_1.1fr_1fr_0.8fr_auto]"
        >
          <Field label="From">
            <Select value="DEL" disabled>
              <option value="DEL">Delhi (DEL)</option>
            </Select>
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
                  {n}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex items-end">
            <Button type="submit" size="lg" className="w-full lg:min-w-[140px]">
              Search
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
