import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import { HELPLINE_DISPLAY, SUPPORT_EMAIL, mailLink, telLink } from "../../lib/contact";

const QUICK_LINKS = [
  { to: "/", label: "Flights" },
  { to: "/packages", label: "Packages" },
  { to: "/hotels", label: "Hotels (soon)" },
  { to: "/buses", label: "Buses (soon)" },
  { to: "/visa", label: "Visa (soon)" },
];

const COMPANY_LINKS = [
  { to: "/about", label: "About us" },
  { to: "/contact", label: "Contact us" },
];

const LEGAL_LINKS = [
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/refund-policy", label: "Refund Policy" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-900 text-neutral-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo className="h-8 brightness-0 invert" />
          <p className="mt-3 max-w-xs text-sm text-neutral-400">
            Search &amp; book flights and holiday packages today — hotels, buses and visas
            coming soon, all in one place.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-200">
            Explore
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-200">
            Company
          </p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {COMPANY_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-200">Legal</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {LEGAL_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-200">
            Helpline
          </p>
          <a href={telLink()} className="mt-3 block text-sm hover:text-white">
            {HELPLINE_DISPLAY}
          </a>
          <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-neutral-200">
            Email
          </p>
          <a href={mailLink()} className="mt-1 block text-sm hover:text-white">
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Tripime. All rights reserved.
      </div>
    </footer>
  );
}
