import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ClipboardList, LayoutDashboard, LogOut, MessageSquare, Package } from "lucide-react";
import { Logo } from "../Logo";
import { clearAdminToken } from "../../lib/adminAuth";

const NAV_LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/bookings", label: "Booking requests", icon: ClipboardList },
  { to: "/admin/packages", label: "Packages", icon: Package },
  { to: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  function handleLogout() {
    clearAdminToken();
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-elevated"
      >
        Skip to main content
      </a>
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
                `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`
              }
            >
              <link.icon className="size-4 shrink-0" aria-hidden />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-neutral-100 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-danger-600 hover:bg-danger-50"
          >
            <LogOut className="size-4 shrink-0" aria-hidden />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-neutral-200 bg-white sm:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Logo className="h-7" />
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-danger-600"
            >
              <LogOut className="size-4" aria-hidden />
              Logout
            </button>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-neutral-100 px-2 py-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`
                }
              >
                <link.icon className="size-3.5" aria-hidden />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main id="admin-main-content" className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
