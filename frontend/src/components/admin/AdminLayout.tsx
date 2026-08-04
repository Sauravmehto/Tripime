import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Logo } from "../Logo";
import { clearAdminToken } from "../../lib/adminAuth";

const NAV_LINKS = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/bookings", label: "Booking requests" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  function handleLogout() {
    clearAdminToken();
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden w-60 flex-col border-r border-neutral-200 bg-white sm:flex">
        <div className="border-b border-neutral-100 px-5 py-4">
          <Logo className="h-7" />
          <p className="mt-1 text-xs font-medium text-neutral-500">Admin panel</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-semibold ${
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-neutral-100 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-danger-600 hover:bg-danger-50"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 sm:hidden">
          <Logo className="h-7" />
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm font-semibold text-danger-600"
          >
            Logout
          </button>
        </header>
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
