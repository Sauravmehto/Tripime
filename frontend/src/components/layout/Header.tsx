import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Logo } from "../Logo";

const NAV_LINKS = [
  { to: "/", label: "Flights" },
  { to: "/hotels", label: "Hotels" },
  { to: "/buses", label: "Buses" },
  { to: "/packages", label: "Packages" },
  { to: "/visa", label: "Visa" },
];

export function Header() {
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-primary-700"
      : "text-neutral-600 hover:text-primary-700";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition ${
        scrolled
          ? "border-neutral-200/80 bg-white/95 shadow-soft backdrop-blur"
          : "border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
          <Logo className="h-8" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="flex size-9 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100 md:hidden"
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
                    `block rounded-lg px-3 py-2.5 ${
                      isActive
                        ? "bg-primary-50 text-primary-700"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
