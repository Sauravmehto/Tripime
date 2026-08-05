import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Globe2,
  MapPin,
  PackageSearch,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { Layout } from "../components/Layout";
import { ProductHero } from "../components/marketing/ProductHero";
import { Section } from "../components/layout/Section";
import { PackageTicketCard } from "../components/packages/PackageTicketCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { listPackages } from "../api/packageApi";
import { getErrorMessage } from "../api/apiClient";
import type { PackageCategory, TravelPackage } from "../types";

const TABS: { id: PackageCategory; label: string; icon: LucideIcon }[] = [
  { id: "domestic", label: "Domestic", icon: MapPin },
  { id: "international", label: "International", icon: Globe2 },
  { id: "offer", label: "Offers", icon: Tag },
  { id: "upcoming_event", label: "Upcoming events", icon: CalendarDays },
];

export function PackagesPage() {
  const [tab, setTab] = useState<PackageCategory>("domestic");
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await listPackages();
        if (!cancelled) setPackages(data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const map = {} as Record<PackageCategory, number>;
    for (const { id } of TABS) map[id] = 0;
    for (const p of packages) map[p.category] = (map[p.category] ?? 0) + 1;
    return map;
  }, [packages]);

  const visible = useMemo(
    () => packages.filter((p) => p.category === tab),
    [packages, tab],
  );

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
        trustItems={["All-inclusive rates", "Private transfers", "24/7 trip support"]}
      />

      <Section id="packages">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Popular packages
          </h2>
          <p className="mt-2 text-sm text-neutral-600 sm:text-base">
            Ready-to-book itineraries across domestic escapes, international islands, limited
            offers and festive events.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div
            role="tablist"
            aria-label="Package categories"
            className="inline-flex max-w-full flex-wrap justify-center gap-1 rounded-2xl border border-neutral-200 bg-white p-1 shadow-soft"
          >
            {TABS.map(({ id, label, icon: Icon }) => {
              const selected = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTab(id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition sm:px-4 ${
                    selected
                      ? "bg-primary-600 text-white shadow-soft"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <Icon className="size-4 shrink-0" aria-hidden />
                  <span className="whitespace-nowrap">{label}</span>
                  <span
                    className={`rounded-full px-1.5 text-[11px] font-bold ${
                      selected ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {counts[id] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <PackageSkeleton />
            <PackageSkeleton />
            <PackageSkeleton />
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-danger-200 bg-danger-50 p-4 text-danger-700">
            {error}
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <Card className="flex flex-col items-center py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <PackageSearch className="size-6" aria-hidden />
            </span>
            <p className="mt-4 font-semibold text-neutral-900">
              No packages in this category yet
            </p>
            <p className="mt-1 max-w-sm text-sm text-neutral-600">
              We&apos;re curating new trips right now. Try another category in the meantime.
            </p>
          </Card>
        )}

        {!loading && !error && visible.length > 0 && (
          <>
            <p className="mb-4 text-sm text-neutral-500">
              Showing {visible.length} package{visible.length > 1 ? "s" : ""}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((pkg) => (
                <PackageTicketCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </>
        )}
      </Section>

      <Section tone="dark">
        <div className="text-center">
          <p className="text-lg font-semibold sm:text-xl">Your travel, our care</p>
          <p className="mt-1 text-sm text-white/80">24×7 trip support for all package enquiries</p>
          <a href="tel:+13155386030">
            <Button variant="secondary" size="lg" className="mt-4">
              Call us
            </Button>
          </a>
        </div>
      </Section>
    </Layout>
  );
}

function PackageSkeleton() {
  return (
    <div className="flex h-full animate-pulse flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white">
      <div className="h-44 bg-neutral-200 sm:h-48" />
      <div className="flex flex-1 flex-col space-y-3 p-4 sm:p-5">
        <div className="h-3 w-3/4 rounded bg-neutral-100" />
        <div className="grid grid-cols-3 gap-2 border-y border-neutral-100 py-3">
          <div className="h-8 rounded bg-neutral-100" />
          <div className="h-8 rounded bg-neutral-100" />
          <div className="h-8 rounded bg-neutral-100" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded-full bg-neutral-100" />
          <div className="h-5 w-20 rounded-full bg-neutral-100" />
          <div className="h-5 w-14 rounded-full bg-neutral-100" />
        </div>
        <div className="mt-auto space-y-2 border-t border-neutral-100 pt-4">
          <div className="h-6 w-28 rounded bg-neutral-200" />
          <div className="h-3 w-40 rounded bg-neutral-100" />
          <div className="h-9 w-full rounded-xl bg-neutral-200" />
          <div className="h-9 w-full rounded-xl bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}
