import { Layout } from "../components/Layout";
import { ProductHero } from "../components/marketing/ProductHero";
import { SectionHeading } from "../components/marketing/SectionHeading";
import { FeatureGrid, type FeatureItem } from "../components/marketing/FeatureGrid";
import { FaqList } from "../components/marketing/FaqList";
import { Section } from "../components/layout/Section";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { usePageTitle } from "../hooks/usePageTitle";
import { showComingSoon } from "../lib/comingSoon";

const FEATURES: FeatureItem[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Fast Processing",
    body: "Streamlined applications with expert review to avoid delays.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 12h6M9 16h6M9 8h6M5 4h14v16H5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Document Guidance",
    body: "Clear checklists so you submit the right documents the first time.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v18M3 12h18" strokeLinecap="round" />
      </svg>
    ),
    title: "Transparent Pricing",
    body: "No hidden fees — know the service and embassy costs upfront.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2 3 6v6c0 5 4 8.5 9 10 5-1.5 9-5 9-10V6l-9-4Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Secure Handling",
    body: "Your personal documents are handled with strict confidentiality.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 8v4l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "24/7 Support",
    body: "Visa experts available to answer questions at every step.",
  },
];

const DESTINATIONS = [
  { country: "United States", type: "Tourist / Business" },
  { country: "United Kingdom", type: "Tourist" },
  { country: "Schengen (Europe)", type: "Tourist" },
  { country: "Thailand", type: "Tourist" },
  { country: "Singapore", type: "Tourist / Transit" },
  { country: "UAE", type: "Tourist / Business" },
];

const STEPS = [
  {
    number: "01",
    title: "Choose Destination",
    body: "Select your travel country and visa type from our popular destinations.",
  },
  {
    number: "02",
    title: "Submit Documents",
    body: "Upload required documents online — our team verifies everything for you.",
  },
  {
    number: "03",
    title: "Application Processing",
    body: "We submit your application and track status with the embassy or consulate.",
  },
  {
    number: "04",
    title: "Receive Your Visa",
    body: "Get your approved visa delivered or ready for collection — then fly!",
  },
];

const FAQS = [
  {
    question: "How long does visa processing take?",
    answer:
      "Processing times vary by country and visa type — typically 3 to 30 business days. Each destination card shows an estimated timeline.",
  },
  {
    question: "What documents do I need?",
    answer:
      "Requirements vary by destination and visa type; our team provides a checklist once you choose a destination.",
  },
  {
    question: "Is the visa fee refundable if my application is rejected?",
    answer: "Embassy fees are generally non-refundable; service fees follow our refund policy.",
  },
  {
    question: "Can Tripime guarantee visa approval?",
    answer:
      "No agency can guarantee approval — final decisions rest with the embassy or consulate.",
  },
];

export function VisaPage() {
  usePageTitle(
    "Visa assistance — launching soon",
    "Online visa applications on Tripime are launching soon. Call or WhatsApp our team for help today.",
  );
  return (
    <Layout bare>
      <ProductHero
        eyebrow="Visa · Launching soon"
        title={
          <>
            Visas made <span className="text-accent">simple</span>
          </>
        }
        subtitle="Tourist, business and transit visas — expert assistance from application to approval."
        image="https://images.pexels.com/photos/2402926/pexels-photo-2402926.jpeg?auto=compress&cs=tinysrgb&w=1920"
      >
        <div className="max-w-md rounded-3xl bg-white/95 p-5 shadow-elevated ring-1 ring-neutral-900/5 backdrop-blur-sm sm:p-6">
          <p className="text-sm text-neutral-600">
            Tell us where you&apos;re headed and our visa experts will get in touch.
          </p>
          <Button
            size="lg"
            className="mt-4 w-full"
            onClick={() => void showComingSoon("Visa")}
          >
            Start visa application
          </Button>
        </div>
      </ProductHero>

      <Section>
        <SectionHeading
          title="Why apply with Tripime?"
          subtitle="Hassle-free visa assistance for your next international trip."
        />
        <FeatureGrid items={FEATURES} />
      </Section>

      <Section tone="white">
        <SectionHeading title="Popular destinations" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d) => (
            <button
              key={d.country}
              type="button"
              className="group w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              onClick={() => void showComingSoon("Visa")}
            >
              <Card className="h-full transition group-hover:border-primary-200 group-hover:shadow-medium">
                <p className="font-semibold text-neutral-900">{d.country}</p>
                <p className="mt-1 text-sm text-neutral-500">{d.type}</p>
              </Card>
            </button>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading title="How it works" subtitle="Get your visa in 4 simple steps." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <Card key={s.number}>
              <p className="text-sm font-bold text-primary-600">{s.number}</p>
              <h3 className="mt-2 font-semibold text-neutral-900">{s.title}</h3>
              <p className="mt-1.5 text-sm text-neutral-600">{s.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading
          title="Frequently asked questions"
          subtitle="Quick answers to common visa queries."
        />
        <FaqList items={FAQS} />
      </Section>
    </Layout>
  );
}
