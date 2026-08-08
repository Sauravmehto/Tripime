import type { FormEvent } from "react";
import { useState } from "react";
import { Layout } from "../components/Layout";
import { ProductHero } from "../components/marketing/ProductHero";
import { SectionHeading } from "../components/marketing/SectionHeading";
import { OfferCards } from "../components/marketing/OfferCards";
import { FaqList } from "../components/marketing/FaqList";
import { Section } from "../components/layout/Section";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field, Input, Select } from "../components/ui/Input";
import { usePageTitle } from "../hooks/usePageTitle";
import { showComingSoon } from "../lib/comingSoon";

const DESTINATIONS = [
  { name: "Manali", properties: "676 Properties" },
  { name: "Goa", properties: "4,010 Properties" },
  { name: "Bangalore", properties: "3,162 Properties" },
  { name: "Jaipur", properties: "2,061 Properties" },
  { name: "Pattaya", properties: "1,329 Properties" },
];

const TOP_HOTELS = [
  { name: "Cocoon Hotel", city: "Pune" },
  { name: "Country Inn & Suites", city: "Ghaziabad" },
  { name: "Radisson Blu Palace", city: "Udaipur" },
  { name: "Aamby Valley City", city: "Lonavala" },
  { name: "The Pride Hotel", city: "Chennai" },
  { name: "The Park Kolkata", city: "Kolkata" },
];

const OFFERS = [
  {
    title: "Last-minute stays",
    body: "Ask our team about check-in deals for today and tomorrow.",
  },
  {
    title: "Domestic hotels",
    body: "Tell us your city and dates — we'll shortlist the best-value options.",
  },
  {
    title: "International hotels",
    body: "Planning a trip abroad? We'll compare rates across trusted partners for you.",
  },
];

const FAQS = [
  {
    question: "What types of hotels are available?",
    answer:
      "Options range from luxury and boutique stays to budget-friendly and family-friendly properties.",
  },
  {
    question: "How do I book a hotel?",
    answer:
      "Enter your destination, select dates and guests, then search. Our team will help you complete eligible bookings.",
  },
  {
    question: "Are there discounts on hotel bookings?",
    answer: "Yes — look for seasonal offers and coupon codes shown on this page.",
  },
  {
    question: "Can I modify or cancel my reservation?",
    answer: "Policies vary by hotel. Review cancellation terms before you confirm.",
  },
];

export function HotelsPage() {
  usePageTitle(
    "Hotels — launching soon",
    "Hotel booking on Tripime is launching soon. Call or WhatsApp our travel experts to book stays today.",
  );
  const [city, setCity] = useState("Goa");
  const [checkIn, setCheckIn] = useState("2026-08-10");
  const [checkOut, setCheckOut] = useState("2026-08-12");
  const [guests, setGuests] = useState(2);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void showComingSoon("Hotel");
  }

  return (
    <Layout bare>
      <ProductHero
        eyebrow="Hotels · Launching soon"
        title={
          <>
            Find your <span className="text-accent">perfect stay</span>
          </>
        }
        subtitle="Tell us your destination and dates — our travel experts will get you the best hotel deal by call or WhatsApp."
        image="https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=1920"
      >
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white/95 p-4 shadow-elevated ring-1 ring-neutral-900/5 backdrop-blur-sm sm:p-5"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto] lg:items-end">
            <Field label="City">
              <Input value={city} onChange={(e) => setCity(e.target.value)} required />
            </Field>
            <Field label="Check-in">
              <Input
                type="date"
                min="2026-08-04"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </Field>
            <Field label="Check-out">
              <Input
                type="date"
                min={checkIn}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </Field>
            <Field label="Guests">
              <Select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} Guest{n > 1 ? "s" : ""}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="sm:col-span-2 lg:col-span-1">
              <Button type="submit" size="lg" className="h-11 w-full sm:h-12 lg:min-w-[140px]">
                Search hotels
              </Button>
            </div>
          </div>
        </form>
      </ProductHero>

      <Section>
        <SectionHeading title="More offers" subtitle="Save more on your next stay." />
        <OfferCards items={OFFERS} />
      </Section>

      <Section tone="white">
        <SectionHeading
          title="Popular destinations"
          subtitle="Illustrative catalogue sizes — online hotel booking is launching soon."
        />
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {DESTINATIONS.map((d) => (
            <Card key={d.name} className="text-center">
              <p className="font-semibold text-neutral-900">{d.name}</p>
              <p className="mt-1 text-xs text-neutral-500">{d.properties} (illus.)</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          title="Top hotels with great deals"
          subtitle="Sample properties for inspiration — not live inventory yet."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOP_HOTELS.map((h) => (
            <Card key={h.name}>
              <p className="font-semibold text-neutral-900">{h.name}</p>
              <p className="mt-1 text-sm text-neutral-500">{h.city}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading title="FAQ: Book hotels on Tripime" />
        <FaqList items={FAQS} />
      </Section>
    </Layout>
  );
}
