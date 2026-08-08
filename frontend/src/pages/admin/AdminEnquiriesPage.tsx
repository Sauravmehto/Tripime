import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { listAdminEnquiries, updateAdminEnquiryStatus } from "../../api/adminApi";
import { getErrorMessage } from "../../api/apiClient";
import { Badge, Card, Spinner } from "../../components/ui/Card";
import { clearAdminToken } from "../../lib/adminAuth";
import type { Enquiry, EnquiryStatus } from "../../types";

const STATUS_TONE: Record<EnquiryStatus, "warning" | "primary" | "success"> = {
  NEW: "warning",
  CONTACTED: "primary",
  CLOSED: "success",
};

const STATUS_OPTIONS: EnquiryStatus[] = ["NEW", "CONTACTED", "CLOSED"];

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function AdminEnquiriesPage() {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await listAdminEnquiries();
        if (!cancelled) setEnquiries(data);
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

  async function handleStatusChange(enquiry: Enquiry, status: EnquiryStatus) {
    setUpdatingId(enquiry.id);
    try {
      const updated = await updateAdminEnquiryStatus(enquiry.id, status);
      setEnquiries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        clearAdminToken();
        navigate("/admin/login");
        return;
      }
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  }

  const newCount = enquiries.filter((e) => e.status === "NEW").length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Enquiries</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Package (and general) enquiries submitted from the website.
          </p>
        </div>
        {newCount > 0 && <Badge tone="warning">{newCount} new</Badge>}
      </div>

      {loading && (
        <div className="mt-8">
          <Spinner label="Loading enquiries…" />
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-danger-200 bg-danger-50 p-4 text-danger-700">
          {error}
        </div>
      )}

      {!loading && !error && enquiries.length === 0 && (
        <Card className="mt-6 text-center text-sm text-neutral-500">No enquiries yet.</Card>
      )}

      {enquiries.length > 0 && (
        <div className="mt-4 grid gap-3">
          {enquiries.map((enquiry) => (
            <Card key={enquiry.id} className="!p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-xs font-semibold text-primary-700">
                      {enquiry.id}
                    </p>
                    <Badge tone={STATUS_TONE[enquiry.status]}>{enquiry.status}</Badge>
                  </div>
                  <p className="mt-1 font-semibold text-neutral-900">
                    {enquiry.name}
                    {enquiry.packageTitle && (
                      <span className="font-normal text-neutral-500">
                        {" "}
                        · interested in {enquiry.packageTitle}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-sm text-neutral-600">
                    {enquiry.email} · {enquiry.phone}
                  </p>
                  {(enquiry.travelMonth || enquiry.travelers) && (
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {enquiry.travelMonth && `Travel month: ${enquiry.travelMonth}`}
                      {enquiry.travelMonth && enquiry.travelers ? " · " : ""}
                      {enquiry.travelers && `${enquiry.travelers} traveller(s)`}
                    </p>
                  )}
                  {enquiry.message && (
                    <p className="mt-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                      {enquiry.message}
                    </p>
                  )}
                  <p className="mt-2 text-[11px] text-neutral-400">
                    Received {formatWhen(enquiry.createdAt)}
                  </p>
                </div>

                <select
                  value={enquiry.status}
                  disabled={updatingId === enquiry.id}
                  onChange={(e) =>
                    void handleStatusChange(enquiry, e.target.value as EnquiryStatus)
                  }
                  className="h-9 shrink-0 rounded-lg border border-neutral-300 bg-white px-2 text-xs font-semibold text-neutral-700 disabled:opacity-60"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
