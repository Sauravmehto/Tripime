import { useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { HELPLINE_DISPLAY, telLink, whatsappLink } from "../../lib/contact";

export function FloatingHelp() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6">
      {open && (
        <div className="animate-fade-up flex w-56 flex-col gap-1 rounded-2xl border border-neutral-200 bg-white p-2 shadow-elevated">
          <p className="px-2.5 pt-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Need help?
          </p>
          <a
            href={whatsappLink("Hi Tripime, I have a question.")}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:bg-success-50"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success-100 text-success-700">
              <MessageCircle className="size-4" aria-hidden />
            </span>
            WhatsApp us
          </a>
          <a
            href={telLink()}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-sm font-semibold text-neutral-800 transition hover:bg-primary-50"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <Phone className="size-4" aria-hidden />
            </span>
            <span className="text-left">
              Call us
              <span className="block text-[11px] font-normal text-neutral-500">
                {HELPLINE_DISPLAY}
              </span>
            </span>
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close help menu" : "Chat with us on WhatsApp or call"}
        className="flex size-14 items-center justify-center rounded-full bg-success-600 text-white shadow-elevated transition hover:bg-success-700 active:scale-95"
      >
        {open ? (
          <X className="size-5" aria-hidden />
        ) : (
          <MessageCircle className="size-6" aria-hidden />
        )}
      </button>
    </div>
  );
}
