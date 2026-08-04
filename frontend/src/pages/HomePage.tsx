import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { HeroSearch } from "../components/search/HeroSearch";
import { FeatureGrid, type FeatureItem } from "../components/marketing/FeatureGrid";
import { SectionHeading } from "../components/marketing/SectionHeading";
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

const POPULAR_ROUTES = [
  { from: "Delhi", fromCode: "DEL", to: "Mumbai", toCode: "BOM" },
  { from: "Delhi", fromCode: "DEL", to: "Bangalore", toCode: "BLR" },
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

      <PageContainer className="py-12">
        <SectionHeading
          title="Reasons you'll love booking with us"
          subtitle="Unmatched value, seamless experience."
        />
        <FeatureGrid items={FEATURES} />
      </PageContainer>

      <PageContainer className="py-4">
        <SectionHeading title="Popular routes" subtitle="Quick picks — tap a route to search flights." />
        <div className="grid gap-4 sm:grid-cols-2">
          {POPULAR_ROUTES.map((r) => (
            <Card
              key={r.toCode}
              className="cursor-pointer transition hover:shadow-medium"
              onClick={() => handleRouteClick(r.toCode)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-neutral-900">{r.from}</p>
                  <p className="text-xs text-neutral-500">{r.fromCode}</p>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className="size-5 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-right">
                  <p className="font-semibold text-neutral-900">{r.to}</p>
                  <p className="text-xs text-neutral-500">{r.toCode}</p>
                </div>
              </div>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-primary-600">
                One way
              </p>
            </Card>
          ))}
        </div>
      </PageContainer>

      <PageContainer className="py-12">
        <SectionHeading
          title="What travellers say"
          subtitle="Real feedback from Tripime customers."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.when}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-neutral-600">{t.quote}</p>
            </Card>
          ))}
        </div>
      </PageContainer>

      <PageContainer className="py-4">
        <SectionHeading title="Popular airlines" subtitle="Top domestic airlines — book with Tripime." />
        <div className="flex flex-wrap gap-3">
          {AIRLINES.map((name) => (
            <span
              key={name}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-soft"
            >
              {name}
            </span>
          ))}
        </div>
      </PageContainer>

      <div className="mt-12 bg-primary-800 py-12 text-center text-white">
        <PageContainer narrow>
          <h2 className="text-xl font-bold sm:text-2xl">
            Subscribe for the latest news and offers
          </h2>
          {subscribed ? (
            <p className="mt-4 text-sm text-white/90">
              Thanks for subscribing — we&apos;ll keep you posted!
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center"
            >
              <Input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sm:w-72"
              />
              <Button type="submit" variant="secondary" size="lg">
                Subscribe
              </Button>
            </form>
          )}
        </PageContainer>
      </div>
    </Layout>
  );
}
