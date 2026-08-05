import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Clock,
  IndianRupee,
  Package,
  RefreshCw,
  Ticket,
} from "lucide-react";
import { getAdminStats, listAdminBookings, listAdminPackages } from "../../api/adminApi";
import { getErrorMessage } from "../../api/apiClient";
import { Badge, Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { clearAdminToken } from "../../lib/adminAuth";
import { formatINR } from "../../lib/format";
import type { AdminStats, Booking, TravelPackage } from "../../types";

function relativeTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleAuthError = useCallback(
    (err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        clearAdminToken();
        navigate("/admin/login");
        return true;
      }
      return false;
    },
    [navigate],
  );

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        const [statsData, bookingsData, packagesData] = await Promise.all([
          getAdminStats(),
          listAdminBookings(),
          listAdminPackages(),
        ]);
        setStats(statsData);
        setBookings(bookingsData);
        setPackages(packagesData);
      } catch (err) {
        if (handleAuthError(err)) return;
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [handleAuthError],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const pendingBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "PROCESSING")
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5),
    [bookings],
  );

  const activePackages = useMemo(() => packages.filter((p) => p.active).length, [packages]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      domestic: 0,
      international: 0,
      offer: 0,
      upcoming_event: 0,
    };
    for (const p of packages) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [packages]);

  const recentPackages = useMemo(
    () =>
      [...packages]
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 5),
    [packages],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-neutral-600">
            Bookings, packages, and what needs attention.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled={loading || refreshing}
          onClick={() => void load(true)}
        >
          <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-danger-200 bg-danger-50 p-3 text-sm text-danger-700">
          {error}
        </div>
      )}

      {loading && <DashboardSkeleton />}

      {!loading && stats && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <StatCard
              label="Total bookings"
              value={stats.totalBookings.toString()}
              icon={<Ticket className="size-4" />}
              tone="primary"
            />
            <StatCard
              label="Pending"
              value={stats.pendingBookings.toString()}
              icon={<Clock className="size-4" />}
              tone="warning"
            />
            <StatCard
              label="Confirmed"
              value={stats.confirmedBookings.toString()}
              icon={<CircleCheck className="size-4" />}
              tone="success"
            />
            <StatCard
              label="Today"
              value={stats.bookingsToday.toString()}
              icon={<CalendarDays className="size-4" />}
              tone="neutral"
            />
            <StatCard
              label="Revenue"
              value={formatINR(stats.totalRevenue)}
              icon={<IndianRupee className="size-4" />}
              tone="primary"
              className="col-span-2 lg:col-span-1"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <QuickLink
              to="/admin/bookings"
              title="Booking requests"
              subtitle={`${stats.pendingBookings} pending confirmation`}
              icon={<Ticket className="size-5" />}
              tone="warning"
            />
            <QuickLink
              to="/admin/packages"
              title="Packages"
              subtitle={`${activePackages} active · ${packages.length} total`}
              icon={<Package className="size-5" />}
              tone="primary"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card padded={false} className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-warning-600" aria-hidden />
                  <h2 className="text-sm font-bold text-neutral-900">Pending booking requests</h2>
                </div>
                <Link
                  to="/admin/bookings"
                  className="text-xs font-semibold text-primary-700 hover:text-primary-800"
                >
                  View all
                </Link>
              </div>
              {pendingBookings.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-neutral-500">
                  No pending bookings right now.
                </p>
              ) : (
                <ul className="divide-y divide-neutral-100">
                  {pendingBookings.map((b) => (
                    <li
                      key={b.bookingId}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-neutral-900">
                          {b.pnr}{" "}
                          <span className="font-normal text-neutral-500">
                            · {b.flight.origin.code} → {b.flight.destination.code}
                          </span>
                        </p>
                        <p className="text-xs text-neutral-500">{relativeTime(b.createdAt)}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold text-primary-700">
                          {formatINR(b.totalAmount)}
                        </p>
                        <Badge tone="warning">PROC</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card padded={false} className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Package className="size-4 text-primary-600" aria-hidden />
                  <h2 className="text-sm font-bold text-neutral-900">Packages snapshot</h2>
                </div>
                <Link
                  to="/admin/packages"
                  className="text-xs font-semibold text-primary-700 hover:text-primary-800"
                >
                  Manage
                </Link>
              </div>
              <div className="flex flex-wrap gap-2 border-b border-neutral-100 px-4 py-3">
                {(
                  [
                    ["domestic", "Domestic"],
                    ["international", "International"],
                    ["offer", "Offers"],
                    ["upcoming_event", "Events"],
                  ] as const
                ).map(([key, label]) => (
                  <span
                    key={key}
                    className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-700"
                  >
                    {label} {categoryCounts[key] ?? 0}
                  </span>
                ))}
              </div>
              {recentPackages.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-neutral-500">
                  No packages yet.
                </p>
              ) : (
                <ul className="divide-y divide-neutral-100">
                  {recentPackages.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-neutral-900">{p.title}</p>
                        <p className="truncate text-xs capitalize text-neutral-500">
                          {p.category.replace("_", " ")}
                        </p>
                      </div>
                      <Badge tone={p.active ? "success" : "neutral"}>
                        {p.active ? "Active" : "Hidden"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

const tones = {
  primary: "bg-primary-50 text-primary-700",
  warning: "bg-warning-50 text-warning-600",
  success: "bg-success-50 text-success-700",
  neutral: "bg-neutral-100 text-neutral-600",
} as const;

function StatCard({
  label,
  value,
  icon,
  tone,
  className = "",
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone: keyof typeof tones;
  className?: string;
}) {
  return (
    <Card className={`!p-3.5 ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
          {label}
        </p>
        <span className={`flex size-7 items-center justify-center rounded-lg ${tones[tone]}`}>
          {icon}
        </span>
      </div>
      <p className="mt-2 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
        {value}
      </p>
    </Card>
  );
}

function QuickLink({
  to,
  title,
  subtitle,
  icon,
  tone,
}: {
  to: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  tone: keyof typeof tones;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-soft transition hover:border-primary-200 hover:shadow-medium"
    >
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-neutral-900">{title}</p>
        <p className="text-xs text-neutral-500">{subtitle}</p>
      </div>
      <ChevronRight
        className="size-4 shrink-0 text-neutral-400 transition group-hover:text-primary-600"
        aria-hidden
      />
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-neutral-200 bg-white"
          />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-20 animate-pulse rounded-2xl border border-neutral-200 bg-white" />
        <div className="h-20 animate-pulse rounded-2xl border border-neutral-200 bg-white" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-56 animate-pulse rounded-2xl border border-neutral-200 bg-white" />
        <div className="h-56 animate-pulse rounded-2xl border border-neutral-200 bg-white" />
      </div>
    </div>
  );
}
