import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { HeroSearch } from "../components/search/HeroSearch";
import { FeatureGrid, type FeatureItem } from "../components/marketing/FeatureGrid";
import { SectionHeading } from "../components/marketing/SectionHeading";
import { Section } from "../components/layout/Section";
import { Button } from "../components/ui/Button";
import { Card, PageContainer } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useBooking } from "../context/BookingContext";

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

const STATS = [
  { value: "50k+", label: "Trips booked" },
  { value: "4.8/5", label: "Traveller rating" },
  { value: "20+", label: "Airline partners" },
  { value: "24/7", label: "Support" },
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

const TESTIMONIALS = [
  {
    name: "Ananya Sharma",
    when: "2 weeks ago",
    quote:
      "Booked Delhi to Mumbai with Tripime — fares were clear and support helped me pick the best nonstop. Smooth experience end to end.",
  },
  {
    name: "Rahul Mehta",
    when: "3 weeks ago",
    quote:
      "Great deals on domestic flights. The team responded quickly when I needed to change dates. Highly recommend!",
  },
  {
    name: "Priya Nair",
    when: "1 month ago",
    quote:
      "Easy flight search and helpful offers section. Booking felt hassle-free from search to confirmation.",
  },
];

const AIRLINES = ["Air India", "IndiGo", "Akasa Air", "Air India Express"];

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="Rated 5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="size-4 fill-warning-500" aria-hidden>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5Z" />
        </svg>
      ))}
    </div>
  );
}

export function HomePage() {
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
          <dl className="grid grid-cols-2 gap-6 text-center sm:gap-8 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-2xl font-bold tracking-tight text-primary-700 sm:text-3xl">
                  {stat.value}
                </dd>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-neutral-500 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
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
          subtitle="Quick picks — tap a route to search live fares."
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
          title="What travellers say"
          subtitle="Real feedback from Tripime customers."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name} className="flex h-full flex-col">
              <Stars />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-600">
                “{t.quote}”
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-neutral-100 pt-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                  {t.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.when}</p>
                </div>
              </div>
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
