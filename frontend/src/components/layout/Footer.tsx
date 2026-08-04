import { Link } from "react-router-dom";
import { Logo } from "../Logo";

const QUICK_LINKS = [
  { to: "/", label: "Flights" },
  { to: "/hotels", label: "Hotels" },
  { to: "/buses", label: "Buses" },
  { to: "/packages", label: "Packages" },
  { to: "/visa", label: "Visa" },
];

const LEGAL_LINKS = ["Terms & Conditions", "Privacy Policy", "Refund Policy"];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-900 text-neutral-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo className="h-8 brightness-0 invert" />
          <p className="mt-3 max-w-xs text-sm text-neutral-400">
            Search, compare &amp; book flights, hotels, buses, packages and visas — all in one
            place.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-200">
            Quick links
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
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-200">Legal</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {LEGAL_LINKS.map((label) => (
              <li key={label}>
                <a href="#" className="hover:text-white">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-200">
            24/7 Helpline
          </p>
          <p className="mt-3 text-sm">+1 315 538 6030</p>
          <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-neutral-200">
            Email
          </p>
          <p className="mt-1 text-sm">info@tripime.com</p>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} Tripime. All rights reserved.
      </div>
    </footer>
  );
}
