import { useEffect, useMemo, useState } from "react";
import { PackageSearch } from "lucide-react";
import { Layout } from "../components/Layout";
import { HolidaysHero } from "../components/packages/HolidaysHero";
import { HolidaysPromoBanner } from "../components/packages/HolidaysPromoBanner";
import { MoodsCarousel } from "../components/packages/MoodsCarousel";
import { OtherServicesGrid } from "../components/packages/OtherServicesGrid";
import { PackageTicketCard } from "../components/packages/PackageTicketCard";
import { SpecialOffersSection } from "../components/packages/SpecialOffersSection";
import { TrendingDestinations } from "../components/packages/TrendingDestinations";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { listPackages } from "../api/packageApi";
import { getErrorMessage } from "../api/apiClient";
import { usePageTitle } from "../hooks/usePageTitle";
import { HELPLINE_NUMBER } from "../lib/contact";
import type { PackageCategory, TravelPackage } from "../types";

type OfferFilter = "all" | PackageCategory;

function matchesQuery(pkg: TravelPackage, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = `${pkg.title} ${pkg.destination} ${pkg.tagline} ${pkg.highlights.join(" ")}`.toLowerCase();
  return haystack.includes(q) || q.split(/\s+/).some((token) => haystack.includes(token));
}

function matchesMood(pkg: TravelPackage, terms: string[]): boolean {
  const haystack = `${pkg.title} ${pkg.destination}`.toLowerCase();
  return terms.some((term) => haystack.includes(term.toLowerCase()));
}

export function PackagesPage() {
  usePageTitle(
    "Holiday Packages",
    "Browse curated domestic and international holiday packages on Tripime — forts, beaches, honeymoons and more, with a real travel expert on call.",
  );
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offerFilter, setOfferFilter] = useState<OfferFilter>("all");
  const [trendTab, setTrendTab] = useState<"domestic" | "international">("domestic");
  const [listQuery, setListQuery] = useState("");

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

  const rajasthanPkg = useMemo(
    () => packages.find((p) => /rajasthan/i.test(p.title) || /rajasthan/i.test(p.destination)),
    [packages],
  );

  const filteredList = useMemo(() => {
    if (!listQuery.trim()) return packages;
    return packages.filter((p) => matchesQuery(p, listQuery));
  }, [packages, listQuery]);

  function scrollToPackages() {
    document.getElementById("all-packages")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSearch(values: { from: string; to: string; month: string }) {
    setListQuery(values.to);
    if (/goa|kerala|rajasthan|varanasi|himachal|kashmir/i.test(values.to)) {
      setTrendTab("domestic");
      setOfferFilter("domestic");
    } else if (/bali|mauritius|dubai|singapore|thailand/i.test(values.to)) {
      setTrendTab("international");
      setOfferFilter("international");
    }
    window.setTimeout(scrollToPackages, 50);
  }

  function handleMoodSelect(terms: string[]) {
    const matched = packages.filter((p) => matchesMood(p, terms));
    if (matched.length > 0) {
      setListQuery(terms[0] ?? "");
    } else {
      setListQuery(terms.join(" "));
    }
    window.setTimeout(scrollToPackages, 50);
  }

  return (
    <Layout bare overlay={false}>
      <HolidaysHero onSearch={handleSearch} />

      {loading && (
        <div className="bg-neutral-100/80 py-12">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-neutral-50 px-4 py-8">
          <div className="mx-auto max-w-6xl rounded-2xl border border-danger-200 bg-danger-50 p-4 text-danger-700">
            {error}
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <SpecialOffersSection
            packages={packages}
            filter={offerFilter}
            onFilterChange={setOfferFilter}
          />

          <HolidaysPromoBanner packageId={rajasthanPkg?.id} />

          <TrendingDestinations
            packages={packages}
            tab={trendTab}
            onTabChange={setTrendTab}
          />

          <MoodsCarousel onSelectMood={handleMoodSelect} />

          <OtherServicesGrid />

          <section id="all-packages" className="bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                    All holiday packages
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    {listQuery.trim()
                      ? `Showing results for “${listQuery.trim()}”`
                      : "Browse every Tripime package in one place"}
                  </p>
                </div>
                {listQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => setListQuery("")}
                    className="text-sm font-semibold text-primary-700 hover:text-primary-800"
                  >
                    Clear search
                  </button>
                )}
              </div>

              {filteredList.length === 0 ? (
                <Card className="flex flex-col items-center py-12 text-center">
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                    <PackageSearch className="size-6" aria-hidden />
                  </span>
                  <p className="mt-4 font-semibold text-neutral-900">No packages matched</p>
                  <p className="mt-1 max-w-sm text-sm text-neutral-600">
                    Try another destination from the search above, or clear filters.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setListQuery("")}
                  >
                    Show all packages
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredList.map((pkg) => (
                    <PackageTicketCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      <section className="bg-primary-800 py-12 text-white sm:py-14">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-lg font-semibold sm:text-xl">Your travel, our care</p>
          <p className="mt-1 text-sm text-white/80">
            24×7 trip support for all package enquiries
          </p>
          <a href={`tel:${HELPLINE_NUMBER}`}>
            <Button variant="secondary" size="lg" className="mt-4">
              Call us
            </Button>
          </a>
        </div>
      </section>
    </Layout>
  );
}

function SkeletonCard() {
  return (
    <div className="h-40 animate-pulse rounded-2xl border border-neutral-200 bg-white shadow-soft" />
  );
}
