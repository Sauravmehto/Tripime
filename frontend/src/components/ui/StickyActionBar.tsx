import type { ReactNode } from "react";
import { Button } from "./Button";

interface StickyActionBarProps {
  totalLabel?: string;
  total: string;
  ctaLabel: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  extra?: ReactNode;
}

export function StickyActionBar({
  totalLabel = "Total",
  total,
  ctaLabel,
  onClick,
  disabled = false,
  loading = false,
  extra,
}: StickyActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 shadow-elevated backdrop-blur lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-neutral-500">{totalLabel}</p>
          <p className="truncate text-base font-bold text-primary-700">{total}</p>
          {extra}
        </div>
        <Button
          size="lg"
          className="h-12 shrink-0"
          disabled={disabled || loading}
          onClick={onClick}
        >
          {loading ? "Processing…" : ctaLabel}
        </Button>
      </div>
    </div>
  );
}
