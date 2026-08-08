import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { formatINR } from "../../lib/format";
import { HELPLINE_NUMBER, whatsappLink } from "../../lib/contact";
import type { TravelPackage } from "../../types";

interface PackageTicketCardProps {
  pkg: TravelPackage;
}

export function PackageTicketCard({ pkg }: PackageTicketCardProps) {
  const highlights = pkg.highlights.slice(0, 4);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-soft transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-elevated">
      <div
        className="relative flex h-44 flex-col justify-end overflow-hidden p-4 text-white sm:h-48"
        style={
          pkg.imageUrl ? undefined : { background: "linear-gradient(155deg, #071d4d, #1c52b8)" }
        }
      >
        {pkg.imageUrl && (
          <img
            src={pkg.imageUrl}
            alt={pkg.destination}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,29,77,0.2) 0%, rgba(7,29,77,0.85) 100%)",
          }}
          aria-hidden
        />
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75">
            {pkg.category === "upcoming_event"
              ? "Upcoming event"
              : pkg.category === "offer"
                ? "Special offer"
                : "Holiday package"}
          </p>
          <h3 className="mt-1 line-clamp-2 text-xl font-bold tracking-tight">{pkg.title}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-white/85">{pkg.destination}</p>
          {pkg.eventDate && (
            <p className="mt-2 inline-flex w-fit rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-white/25">
              Event · {pkg.eventDate}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {pkg.tagline && (
          <p className="line-clamp-2 text-sm italic text-neutral-500">{pkg.tagline}</p>
        )}

        <div className="mt-3 grid grid-cols-3 gap-2 border-y border-neutral-100 py-3">
          <Meta label="Duration" value={pkg.duration} />
          {pkg.stays ? (
            <Meta label="Stays" value={pkg.stays} />
          ) : (
            <Meta label="Stays" value="—" />
          )}
          <Meta label="Guests" value={pkg.guests} />
        </div>

        {highlights.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {highlights.map((h) => (
              <li
                key={h}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-semibold text-primary-800"
              >
                {h}
              </li>
            ))}
            {pkg.highlights.length > 4 && (
              <li className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-500">
                +{pkg.highlights.length - 4}
              </li>
            )}
          </ul>
        )}

        <div className="mt-auto border-t border-neutral-100 pt-4">
          {pkg.negotiable && (
            <span className="mb-1 inline-flex rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
              Price negotiable
            </span>
          )}
          <p className="text-xl font-bold text-primary-800">{formatINR(pkg.price)}</p>
          <p className="text-xs text-neutral-500">{pkg.priceNote}</p>

          <div className="mt-3 space-y-2">
            <Link to={`/packages/${pkg.id}`} className="block">
              <Button size="sm" className="w-full">
                View details
              </Button>
            </Link>
            <div className="flex gap-2">
              <a href={`tel:${HELPLINE_NUMBER}`} className="flex-1">
                <Button size="sm" variant="secondary" className="w-full">
                  Call
                </Button>
              </a>
              <a
                href={whatsappLink(`Hi Tripime, I'm interested in the "${pkg.title}" package.`)}
                target="_blank"
                rel="noreferrer"
                className="flex-1"
              >
                <Button size="sm" variant="outline" className="w-full">
                  <MessageCircle className="size-3.5" aria-hidden />
                  WhatsApp
                </Button>
              </a>
            </div>
            {pkg.pdfUrl && (
              <a href={pkg.pdfUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button size="sm" variant="outline" className="w-full">
                  Download PDF
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="truncate text-sm font-semibold text-neutral-900">{value}</p>
    </div>
  );
}
