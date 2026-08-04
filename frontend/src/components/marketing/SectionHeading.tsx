interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({ title, subtitle, className = "" }: SectionHeadingProps) {
  return (
    <div className={`mb-8 max-w-2xl ${className}`}>
      <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-neutral-600 sm:text-base">{subtitle}</p>}
    </div>
  );
}
