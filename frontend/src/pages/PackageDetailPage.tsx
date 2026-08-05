import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import {
  PACKAGE_HELPLINE,
  PACKAGE_HELPLINE_DISPLAY,
} from "../components/packages/PackageTicketCard";
import { Button } from "../components/ui/Button";
import { Card, PriceDisplay, Spinner } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { getPackage } from "../api/packageApi";
import { getErrorMessage } from "../api/apiClient";
import { formatINR } from "../lib/format";
import type { TravelPackage } from "../types";

const CATEGORY_LABEL: Record<string, string> = {
  domestic: "Domestic",
  international: "International",
  offer: "Offer",
  upcoming_event: "Upcoming event",
};

export function PackageDetailPage() {
  const { packageId } = useParams();
  const [pkg, setPkg] = useState<TravelPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!packageId) return;
      setLoading(true);
      setError("");
      try {
        const data = await getPackage(packageId);
        if (!cancelled) setPkg(data);
      } catch (err) {
        if (!cancelled) {
          setPkg(null);
          setError(getErrorMessage(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [packageId]);

  return (
    <Layout>
      <PageHeader
        backTo="/packages"
        backLabel="Back to packages"
        title={pkg?.title ?? "Package details"}
        subtitle={pkg ? pkg.tagline : undefined}
      />

      {loading && (
        <Card>
          <Spinner label="Loading package…" />
        </Card>
      )}

      {error && (
        <Card className="border-danger-200 bg-danger-50 text-danger-700">
          <p>{error}</p>
          <Link to="/packages" className="mt-3 inline-block text-sm font-semibold text-primary-700">
            Browse all packages
          </Link>
        </Card>
      )}

      {pkg && !loading && (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-5">
            <div
              className="overflow-hidden rounded-3xl border border-neutral-200 bg-cover bg-center shadow-soft"
              style={{
                backgroundImage: pkg.imageUrl
                  ? `linear-gradient(180deg, rgba(7,29,77,0.15), rgba(7,29,77,0.65)), url(${pkg.imageUrl})`
                  : undefined,
                minHeight: 260,
              }}
            >
              <div className="flex h-full min-h-[260px] flex-col justify-end p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/80">
                  {CATEGORY_LABEL[pkg.category] ?? pkg.category}
                </p>
                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{pkg.destination}</h2>
              </div>
            </div>

            <Card>
              <h2 className="font-semibold text-neutral-900">Trip overview</h2>
              <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-neutral-500">Duration</dt>
                  <dd className="mt-1 font-semibold text-neutral-900">{pkg.duration}</dd>
                </div>
                {pkg.stays && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">Stays</dt>
                    <dd className="mt-1 font-semibold text-neutral-900">{pkg.stays}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs uppercase tracking-wide text-neutral-500">Guests</dt>
                  <dd className="mt-1 font-semibold text-neutral-900">{pkg.guests}</dd>
                </div>
                {pkg.eventDate && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">Event date</dt>
                    <dd className="mt-1 font-semibold text-neutral-900">{pkg.eventDate}</dd>
                  </div>
                )}
              </dl>
            </Card>

            {pkg.highlights.length > 0 && (
              <Card>
                <h2 className="font-semibold text-neutral-900">Highlights</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {pkg.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-primary-800"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {pkg.itinerary.length > 0 && (
              <Card>
                <h2 className="font-semibold text-neutral-900">Day-by-day itinerary</h2>
                <ol className="mt-4 space-y-3">
                  {pkg.itinerary.map((day, i) => (
                    <li
                      key={i}
                      className="flex gap-3 rounded-xl border border-neutral-100 bg-neutral-50/80 px-4 py-3 text-sm text-neutral-700"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-800 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{day}</span>
                    </li>
                  ))}
                </ol>
              </Card>
            )}
          </div>

          <Card className="h-fit lg:sticky lg:top-24">
            <h2 className="font-semibold text-neutral-900">Pricing</h2>
            {pkg.negotiable && (
              <span className="mt-2 inline-flex rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent">
                Price negotiable
              </span>
            )}
            <p className="mt-3">
              <PriceDisplay amount={formatINR(pkg.price)} className="text-3xl" />
            </p>
            <p className="mt-1 text-sm text-neutral-500">{pkg.priceNote}</p>

            <div className="mt-6 space-y-2">
              <a href={`tel:${PACKAGE_HELPLINE}`} className="block">
                <Button size="lg" className="w-full">
                  Call {PACKAGE_HELPLINE_DISPLAY}
                </Button>
              </a>
              {pkg.pdfUrl && (
                <a
                  href={pkg.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button size="lg" variant="outline" className="w-full">
                    View itinerary PDF
                  </Button>
                </a>
              )}
              <Link to="/packages" className="block">
                <Button size="lg" variant="ghost" className="w-full">
                  Browse more packages
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-xs text-neutral-500">
              Our travel experts will customise dates, hotels and inclusions for your group.
            </p>
          </Card>
        </div>
      )}
    </Layout>
  );
}
