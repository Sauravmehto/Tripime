import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { downloadInvoice, getBooking } from "../api/bookingApi";
import { getErrorMessage } from "../api/apiClient";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { BookingSummaryCard } from "../components/booking/BookingSummaryCard";
import { useBooking } from "../context/BookingContext";
import { usePageTitle } from "../hooks/usePageTitle";
import type { Booking } from "../types";

export function ConfirmationPage() {
  usePageTitle("Booking confirmed", "Your Tripime flight booking confirmation and e-ticket download.");
  const { bookingId } = useParams();
  const { reset } = useBooking();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!bookingId) return;
      setLoading(true);
      try {
        const data = await getBooking(bookingId);
        if (!cancelled) {
          setBooking(data);
          reset();
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [bookingId, reset]);

  async function handleDownload() {
    if (!bookingId) return;
    setDownloading(true);
    setError("");
    try {
      await downloadInvoice(bookingId);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Layout>
      {loading && (
        <div className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-8 shadow-soft">
          <div className="h-4 w-40 rounded bg-neutral-200" />
          <div className="mt-4 h-8 w-64 rounded bg-neutral-200" />
          <div className="mt-6 h-32 rounded bg-neutral-100" />
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-danger-200 bg-danger-50 p-4 text-danger-700">
          {error}
        </div>
      )}
      {booking && (
        <BookingSummaryCard
          booking={booking}
          footer={
            <>
              <Button size="lg" disabled={downloading} onClick={() => void handleDownload()}>
                {downloading ? "Preparing PDF…" : "Download invoice"}
              </Button>
              <Link
                to="/my-booking"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3.5 text-base font-semibold text-neutral-800 transition hover:bg-neutral-50"
              >
                Find this booking later
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-base font-semibold text-neutral-600 transition hover:bg-neutral-50"
              >
                Back to home
              </Link>
            </>
          }
        />
      )}
    </Layout>
  );
}
