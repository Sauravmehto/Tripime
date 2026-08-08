import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";

interface HolidaysPromoBannerProps {
  packageId?: string;
}

export function HolidaysPromoBanner({ packageId }: HolidaysPromoBannerProps) {
  const href = packageId ? `/packages/${packageId}` : "#trending";

  return (
    <section className="bg-neutral-100/80 pb-10 sm:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#ead9c4] bg-[#f7efe4] shadow-soft">
          <div className="grid items-center gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:p-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-coral">
                Featured destination
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                Skip the line at{" "}
                <span className="italic text-brand-coral">Rajasthan&apos;s</span> iconic sites
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Forts, palaces, safaris and heritage stays — curated as ready-to-book packages.
              </p>
              <div className="mt-4 rounded-xl border border-brand-coral/40 bg-white/60 px-3 py-2.5 text-xs leading-relaxed text-neutral-700">
                Categories to include: 80+ Forts &amp; Palaces · Wildlife &amp; Safaris · Museums
                &amp; Heritage · Light &amp; Sound · Composite packages
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link to={href}>
                  <Button variant="coral" className="rounded-full px-5">
                    Book Rajasthan packages
                  </Button>
                </Link>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600">
                  <ShieldCheck className="size-3.5 text-success-600" aria-hidden />
                  Trusted Tripime curation
                </span>
              </div>
            </div>

            <div className="relative min-h-[200px] overflow-hidden rounded-2xl sm:min-h-[240px]">
              <img
                src="https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Rajasthan forts and palaces"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 via-transparent to-transparent"
                aria-hidden
              />
              <span className="absolute right-3 top-3 rounded-full bg-brand-coral px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-soft">
                Heritage special
              </span>
              <p className="absolute bottom-3 left-3 text-sm font-semibold text-white drop-shadow">
                Jaipur · Jodhpur · Udaipur
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
