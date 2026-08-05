import { ArrowUpDown } from "lucide-react";
import { SORT_OPTIONS, type SortKey, type SortTeaser } from "./flightFilters";
import { formatDuration, formatINR } from "../../lib/format";

interface FlightSortBarProps {
  value: SortKey;
  onChange: (value: SortKey) => void;
  teasers: Record<SortKey, SortTeaser | null>;
}

export function FlightSortBar({ value, onChange, teasers }: FlightSortBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Sort flights"
      className="no-scrollbar flex gap-1 overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-soft"
    >
      <span className="hidden shrink-0 items-center gap-1.5 px-3 text-xs font-semibold uppercase tracking-wide text-neutral-400 lg:flex">
        <ArrowUpDown className="size-3.5" aria-hidden />
        Sort
      </span>
      {SORT_OPTIONS.map((option) => {
        const teaser = teasers[option.id];
        const active = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.id)}
            className={`min-w-[132px] flex-1 rounded-xl px-3 py-2 text-left transition ${
              active
                ? "bg-primary-50 text-primary-800 ring-1 ring-primary-200"
                : "text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <span className="block truncate text-sm font-semibold">{option.label}</span>
            <span className="block truncate text-xs text-neutral-500">
              {teaser
                ? `${formatINR(teaser.price)} · ${formatDuration(teaser.minutes)}`
                : "No flights"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
