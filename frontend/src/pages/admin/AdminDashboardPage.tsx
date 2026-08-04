import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAdminStats } from "../../api/adminApi";
import { getErrorMessage } from "../../api/apiClient";
import { Card, Spinner } from "../../components/ui/Card";
import { clearAdminToken } from "../../lib/adminAuth";
import { formatINR } from "../../lib/format";
import type { AdminStats } from "../../types";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await getAdminStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          clearAdminToken();
          navigate("/admin/login");
          return;
        }
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-600">Overview of all flight bookings.</p>

      {loading && (
        <div className="mt-8">
          <Spinner label="Loading stats…" />
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-danger-200 bg-danger-50 p-4 text-danger-700">
          {error}
        </div>
      )}

      {stats && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total bookings" value={stats.totalBookings.toString()} />
          <StatCard label="Pending confirmation" value={stats.pendingBookings.toString()} />
          <StatCard label="Confirmed" value={stats.confirmedBookings.toString()} />
          <StatCard label="Bookings today" value={stats.bookingsToday.toString()} />
          <StatCard label="Total revenue" value={formatINR(stats.totalRevenue)} />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-neutral-900">{value}</p>
    </Card>
  );
}
