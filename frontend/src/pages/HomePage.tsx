import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileCheck2, IndianRupee, MessageCircle, ShieldCheck } from "lucide-react";
import { Layout } from "../components/Layout";
import { HeroSearch } from "../components/search/HeroSearch";
import { FeatureGrid, type FeatureItem } from "../components/marketing/FeatureGrid";
import { SectionHeading } from "../components/marketing/SectionHeading";
import { FaqList, type FaqItem } from "../components/marketing/FaqList";
import { Section } from "../components/layout/Section";
import { Button } from "../components/ui/Button";
import { Card, PageContainer } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useBooking } from "../context/BookingContext";
import { usePageTitle } from "../hooks/usePageTitle";

const FEATURES: FeatureItem[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Fast Booking",
    body: "Quick search, competitive prices, and a smooth booking experience from start to finish.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 12l-6 6-2-2M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Exciting Deals",
    body: "Exclusive offers on flights across trusted airlines, domestic and international routes.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "24/7 Support",
    body: "Get assistance anytime for travel queries. Our team is here to help you fly worry-free.",
  },
];

const TRUST_POINTS = [
  {
    icon: FileCheck2,
    title: "Instant e-ticket & invoice",
    body: "Download your PDF ticket right after payment — no waiting.",
  },
  {
    icon: IndianRupee,
    title: "Transparent pricing",
    body: "Base fare and taxes shown upfront. No hidden fees at checkout.",
  },
  {
    icon: MessageCircle,
    title: "Real human support",
    body: "Call or WhatsApp our travel experts — not a chatbot.",
  },
  {
    icon: ShieldCheck,
    title: "Your data stays safe",
    body: "Card number and CVV are never sent to or stored on our servers.",
  },
];

const POPULAR_ROUTES = [
  {
    from: "Delhi",
    fromCode: "DEL",
    to: "Mumbai",
    toCode: "BOM",
    price: "₹4,299",
    duration: "2h 10m",
  },
  {
    from: "Delhi",
    fromCode: "DEL",
    to: "Bangalore",
    toCode: "BLR",
    price: "₹4,899",
    duration: "2h 45m",
  },
];

const WHY_CHOOSE_US = [
  {
    title: "New platform, no shortcuts",
    body: "We're a new booking platform built from scratch — every fare and policy shown is checked before it goes live, not scraped or guessed.",
  },
  {
    title: "You talk to a real person",
    body: "Need help with a fare, a date change, or a package? Call or WhatsApp and get a real travel expert, every time.",
  },
  {
    title: "We tell you what's not live yet",
    body: "Flights and holiday packages are bookable today. Hotels, buses and visas are marked \"Soon\" — we'd rather be upfront than overpromise.",
  },
];

const AIRLINES = ["Air India", "IndiGo", "Akasa Air", "Air India Express"];

const HOME_FAQS: FaqItem[] = [
  {
    question: "Is Tripime live for real bookings?",
    answer:
      "Yes — flights are bookable end-to-end today with instant e-tickets. Holiday packages are enquiry-based: you tell us what you want and a travel expert confirms pricing and payment directly. Hotels, buses and visas are launching soon.",
  },
  {
    question: "Is my payment information safe?",
    answer:
      "Your card number and CVV are validated in your browser only and are never sent to or stored on our servers. See our Privacy Policy for details.",
  },
  {
    question: "Can I get a refund if my plans change?",
    answer:
      "Refund eligibility depends on the fare rules of your ticket. Check our Refund & Cancellation Policy, or just call us and we'll check for you.",
  },
  {
    question: "How do I find my booking later?",
    answer:
      "Head to the My Booking page and enter your booking ID or PNR along with the email or phone you booked with.",
  },
  {
    question: "What about hotels, buses or a visa?",
    answer:
      "Those are launching soon on Tripime. Call or WhatsApp us today and our team will help you book directly in the meantime.",
  },
];

