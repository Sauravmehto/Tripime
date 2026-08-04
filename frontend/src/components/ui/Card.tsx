import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export function Card({ children, className = "", padded = true, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200 bg-white shadow-soft ${padded ? "p-5 sm:p-6" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger";
}) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-700",
    primary: "bg-primary-50 text-primary-700",
    success: "bg-success-50 text-success-700",
    warning: "bg-warning-50 text-warning-600",
    danger: "bg-danger-50 text-danger-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function PageContainer({
  children,
  className = "",
  narrow = false,
}: {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${narrow ? "max-w-5xl" : "max-w-6xl"} ${className}`}>
      {children}
    </div>
  );
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-neutral-600">
      <span className="size-5 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
      {label}
    </div>
  );
}

export function PriceDisplay({ amount, className = "" }: { amount: string; className?: string }) {
  return <span className={`font-bold text-primary-700 ${className}`}>{amount}</span>;
}
