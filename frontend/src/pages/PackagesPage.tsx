import { useState } from "react";
import { Layout } from "../components/Layout";
import { ProductHero } from "../components/marketing/ProductHero";
import { SectionHeading } from "../components/marketing/SectionHeading";
import { FeatureGrid, type FeatureItem } from "../components/marketing/FeatureGrid";
import { Button } from "../components/ui/Button";
import { Card, PageContainer, PriceDisplay } from "../components/ui/Card";
import { showComingSoon } from "../lib/comingSoon";

const FEATURES: FeatureItem[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 12h18M3 12a9 9 0 0 1 9-9m-9 9a9 9 0 0 0 9 9m0-18a9 9 0 0 1 9 9m-9-9c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9m0-18c-2.5 2.5-3.5 5.5-3.5 9s1 6.5 3.5 9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "All-Inclusive Rates",
    body: "Flights, hotels & transfers bundled transparently.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 12l-6 6-2-2M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Exciting Deals",
    body: "Seasonal packages at prices you won't find elsewhere.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "24/7 Support",
    body: "Dedicated help before, during and after your trip.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L12 3Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Authentic Experiences",
    body: "Curated meals and local experiences included.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Quality Stays",
    body: "Hand-picked hotels for comfort and cleanliness.",
  },
];

const DOMESTIC_PACKAGES = [
  { title: "Goa Beach Escape", nights: "4N/5D", price: 14999 },
  { title: "Kerala Backwaters", nights: "5N/6D", price: 21999 },
  { title: "Manali–Shimla Duo", nights: "5N/6D", price: 17499 },
  { title: "Rajasthan Heritage", nights: "6N/7D", price: 24999 },
];

const INTERNATIONAL_PACKAGES = [
  { title: "Bali Getaway", nights: "5N/6D", price: 54999 },
  { title: "Dubai Delights", nights: "4N/5D", price: 47999 },
  { title: "Thailand Explorer", nights: "6N/7D", price: 42999 },
  { title: "Singapore & Sentosa", nights: "5N/6D", price: 58999 },
];

export function PackagesPage() {
  const [tab, setTab] = useState<"domestic" | "international">("domestic");
  const packages = tab === "domestic" ? DOMESTIC_PACKAGES : INTERNATIONAL_PACKAGES;

  return (
    <Layout bare>
      <ProductHero
        eyebrow="Explore holiday packages"
        title={
          <>
            Handpicked getaways, <span className="text-accent">zero hassle</span>
          </>
        }
        subtitle="Flights, stays and experiences bundled at prices you'll love."
        image="https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=1920"
      />

      <PageContainer className="py-12">
        <SectionHeading title="Why choose Tripime?" subtitle="Your travel, our care." />
        <FeatureGrid items={FEATURES} />
      </PageContainer>

      <PageContainer className="py-4 pb-16">
        <SectionHeading title="Popular packages" />
        <div className="mb-6 inline-flex gap-2 rounded-full bg-neutral-100 p-1">
          {(["domestic", "international"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                tab === id ? "bg-white text-primary-700 shadow-soft" : "text-neutral-600"
              }`}
            >
              {id}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => (
            <Card key={p.title}>
              <p className="font-semibold text-neutral-900">{p.title}</p>
              <p className="mt-1 text-sm text-neutral-500">{p.nights}</p>
              <p className="mt-3 text-xs uppercase tracking-wide text-neutral-400">
                Starting from
              </p>
              <PriceDisplay amount={`₹${p.price.toLocaleString("en-IN")}`} className="text-lg" />
              <Button
                size="sm"
                className="mt-4 w-full"
                onClick={() => void showComingSoon("Package")}
              >
                View details
              </Button>
            </Card>
          ))}
        </div>
      </PageContainer>

      <div className="bg-primary-800 py-10 text-center text-white">
        <p className="text-lg font-semibold">Your travel, our care</p>
        <p className="mt-1 text-sm text-white/80">24×7 trip support for all package enquiries</p>
        <Button
          variant="secondary"
          size="lg"
          className="mt-4"
          onClick={() => void showComingSoon("Package")}
        >
          Contact us
        </Button>
      </div>
    </Layout>
  );
}
