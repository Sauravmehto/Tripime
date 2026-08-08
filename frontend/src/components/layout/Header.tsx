import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Phone, Ticket } from "lucide-react";
import { Logo } from "../Logo";
import { HELPLINE_DISPLAY, telLink } from "../../lib/contact";

const NAV_LINKS: { to: string; label: string; soon?: boolean }[] = [
  { to: "/", label: "Flights" },
  { to: "/packages", label: "Packages" },
  { to: "/hotels", label: "Hotels", soon: true },
  { to: "/buses", label: "Buses", soon: true },
  { to: "/visa", label: "Visa", soon: true },
];

interface HeaderProps {
  /** Transparent over hero until scroll; used on bare/marketing pages. */
  overlay?: boolean;
}

export function Header({ overlay = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, []);

  const isOverlay = overlay && !scrolled;
  const navLinkClass = ({ isActive }: { isActive: boolean }) => {
    if (isOverlay) {
      return isActive ? "text-white" : "text-white/80 hover:text-white";
    }
    return isActive ? "text-primary-700" : "text-neutral-600 hover:text-primary-700";
  };

  return (
    <>
      <header
        className={`${
          overlay ? "fixed inset-x-0 top-0" : "sticky top-0"
        } z-50 border-b transition ${
          isOverlay
            ? "border-transparent bg-transparent"
            : "border-neutral-200/80 bg-white/95 shadow-soft backdrop-blur"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
            <Logo className={`h-8 ${isOverlay ? "brightness-0 invert" : ""}`} />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === "/"}>
                <span className="inline-flex items-center gap-1.5">
                  {link.label}
                  {link.soon && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        isOverlay ? "bg-white/20 text-white" : "bg-secondary-100 text-secondary-700"
                      }`}
                    >
                      Soon
                    </span>
                  )}
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/my-booking"
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition ${
                isOverlay
                  ? "text-white/90 hover:bg-white/10 hover:text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-primary-700"
              }`}
            >
              <Ticket className="size-4" aria-hidden />
              My Booking
            </Link>
            <a
              href={telLink()}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition ${
                isOverlay
                  ? "text-white/90 hover:bg-white/10 hover:text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-primary-700"
              }`}
              title={`Call ${HELPLINE_DISPLAY}`}
            >
              <Phone className="size-4" aria-hidden />
              Support
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className={`flex size-9 items-center justify-center rounded-lg md:hidden ${
              isOverlay
                ? "text-white hover:bg-white/10"
                : "text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-neutral-100 bg-white px-4 py-3 md:hidden">
            <ul className="flex flex-col gap-1 text-sm font-semibold">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-lg px-3 py-2.5 ${
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }`
                    }
                  >
                    {link.label}
                    {link.soon && (
                      <span className="rounded-full bg-secondary-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary-700">
                        Soon
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex flex-col gap-1 border-t border-neutral-100 pt-2 text-sm font-semibold">
              <Link
                to="/my-booking"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-neutral-700 hover:bg-neutral-50"
              >
                <Ticket className="size-4" aria-hidden />
                My Booking
              </Link>
              <a
                href={telLink()}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-neutral-700 hover:bg-neutral-50"
              >
                <Phone className="size-4" aria-hidden />
                Call support · {HELPLINE_DISPLAY}
              </a>
            </div>
          </nav>
        )}
      </header>
      {!overlay && <div className="h-0" aria-hidden />}
    </>
  );
}
