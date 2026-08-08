import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { CarouselRail } from "./CarouselRail";
import { formatINR } from "../../lib/format";
import type { TravelPackage } from "../../types";

interface TrendingDestinationsProps {
  packages: TravelPackage[];
  tab: "domestic" | "international";
  onTabChange: (tab: "domestic" | "international") => void;
}

export function TrendingDestinations({
  packages,
  tab,
  onTabChange,
}: TrendingDestinationsProps) {
  const visible = packages.filter((p) => p.category === tab);

  return (
    <section id="trending" className="bg-neutral-50 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-soft sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-800 sm:text-2xl">
              Trending holiday destinations
            </h2>
            <a
              href="#all-packages"
              className="flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-brand-coral hover:text-brand-coral"
              aria-label="Browse all packages"
            >
              <ChevronRight className="size-4" aria-hidden />
            </a>
          </div>

          <div
            role="tablist"
            aria-label="Destination region"
            className="mb-5 flex gap-5 border-b border-neutral-100"
          >
            {(
              [
                { id: "domestic", label: "Domestic" },
                { id: "international", label: "International" },
              ] as const
            ).map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onTabChange(item.id)}
                  className={`relative pb-2.5 text-sm font-semibold transition ${
                    active ? "text-brand-coral" : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand-coral" />
                  )}
                </button>
              );
            })}
          </div>

          {visible.length === 0 ? (
            <p className="py-10 text-center text-sm text-neutral-500">
              No {tab} packages available yet.
            </p>
          ) : (
            <CarouselRail gapClassName="gap-3 sm:gap-4">
              {visible.map((pkg) => (
                <DestinationCard key={pkg.id} pkg={pkg} />
              ))}
            </CarouselRail>
          )}
        </div>
      </div>
    </section>
  );
}

function DestinationCard({ pkg }: { pkg: TravelPackage }) {
  const name = pkg.destination.split(/[·,]/)[0]?.trim() || pkg.title;

  return (
    <Link
      to={`/packages/${pkg.id}`}
      className="group relative block h-64 w-[148px] shrink-0 snap-start overflow-hidden rounded-2xl sm:h-72 sm:w-[168px]"
    >
      {pkg.imageUrl ? (
        <img
          src={pkg.imageUrl}
          alt={name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(155deg,#071d4d,#1c52b8)" }}
          aria-hidden
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-b from-neutral-900/55 via-transparent to-neutral-900/75"
        aria-hidden
      />
      <div className="absolute inset-x-0 top-0 p-3">
        <p className="text-sm font-bold text-white drop-shadow">{name}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="text-[10px] font-medium text-white/80">Starting from</p>
        <p className="text-base font-bold text-white">{formatINR(pkg.price)}</p>
      </div>
    </Link>
  );
}
