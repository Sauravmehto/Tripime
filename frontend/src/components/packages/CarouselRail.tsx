import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselRailProps {
  children: ReactNode;
  className?: string;
  /** Extra gap between cards. */
  gapClassName?: string;
}

export function CarouselRail({
  children,
  className = "",
  gapClassName = "gap-4",
}: CarouselRailProps) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.75, 360);
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={ref}
        className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth ${gapClassName} pb-1`}
      >
        {children}
      </div>

      <NavButton
        label="Scroll left"
        onClick={() => scroll(-1)}
        className="left-0 -translate-x-1/2"
        icon={<ChevronLeft className="size-4" aria-hidden />}
      />
      <NavButton
        label="Scroll right"
        onClick={() => scroll(1)}
        className="right-0 translate-x-1/2"
        icon={<ChevronRight className="size-4" aria-hidden />}
      />
    </div>
  );
}

function NavButton({
  label,
  onClick,
  className,
  icon,
}: {
  label: string;
  onClick: () => void;
  className: string;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-medium transition hover:bg-neutral-50 hover:text-brand-coral md:flex ${className}`}
    >
      {icon}
    </button>
  );
}
