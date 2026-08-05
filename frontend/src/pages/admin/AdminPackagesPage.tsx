import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Eye,
  EyeOff,
  Package,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  createAdminPackage,
  deleteAdminPackage,
  listAdminPackages,
  updateAdminPackage,
} from "../../api/adminApi";
import { getErrorMessage } from "../../api/apiClient";
import { Button } from "../../components/ui/Button";
import { Badge, Card, Spinner } from "../../components/ui/Card";
import { Field, Input, Select } from "../../components/ui/Input";
import { clearAdminToken } from "../../lib/adminAuth";
import { formatINR } from "../../lib/format";
import type { PackageCategory, PackageInput, TravelPackage } from "../../types";

const CATEGORIES: { id: PackageCategory; label: string }[] = [
  { id: "domestic", label: "Domestic" },
  { id: "international", label: "International" },
  { id: "offer", label: "Offer" },
  { id: "upcoming_event", label: "Upcoming event" },
];

const CATEGORY_TONE: Record<
  PackageCategory,
  "primary" | "success" | "warning" | "neutral"
> = {
  domestic: "primary",
  international: "success",
  offer: "warning",
  upcoming_event: "neutral",
};

const EMPTY_FORM: PackageInput = {
  title: "",
  tagline: "",
  destination: "",
  category: "domestic",
  duration: "",
  stays: "",
  guests: "2 Adults",
  highlights: [],
  itinerary: [],
  price: 0,
  priceNote: "total package for 2 travelers",
  negotiable: true,
  imageUrl: "",
  pdfUrl: "",
  eventDate: null,
  featured: false,
  sortOrder: 0,
  active: true,
};

const compactInput = "h-10 text-sm";

function linesToList(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function listToLines(list: string[]): string {
  return list.join("\n");
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="col-span-full pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
      {children}
    </p>
  );
}

