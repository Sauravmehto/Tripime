import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { SERVICE_CARDS } from "./holidaysData";

export function OtherServicesGrid() {
  return (
    <section className="bg-neutral-50 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-5 text-xl font-bold tracking-tight text-neutral-800 sm:text-2xl">
          Tripime&apos;s other services
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CARDS.map((service) => {
            const external = service.href.startsWith("tel:");
            const className =
              "group relative flex min-h-[160px] overflow-hidden rounded-2xl shadow-soft sm:min-h-[180px]";

            const content = (
              <>
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-neutral-900/85 via-neutral-900/25 to-transparent"
                  aria-hidden
                />
                <div className="relative mt-auto p-5">
                  <p className="text-lg font-bold text-white">{service.title}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-white/90">
                    {service.cta}
                    <ChevronRight className="size-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                  </p>
                </div>
              </>
            );

            if (external) {
              return (
                <a key={service.id} href={service.href} className={className}>
                  {content}
                </a>
              );
            }

            return (
              <Link key={service.id} to={service.href} className={className}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
