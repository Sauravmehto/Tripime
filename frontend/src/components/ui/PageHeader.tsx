import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  backTo?: string;
  backLabel?: string;
  onBack?: () => void;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  backTo,
  backLabel = "Back",
  onBack,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      {backTo && (
        <Link
          to={backTo}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800"
        >
          <span aria-hidden>←</span> {backLabel}
        </Link>
      )}
      {!backTo && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800"
        >
          <span aria-hidden>←</span> {backLabel}
        </button>
      )}
      <h1
        className={`text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl ${
          backTo || onBack ? "mt-2" : ""
        }`}
      >
        {title}
      </h1>
      {subtitle && <div className="mt-1 text-sm text-neutral-600 sm:text-base">{subtitle}</div>}
    </div>
  );
}
