const STEPS = [
  { id: "passengers", label: "Passengers" },
  { id: "review", label: "Review" },
  { id: "seats", label: "Seats" },
  { id: "payment", label: "Payment" },
] as const;

type BookingStep = (typeof STEPS)[number]["id"];

interface StepperProps {
  current: BookingStep;
  className?: string;
}

export function Stepper({ current, className = "" }: StepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Booking progress" className={`mb-8 ${className}`}>
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;

          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
              <div
                className="flex min-w-0 items-center gap-2"
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                    done
                      ? "bg-primary-600 text-white"
                      : active
                        ? "bg-primary-600 text-white ring-4 ring-primary-100"
                        : "bg-neutral-200 text-neutral-500"
                  }`}
                >
                  {done ? (
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={`hidden truncate text-sm font-semibold sm:inline ${
                    active || done ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <span
                  className={`mx-1 hidden h-px flex-1 sm:block ${
                    done ? "bg-primary-400" : "bg-neutral-200"
                  }`}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
