import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, Tag } from "lucide-react";
import {
  HOLIDAY_DESTINATIONS,
  HOLIDAY_PRODUCT_TABS,
  TRAVEL_MONTHS,
} from "./holidaysData";
import { Button } from "../ui/Button";
import { Field, Input, Select } from "../ui/Input";

interface HolidaysHeroProps {
  onSearch: (values: { from: string; to: string; month: string }) => void;
}

export function HolidaysHero({ onSearch }: HolidaysHeroProps) {
  const navigate = useNavigate();
  const [from, setFrom] = useState("New Delhi");
  const [to, setTo] = useState("Goa");
  const [month, setMonth] = useState("");
  const [aiQuery, setAiQuery] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSearch({ from, to, month });
  }

  function handleAiSearch(event: FormEvent) {
    event.preventDefault();
    const q = aiQuery.trim();
    if (!q) return;
    const match = HOLIDAY_DESTINATIONS.find((d) =>
      q.toLowerCase().includes(d.toLowerCase()),
    );
    onSearch({ from, to: match ?? q, month });
  }

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-primary-50 to-primary-100/70">
      <div
        className="pointer-events-none absolute -right-16 top-8 hidden h-56 w-56 rounded-full bg-primary-300/25 blur-2xl lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-10 bottom-0 hidden h-48 w-48 rounded-full bg-sky-200/35 blur-2xl lg:block"
        aria-hidden
      />
      

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            Holidays that know your journeys
          </h1>
          <div className="mt-3 h-1.5 w-16 rounded-full bg-brand-coral" aria-hidden />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.12em]">
            <span className="text-brand-coral">We know.</span>{" "}
            <span className="text-primary-900">Since day one.</span>
          </p>
          <p className="mt-2 max-w-md text-sm text-neutral-600 sm:text-base">
            Curated domestic &amp; international packages with stays, transfers and
            experiences — built for Tripime travellers.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-coral px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-soft">
            <Tag className="size-3.5" aria-hidden />
            Mention TRIPIME20 to your travel expert
          </span>
        </div>

        <div className="relative z-10 mt-8 rounded-3xl bg-white p-3 shadow-elevated ring-1 ring-neutral-900/5 sm:p-4 lg:mt-10">
          <form
            onSubmit={handleAiSearch}
            className="mb-3 flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-2 sm:flex-row sm:items-center"
          >
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-coral-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-coral">
              <Sparkles className="size-3" aria-hidden />
              Trip AI
            </span>
            <input
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Find holidays in Goa this weekend"
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            />
            <Button type="submit" size="sm" variant="coral" className="shrink-0">
              + AI search
            </Button>
          </form>

          <div
            role="tablist"
            aria-label="Travel products"
            className="no-scrollbar mb-4 flex gap-1 overflow-x-auto"
          >
            {HOLIDAY_PRODUCT_TABS.map(({ id, label, href, icon: Icon }) => {
              const active = id === "holidays";
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    if (!active) navigate(href);
                  }}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-brand-coral-soft text-brand-coral"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </button>
              );
            })}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
          >
            <Field label="Depart from" dense>
              <Input value={from} onChange={(e) => setFrom(e.target.value)} />
            </Field>
            <Field label="Going to" dense>
              <Select value={to} onChange={(e) => setTo(e.target.value)}>
                {HOLIDAY_DESTINATIONS.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Month of travel (optional)" dense>
              <Select value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Select month</option>
                {TRAVEL_MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </Field>
            <Button
              type="submit"
              size="lg"
              variant="coral"
              className="h-11 w-full sm:h-12 lg:min-w-[128px]"
            >
              <Search className="size-4" aria-hidden />
              Search
            </Button>
          </form>
        </div>

        <div className="mt-4 flex justify-center">
          <a
            href="#special-offers"
            className="inline-flex items-center gap-2 rounded-full bg-brand-coral px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-soft transition hover:bg-brand-coral-dark"
          >
            The Tripime holiday edit
            <span className="flex size-5 items-center justify-center rounded-full bg-white text-brand-coral">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
