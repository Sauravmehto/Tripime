import { useEffect, useState, type ReactNode } from "react";

interface ProductHeroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  /** Single static image (used when `images` is omitted). */
  image?: string;
  /** Optional rotating gallery; falls back to `image` when empty. */
  images?: string[];
  children?: ReactNode;
  trustItems?: string[];
}

export function ProductHero({
  eyebrow,
  title,
  subtitle,
  image,
  images,
  children,
  trustItems,
}: ProductHeroProps) {
  const gallery = images && images.length > 0 ? images : image ? [image] : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (gallery.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % gallery.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, [gallery.length]);

  return (
    <section className="relative isolate overflow-hidden">
      {gallery.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1200ms] ease-in-out ${
            activeIndex === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${src})` }}
          aria-hidden
        />
      ))}

      <div
        className="absolute inset-0 bg-gradient-to-br from-[#071d4d]/92 via-[#0d2f70]/72 to-[#1c52b8]/35"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-neutral-50 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/90 ring-1 ring-inset ring-white/20 backdrop-blur-sm">
            {eyebrow}
          </span>
          <h1 className="mt-5 text-[2rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
              {subtitle}
            </p>
          )}

          {trustItems && trustItems.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {trustItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-1.5 text-sm font-medium text-white/80"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4 text-secondary-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden
                  >
                    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {children && <div className="relative z-20 mt-10 lg:mt-12">{children}</div>}
      </div>
    </section>
  );
}
