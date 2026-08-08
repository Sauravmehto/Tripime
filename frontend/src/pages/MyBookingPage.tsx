import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { downloadInvoice, lookupBooking } from "../api/bookingApi";
import { getErrorMessage } from "../api/apiClient";
import { Layout } from "../components/Layout";
import { PageHeader } from "../components/ui/PageHeader";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Field, Input } from "../components/ui/Input";
import { BookingSummaryCard } from "../components/booking/BookingSummaryCard";
import { usePageTitle } from "../hooks/usePageTitle";
import { HELPLINE_DISPLAY, telLink, whatsappLink } from "../lib/contact";
import type { Booking } from "../types";

export function MyBookingPage() {
  usePageTitle(
    "My booking",
    "Look up your Tripime flight booking with your booking ID or PNR and contact details.",
  );
  const [reference, setReference] = useState("");
  const [contact, setContact] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const data = await lookupBooking(reference.trim(), contact.trim());
      setBooking(data);
    } catch (err) {
      setBooking(null);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!booking) return;
    setDownloading(true);
    try {
      await downloadInvoice(booking.bookingId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Layout narrow>
      <PageHeader
        title="Find my booking"
        subtitle="Enter your booking ID or PNR along with the email or phone you booked with."
      />

      <Card>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Booking ID or PNR">
            <Input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="BK-20260808-10001 or 7F3K2Q"
              required
            />
          </Field>
          <Field label="Email or phone used to book">
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="you@example.com or 98765 43210"
              required
            />
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
              <Search className="size-4" aria-hidden />
              {loading ? "Searching…" : "Find booking"}
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-6 rounded-2xl border border-danger-200 bg-danger-50 p-5 text-sm text-danger-700"
        >
          <p>{error}</p>
          <p className="mt-2 text-danger-600">
            Still stuck? Call or WhatsApp us at{" "}
            <a href={telLink()} className="font-semibold underline">
              {HELPLINE_DISPLAY}
            </a>{" "}
            and we'll pull it up for you.
          </p>
        </div>
      )}

      {!error && !booking && searched && !loading && (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 text-sm text-neutral-600">
          No booking found. Double check your reference and contact details.
        </div>
      )}

      {booking && (
        <div className="mt-6">
          <BookingSummaryCard
            booking={booking}
            footer={
              <>
                <Button size="lg" disabled={downloading} onClick={() => void handleDownload()}>
                  {downloading ? "Preparing PDF…" : "Download invoice"}
                </Button>
                <a
                  href={whatsappLink(`Hi Tripime, I need help with booking ${booking.bookingId}.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3.5 text-base font-semibold text-neutral-800 transition hover:bg-neutral-50"
                >
                  Message support on WhatsApp
                </a>
              </>
            }
          />
        </div>
      )}
    </Layout>
  );
}