export function HomePage() {
  usePageTitle(
    "Book Domestic Flights & Holiday Packages",
    "Search and book domestic flights and curated holiday packages on Tripime, with transparent pricing and real human support by call or WhatsApp.",
  );
  const navigate = useNavigate();
  const { setSearch } = useBooking();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleRouteClick(destination: string) {
    const date = "2026-08-10";
    setSearch({ origin: "DEL", destination, date, passengers: 1 });
    navigate(`/flights?origin=DEL&destination=${destination}&date=${date}&passengers=1`);
  }

  function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <Layout bare>
      <HeroSearch
        onSearch={({ destination, date, passengers }) => {
          setSearch({ origin: "DEL", destination, date, passengers });
          navigate(
            `/flights?origin=DEL&destination=${destination}&date=${date}&passengers=${passengers}`,
          );
        }}
      />

      <section className="border-y border-neutral-200 bg-white">
        <PageContainer className="py-8 sm:py-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_POINTS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                  <Icon className="size-4" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{title}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      <Section>
        <SectionHeading
          className="mx-auto text-center"
          title="Reasons you'll love booking with us"
          subtitle="Unmatched value, seamless experience."
        />
        <FeatureGrid items={FEATURES} />
      </Section>

      <Section tone="white">
        <SectionHeading
          title="Popular routes"
          subtitle="Illustrative starting fares — tap a route to search live prices for your dates."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {POPULAR_ROUTES.map((r) => (
            <button
              key={r.toCode}
              type="button"
              onClick={() => handleRouteClick(r.toCode)}
              className="group w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <Card className="h-full transition duration-200 group-hover:-translate-y-0.5 group-hover:border-primary-200 group-hover:shadow-elevated">
                <div className="flex items-center gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-neutral-900">{r.from}</p>
                    <p className="text-xs text-neutral-500">{r.fromCode}</p>
                  </div>
                  <div className="flex flex-1 items-center gap-2 text-primary-400">
                    <span className="h-px flex-1 bg-neutral-200" />
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5 shrink-0"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-4.5L21 16Z" />
                    </svg>
                    <span className="h-px flex-1 bg-neutral-200" />
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="truncate font-semibold text-neutral-900">{r.to}</p>
                    <p className="text-xs text-neutral-500">{r.toCode}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                  <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                    One way · {r.duration}
                  </span>
                  <span className="text-sm text-neutral-500">
                    from{" "}
                    <span className="text-base font-bold text-primary-700">{r.price}</span>
                    <span className="ml-1 text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                      illus.
                    </span>
                  </span>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          className="mx-auto text-center"
          title="Why travel with Tripime"
          subtitle="We're new — here's exactly what that means for you."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE_US.map((item) => (
            <Card key={item.title} className="h-full">
              <p className="font-semibold text-neutral-900">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <section className="border-y border-neutral-200 bg-white">
        <PageContainer className="py-12 sm:py-16">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Popular airlines
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {AIRLINES.map((name) => (
              <span
                key={name}
                className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-soft transition hover:border-primary-200 hover:text-primary-700"
              >
                {name}
              </span>
            ))}
          </div>
        </PageContainer>
      </section>

      <Section tone="white" narrow>
        <SectionHeading
          className="mx-auto text-center"
          title="Frequently asked questions"
          subtitle="Quick, honest answers — call us if you need more."
        />
        <FaqList items={HOME_FAQS} />
        <p className="mt-4 text-center text-sm text-neutral-500">
          Read the full details in our{" "}
          <Link to="/privacy" className="font-semibold text-primary-700 hover:text-primary-800">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link to="/refund-policy" className="font-semibold text-primary-700 hover:text-primary-800">
            Refund Policy
          </Link>
          .
        </p>
      </Section>

      <Section tone="dark" narrow>
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Subscribe for the latest news and offers
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
            Fare drops and route launches, straight to your inbox. No spam.
          </p>
          {subscribed ? (
            <p className="mt-6 text-sm font-medium text-secondary-400">
              Thanks for subscribing — we&apos;ll keep you posted!
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="mx-auto mt-7 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                required
                aria-label="Email address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-transparent"
              />
              <Button type="submit" variant="secondary" size="lg" className="h-11 sm:h-12 sm:w-auto">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </Section>
    </Layout>
  );
}
