import type { ReactNode } from "react";

interface ProductHeroProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  image: string;
  children?: ReactNode;
}

export function ProductHero({ eyebrow, title, subtitle, image, children }: ProductHeroProps) {
  return (
    <section className="relative z-10 flex min-h-[420px] flex-col overflow-hidden pb-16 pt-10 sm:min-h-[460px] sm:pb-20 sm:pt-14">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a2a6b]/85 via-[#123a82]/70 to-[#1c52b8]/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a2a6b]/90 via-[#1c52b8]/50 to-transparent" />
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(0 0, 72% 0, 52% 100%, 0 100%)",
          background: "linear-gradient(135deg, rgba(10,42,107,0.9), rgba(28,82,184,0.78))",
        }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-secondary-400/20 blur-3xl" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="mt-4 max-w-2xl sm:mt-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-white/90">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-md sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">{subtitle}</p>}
        </div>

        {children && (
          <div className="relative z-20 mt-8 lg:mt-10">{children}</div>
        )}
      </div>
    </section>
  );
}
