import { ChevronRight } from "lucide-react";
import { CarouselRail } from "./CarouselRail";
import { MOOD_CARDS } from "./holidaysData";
import { formatINR } from "../../lib/format";

interface MoodsCarouselProps {
  onSelectMood: (matchTerms: string[]) => void;
}

export function MoodsCarousel({ onSelectMood }: MoodsCarouselProps) {
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold tracking-tight text-neutral-800 sm:text-2xl">
              Holidays for every mood
            </h2>
            <p className="mt-1 text-sm text-neutral-500 sm:text-base">
              Curated holiday experiences tailored to your interests — from beach escapes and
              cultural journeys to adventure trips and relaxing getaways.
            </p>
          </div>
          <a
            href="#all-packages"
            className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-brand-coral hover:text-brand-coral"
            aria-label="See all packages"
          >
            <ChevronRight className="size-4" aria-hidden />
          </a>
        </div>

        <CarouselRail gapClassName="gap-3 sm:gap-4">
          {MOOD_CARDS.map((mood) => (
            <button
              key={mood.id}
              type="button"
              onClick={() => onSelectMood(mood.match)}
              className="group relative h-64 w-[148px] shrink-0 snap-start overflow-hidden rounded-2xl text-left sm:h-72 sm:w-[168px]"
            >
              <img
                src={mood.image}
                alt={mood.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 via-transparent to-neutral-900/75"
                aria-hidden
              />
              <p className="absolute left-3 top-3 text-sm font-bold text-white drop-shadow">
                {mood.title}
              </p>
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="text-[10px] font-medium text-white/80">Starting from</p>
                <p className="text-base font-bold text-white">{formatINR(mood.price)}</p>
              </div>
            </button>
          ))}
        </CarouselRail>

        <p className="mt-4 text-center text-xs text-neutral-400">
          Prefer browsing everything?{" "}
          <a href="#all-packages" className="font-semibold text-primary-700 hover:underline">
            Jump to all packages
          </a>
        </p>
      </div>
    </section>
  );
}
