import { useState, type FormEvent } from "react";
import { CheckCircle2, X } from "lucide-react";
import { createEnquiry } from "../../api/enquiryApi";
import { getErrorMessage } from "../../api/apiClient";
import { Button } from "../ui/Button";
import { Field, Input, Select } from "../ui/Input";
import type { TravelPackage } from "../../types";

interface EnquiryModalProps {
  pkg: TravelPackage;
  onClose: () => void;
}

const TRAVEL_MONTHS = [
  "This month",
  "Next month",
  "In 2-3 months",
  "Later this year",
  "Not sure yet",
];

export function EnquiryModal({ pkg, onClose }: EnquiryModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [travelMonth, setTravelMonth] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createEnquiry({
        packageId: pkg.id,
        packageTitle: pkg.title,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        travelMonth: travelMonth || undefined,
        travelers: travelers ? Number(travelers) : undefined,
        message: message.trim() || undefined,
      });
      setDone(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="animate-overlay-in absolute inset-0 bg-neutral-900/50"
        onClick={onClose}
        aria-hidden
      />

      <div className="animate-sheet-up sm:animate-fade-up relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-elevated sm:max-w-md sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-neutral-900">
              {done ? "Enquiry sent!" : "Enquire about this package"}
            </h2>
            {!done && (
              <p className="mt-0.5 text-xs text-neutral-500">{pkg.title}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          {done ? (
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle2 className="size-12 text-success-500" aria-hidden />
              <p className="mt-4 font-semibold text-neutral-900">Thanks, {name.split(" ")[0]}!</p>
              <p className="mt-1.5 text-sm text-neutral-600">
                Our travel expert will call or WhatsApp you shortly to plan your trip to{" "}
                {pkg.destination}.
              </p>
              <Button className="mt-6 w-full" onClick={onClose}>
                Done
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Field label="Full name">
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone number">
                  <Input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile"
                  />
                </Field>
                <Field label="Email">
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Travel month">
                  <Select
                    value={travelMonth}
                    onChange={(e) => setTravelMonth(e.target.value)}
                  >
                    <option value="">Select…</option>
                    {TRAVEL_MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="No. of travellers">
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Message (optional)">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Any specific requirements or questions?"
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 shadow-soft outline-none transition placeholder:text-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
              </Field>

              {error && (
                <p
                  role="alert"
                  aria-live="assertive"
                  className="rounded-lg bg-danger-50 px-3 py-2 text-xs font-medium text-danger-700"
                >
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "Sending…" : "Send enquiry"}
              </Button>
              <p className="text-center text-[11px] text-neutral-400">
                We'll never share your details. Expect a call or WhatsApp within a few hours.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
