import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { CarouselRail } from "./CarouselRail";
import { PARTNER_CHIPS } from "./holidaysData";
import { formatINR } from "../../lib/format";
import type { PackageCategory, TravelPackage } from "../../types";

const OFFER_TABS: { id: "all" | PackageCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "offer", label: "Offers" },
  { id: "domestic", label: "Domestic" },
  { id: "international", label: "International" },
  { id: "upcoming_event", label: "Events" },
];

interface SpecialOffersSectionProps {
  packages: TravelPackage[];
  filter: "all" | PackageCategory;
  onFilterChange: (filter: "all" | PackageCategory) => void;
}

export function SpecialOffersSection({
  packages,
  filter,
  onFilterChange,
}: SpecialOffersSectionProps) {
  const visible =
    filter === "all" ? packages : packages.filter((p) => p.category === filter);

  return (
    <section id="special-offers" className="bg-neutral-100/80 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-soft">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-brand-coral">T</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-brand-coral">
                  We know.
                </p>
                <p className="text-[10px] font-semibold text-primary-900">Holiday partners</p>
              </div>
            </div>
            <span className="hidden h-8 w-px bg-neutral-200 sm:block" aria-hidden />
            <p className="text-xs font-medium text-neutral-500">Our global partners</p>
            <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
              {PARTNER_CHIPS.map((chip) => (
                <span
                  key={chip.label}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${chip.tone}`}
                >
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-soft sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-800 sm:text-2xl">
              Special offers
            </h2>
            <a
              href="#all-packages"
              className="flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-brand-coral hover:text-brand-coral"
              aria-label="View all packages"
            >
              <ChevronRight className="size-4" aria-hidden />
            </a>
          </div>

          <div
            role="tablist"
            aria-label="Offer categories"
            className="no-scrollbar mb-5 flex gap-2 overflow-x-auto"
          >
            {OFFER_TABS.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onFilterChange(tab.id)}
                  className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                    active
                      ? "border-brand-coral bg-brand-coral-soft text-brand-coral"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {visible.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500">
              No offers in this category yet.
            </p>
          ) : (
            <CarouselRail>
              {visible.map((pkg) => (
                <OfferCard key={pkg.id} pkg={pkg} />
              ))}
            </CarouselRail>
          )}

          <div className="mt-5 text-center">
            <a
              href="#all-packages"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 transition hover:text-primary-800"
            >
              View all offers
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function OfferCard({ pkg }: { pkg: TravelPackage }) {
  return (
    <article className="flex w-[min(100%,320px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft transition hover:shadow-medium sm:w-[360px]">
      <div
        className="relative w-[38%] shrink-0 bg-cover bg-center"
        style={{
          backgroundImage: pkg.imageUrl
            ? `url(${pkg.imageUrl})`
            : "linear-gradient(135deg,#071d4d,#1c52b8)",
        }}
      >
        <div
          className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent"
          aria-hidden
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-wide text-brand-coral">
          {pkg.category === "offer"
            ? "Limited offer"
            : pkg.category === "upcoming_event"
              ? "Upcoming event"
              : "Holiday package"}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-neutral-900">{pkg.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">{pkg.destination}</p>
        <p className="mt-2 text-xs text-neutral-600">
          Starting at{" "}
          <span className="font-semibold text-neutral-900">{formatINR(pkg.price)}</span>
        </p>
        <Link
          to={`/packages/${pkg.id}`}
          className="mt-auto inline-flex items-center gap-0.5 pt-3 text-xs font-semibold text-primary-700 hover:text-primary-800"
        >
          View details
          <ChevronRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