export function AdminPackagesPage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TravelPackage | null>(null);
  const [form, setForm] = useState<PackageInput>(EMPTY_FORM);
  const [highlightsText, setHighlightsText] = useState("");
  const [itineraryText, setItineraryText] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await listAdminPackages();
      setPackages(data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        clearAdminToken();
        navigate("/admin/login");
        return;
      }
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setHighlightsText("");
    setItineraryText("");
    setModalOpen(true);
  }

  function openEdit(pkg: TravelPackage) {
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = pkg;
    setEditing(pkg);
    setForm(rest);
    setHighlightsText(listToLines(pkg.highlights));
    setItineraryText(listToLines(pkg.itinerary));
    setModalOpen(true);
  }

  function patchForm(patch: Partial<PackageInput>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload: PackageInput = {
      ...form,
      highlights: linesToList(highlightsText),
      itinerary: linesToList(itineraryText),
      eventDate: form.eventDate?.trim() || null,
      price: Number(form.price) || 0,
      sortOrder: Number(form.sortOrder) || 0,
    };

    if (payload.category === "upcoming_event" && !payload.eventDate) {
      await Swal.fire({
        title: "Event date required",
        text: "Upcoming event packages need an event date.",
        icon: "warning",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        const updated = await updateAdminPackage(editing.id, payload);
        setPackages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await createAdminPackage(payload);
        setPackages((prev) => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder));
      }
      setModalOpen(false);
      await Swal.fire({
        title: editing ? "Package updated" : "Package created",
        icon: "success",
        confirmButtonColor: "#2563eb",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        clearAdminToken();
        navigate("/admin/login");
        return;
      }
      await Swal.fire({
        title: "Save failed",
        text: getErrorMessage(err),
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(pkg: TravelPackage) {
    const result = await Swal.fire({
      title: "Delete this package?",
      text: pkg.title,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;
    try {
      await deleteAdminPackage(pkg.id);
      setPackages((prev) => prev.filter((p) => p.id !== pkg.id));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        clearAdminToken();
        navigate("/admin/login");
        return;
      }
      await Swal.fire({
        title: "Delete failed",
        text: getErrorMessage(err),
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  }

  async function toggleActive(pkg: TravelPackage) {
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = pkg;
    try {
      const updated = await updateAdminPackage(pkg.id, { ...rest, active: !pkg.active });
      setPackages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        clearAdminToken();
        navigate("/admin/login");
        return;
      }
      setError(getErrorMessage(err));
    }
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex size-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <Package className="size-4" aria-hidden />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
              Packages
            </h1>
            <p className="mt-0.5 text-sm text-neutral-600">
              Manage holiday packages shown on /packages.
            </p>
          </div>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-4" aria-hidden />
          Add package
        </Button>
      </div>

      {loading && (
        <Card>
          <Spinner label="Loading packages…" />
        </Card>
      )}
      {error && (
        <div className="mb-4 rounded-xl border border-danger-200 bg-danger-50 p-3 text-sm text-danger-700">
          {error}
        </div>
      )}

      {!loading && (
        <Card padded={false} className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-[11px] uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Package</th>
                <th className="px-3 py-2.5 font-semibold">Category</th>
                <th className="px-3 py-2.5 font-semibold">Price</th>
                <th className="px-3 py-2.5 font-semibold">Sort</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-sm text-neutral-500">
                    No packages yet. Add your first package.
                  </td>
                </tr>
              )}
              {packages.map((pkg) => (
                <tr
                  key={pkg.id}
                  className="border-b border-neutral-100 transition hover:bg-neutral-50/80 last:border-0"
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      {pkg.imageUrl ? (
                        <img
                          src={pkg.imageUrl}
                          alt=""
                          className="size-8 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
                          <Package className="size-3.5" aria-hidden />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-neutral-900">
                          {pkg.title}
                        </p>
                        <p className="truncate text-xs text-neutral-500">{pkg.destination}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge tone={CATEGORY_TONE[pkg.category]}>
                      {pkg.category.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-3 py-2.5 text-sm font-medium text-neutral-800">
                    {formatINR(pkg.price)}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-neutral-600">{pkg.sortOrder}</td>
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => void toggleActive(pkg)}
                      className="inline-flex items-center gap-1"
                      title={pkg.active ? "Hide package" : "Show package"}
                    >
                      <Badge tone={pkg.active ? "success" : "neutral"}>
                        {pkg.active ? (
                          <span className="inline-flex items-center gap-1">
                            <Eye className="size-3" aria-hidden /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <EyeOff className="size-3" aria-hidden /> Hidden
                          </span>
                        )}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        aria-label={`Edit ${pkg.title}`}
                        onClick={() => openEdit(pkg)}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-primary-50 hover:text-primary-700"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${pkg.title}`}
                        onClick={() => void handleDelete(pkg)}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-danger-50 hover:text-danger-700"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-neutral-900/50 p-3 sm:p-6">
          <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-elevated">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white px-4 py-3">
              <h2 className="text-base font-bold text-neutral-900">
                {editing ? "Edit package" : "Add package"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="inline-flex size-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
              <div className="max-h-[min(80vh,720px)] space-y-2.5 overflow-y-auto p-4">
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <SectionLabel>Basics</SectionLabel>
                  <Field dense label="Title" className="sm:col-span-2">
                    <Input
                      required
                      className={compactInput}
                      value={form.title}
                      onChange={(e) => patchForm({ title: e.target.value })}
                    />
                  </Field>
                  <Field dense label="Tagline" className="sm:col-span-2">
                    <Input
                      className={compactInput}
                      value={form.tagline}
                      onChange={(e) => patchForm({ tagline: e.target.value })}
                    />
                  </Field>
                  <Field dense label="Destination">
                    <Input
                      required
                      className={compactInput}
                      value={form.destination}
                      onChange={(e) => patchForm({ destination: e.target.value })}
                    />
                  </Field>
                  <Field dense label="Category">
                    <Select
                      className={compactInput}
                      value={form.category}
                      onChange={(e) =>
                        patchForm({ category: e.target.value as PackageCategory })
                      }
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field dense label="Duration">
                    <Input
                      required
                      className={compactInput}
                      placeholder="5N / 6D"
                      value={form.duration}
                      onChange={(e) => patchForm({ duration: e.target.value })}
                    />
                  </Field>
                  <Field dense label="Stays">
                    <Input
                      className={compactInput}
                      value={form.stays}
                      onChange={(e) => patchForm({ stays: e.target.value })}
                    />
                  </Field>
                  <Field dense label="Guests">
                    <Input
                      className={compactInput}
                      value={form.guests}
                      onChange={(e) => patchForm({ guests: e.target.value })}
                    />
                  </Field>
                  <Field dense label="Price (INR)">
                    <Input
                      type="number"
                      min={0}
                      required
                      className={compactInput}
                      value={form.price}
                      onChange={(e) => patchForm({ price: Number(e.target.value) })}
                    />
                  </Field>
                  <Field dense label="Price note" className="sm:col-span-2">
                    <Input
                      className={compactInput}
                      value={form.priceNote}
                      onChange={(e) => patchForm({ priceNote: e.target.value })}
                    />
                  </Field>
                  <Field dense label="Sort order">
                    <Input
                      type="number"
                      min={0}
                      className={compactInput}
                      value={form.sortOrder}
                      onChange={(e) => patchForm({ sortOrder: Number(e.target.value) })}
                    />
                  </Field>
                  <Field dense label="Event date">
                    <Input
                      type="date"
                      className={compactInput}
                      value={form.eventDate ?? ""}
                      onChange={(e) =>
                        patchForm({ eventDate: e.target.value || null })
                      }
                    />
                  </Field>

                  <SectionLabel>Media</SectionLabel>
                  <Field dense label="Image URL" className="sm:col-span-2">
                    <Input
                      className={compactInput}
                      value={form.imageUrl}
                      onChange={(e) => patchForm({ imageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </Field>
                  <Field dense label="PDF URL" className="sm:col-span-2">
                    <Input
                      className={compactInput}
                      value={form.pdfUrl}
                      onChange={(e) => patchForm({ pdfUrl: e.target.value })}
                      placeholder="https://.../itinerary.pdf"
                    />
                  </Field>

                  <SectionLabel>Content</SectionLabel>
                  <Field dense label="Highlights (one per line)" className="sm:col-span-2">
                    <textarea
                      className="min-h-[64px] w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-soft outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      value={highlightsText}
                      onChange={(e) => setHighlightsText(e.target.value)}
                    />
                  </Field>
                  <Field dense label="Itinerary (one day per line)" className="sm:col-span-2">
                    <textarea
                      className="min-h-[96px] w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-soft outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      value={itineraryText}
                      onChange={(e) => setItineraryText(e.target.value)}
                    />
                  </Field>

                  <SectionLabel>Flags</SectionLabel>
                  <div className="col-span-full flex flex-wrap gap-x-4 gap-y-2">
                    <label className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700">
                      <input
                        type="checkbox"
                        checked={form.negotiable}
                        onChange={(e) => patchForm({ negotiable: e.target.checked })}
                        className="size-3.5 rounded border-neutral-300 text-primary-600"
                      />
                      Negotiable
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => patchForm({ featured: e.target.checked })}
                        className="size-3.5 rounded border-neutral-300 text-primary-600"
                      />
                      Featured
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700">
                      <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) => patchForm({ active: e.target.checked })}
                        className="size-3.5 rounded border-neutral-300 text-primary-600"
                      />
                      Active on site
                    </label>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 flex justify-end gap-2 border-t border-neutral-100 bg-white px-4 py-3">
                <Button type="button" size="sm" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={saving}>
                  {saving ? "Saving…" : editing ? "Save changes" : "Create package"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
