import type { FormEvent } from "react";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { ProductHero } from "../components/marketing/ProductHero";
import { SectionHeading } from "../components/marketing/SectionHeading";
import { FeatureGrid, type FeatureItem } from "../components/marketing/FeatureGrid";
import { OfferCards } from "../components/marketing/OfferCards";
import { Section } from "../components/layout/Section";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field, Input } from "../components/ui/Input";
import { showComingSoon } from "../lib/comingSoon";

const FEATURES: FeatureItem[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10M4 17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M4 17h16M8 11h8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Wide Network",
    body: "Thousands of routes across cities, from sleeper coaches to premium AC buses.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2v20M2 12h20" strokeLinecap="round" />
      </svg>
    ),
    title: "Best Fares",
    body: "Compare operators and pick the best price for every journey.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "24/7 Support",
    body: "Get assistance anytime for boarding points, changes and cancellations.",
  },
];

const OFFERS = [
  { title: "Weekend getaway", body: "Flat 20% off on weekend bus bookings.", code: "TRIPBUS" },
  { title: "First ride offer", body: "Save ₹150 on your first bus booking with us." },
  { title: "Group travel", body: "Extra discounts when booking 4+ seats together." },
];

const ROUTES = [
  { from: "Delhi", to: "Manali" },
  { from: "Bangalore", to: "Goa" },
  { from: "Mumbai", to: "Pune" },
  { from: "Chennai", to: "Pondicherry" },
];

export function BusesPage() {
  const [from, setFrom] = useState("Delhi");
  const [to, setTo] = useState("Manali");
  const [date, setDate] = useState("2026-08-10");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void showComingSoon("Bus");
  }

  return (
    <Layout bare>
      <ProductHero
        eyebrow="Save max on buses"
        title={
          <>
            Travel comfortably with <span className="text-accent">trusted operators</span>
          </>
        }
        subtitle="Sleeper, semi-sleeper & AC seater buses — best fares guaranteed"
        image="https://images.pexels.com/photos/1319515/pexels-photo-1319515.jpeg?auto=compress&cs=tinysrgb&w=1920"
      >
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white/95 p-4 shadow-elevated ring-1 ring-neutral-900/5 backdrop-blur-sm sm:p-5"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
            <Field label="From">
              <Input value={from} onChange={(e) => setFrom(e.target.value)} required />
            </Field>
            <Field label="To">
              <Input value={to} onChange={(e) => setTo(e.target.value)} required />
            </Field>
            <Field label="Date of journey">
              <Input
                type="date"
                min="2026-08-04"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Field>
            <div className="sm:col-span-2 lg:col-span-1">
              <Button type="submit" size="lg" className="h-11 w-full sm:h-12 lg:min-w-[140px]">
                Search buses
              </Button>
            </div>
          </div>
        </form>
      </ProductHero>

      <Section>
        <SectionHeading
          title="Reasons you'll love booking with us"
          subtitle="Unmatched value, seamless experience."
        />
        <FeatureGrid items={FEATURES} />
      </Section>

      <Section tone="white">
        <SectionHeading title="Popular routes" subtitle="Quick picks — tap a route to search." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROUTES.map((r) => (
            <button
              key={`${r.from}-${r.to}`}
              type="button"
              className="group w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              onClick={() => {
                setFrom(r.from);
                setTo(r.to);
              }}
            >
              <Card className="h-full transition group-hover:border-primary-200 group-hover:shadow-medium">
                <p className="font-semibold text-neutral-900">{r.from}</p>
                <p className="text-sm text-neutral-500">to {r.to}</p>
              </Card>
            </button>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading title="More offers" />
        <OfferCards items={OFFERS} />
      </Section>
    </Layout>
  );
}
