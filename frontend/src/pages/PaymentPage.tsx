import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookingApi";
import { getErrorMessage } from "../api/apiClient";
import { processMockPayment } from "../api/paymentApi";
import { FareSummaryCard } from "../components/flights/FareSummaryCard";
import { FlightRouteBar } from "../components/flights/FlightRouteBar";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field, Input } from "../components/ui/Input";
import { Stepper } from "../components/ui/Stepper";
import { StickyActionBar } from "../components/ui/StickyActionBar";
import { useBooking } from "../context/BookingContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatINR } from "../lib/format";
import type { PaymentMethod } from "../types";

type Tab = PaymentMethod;

const PAYMENT_TABS: { id: Tab; label: string }[] = [
  { id: "upi", label: "UPI" },
  { id: "qr", label: "QR Code" },
  { id: "card", label: "Card" },
];

const UPI_PROVIDERS = [
  { id: "gpay", label: "Google Pay", initial: "G" },
  { id: "phonepe", label: "PhonePe", initial: "P" },
  { id: "paytm", label: "Paytm", initial: "₹" },
  { id: "other", label: "Other UPI", initial: "U" },
];

export function PaymentPage() {
  usePageTitle("Payment", "Complete payment for your Tripime flight booking securely.");
  const navigate = useNavigate();
  const {
    selectedFlight,
    passengers,
    contact,
    selectedSeats,
    seatCharges,
    setPayment,
  } = useBooking();

  const [tab, setTab] = useState<Tab>("upi");
  const [upiProvider, setUpiProvider] = useState("gpay");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [qrCompleted, setQrCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedFlight || passengers.length === 0 || selectedSeats.length !== passengers.length) {
      navigate("/booking/seats");
    }
  }, [selectedFlight, passengers, selectedSeats, navigate]);

  const flightFare = useMemo(() => {
    if (!selectedFlight) return 0;
    return selectedFlight.fare.totalFare * passengers.length;
  }, [selectedFlight, passengers.length]);

  const baseFare = selectedFlight ? selectedFlight.fare.baseFare * passengers.length : 0;
  const taxes = selectedFlight ? selectedFlight.fare.taxes * passengers.length : 0;
  const totalPayable = flightFare + seatCharges;

  if (!selectedFlight) return null;

  function validate(): string | null {
    if (tab === "upi") {
      if (!upiId.trim() || !upiId.includes("@")) {
        return "Enter a valid UPI ID (e.g. name@upi).";
      }
    }
    if (tab === "qr" && !qrCompleted) {
      return "Confirm that you have completed the test QR payment.";
    }
    if (tab === "card") {
      const digits = cardNumber.replace(/\s/g, "");
      if (digits.length < 12 || digits.length > 19 || !/^\d+$/.test(digits)) {
        return "Enter a valid card number.";
      }
      if (!cardName.trim()) return "Enter the cardholder name.";
      if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Expiry must be MM/YY.";
      if (!/^\d{3,4}$/.test(cvv)) return "Enter a valid CVV.";
    }
    return null;
  }

  async function handlePay() {
    if (submitting || !selectedFlight) return;
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const digits = cardNumber.replace(/\s/g, "");
      const payment = await processMockPayment({
        amount: totalPayable,
        currency: "INR",
        method: tab,
        upiId: tab === "upi" ? upiId.trim() : undefined,
        // Never send full card number or CVV
        cardLast4: tab === "card" ? digits.slice(-4) : undefined,
      });

      setPayment(payment);

      const booking = await createBooking({
        flightId: selectedFlight.id,
        passengers,
        contact,
        seats: selectedSeats,
        payment,
      });

      // Clear sensitive card fields from memory
      setCardNumber("");
      setCvv("");

      navigate(`/booking/confirmation/${booking.bookingId}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="pb-24 lg:pb-0">
        <Stepper current="payment" />

        <FlightRouteBar
          flight={selectedFlight}
          passengers={passengers.length}
          className="mb-4"
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <Card>
            <div className="mb-4">
              <h1 className="text-lg font-bold text-neutral-900">Payment options</h1>
              <p className="text-xs text-neutral-500">
                Mock checkout — no real money will be charged.
              </p>
            </div>
            <div
              role="tablist"
              aria-label="Payment method"
              className="mb-5 inline-flex w-full flex-wrap gap-1 rounded-2xl bg-neutral-100 p-1 sm:w-auto"
            >
              {PAYMENT_TABS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => {
                    setTab(id);
                    setError("");
                  }}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
                    tab === id
                      ? "bg-white text-primary-700 shadow-soft"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === "upi" && (
              <div className="space-y-4" role="tabpanel">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {UPI_PROVIDERS.map(({ id, label, initial }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setUpiProvider(id)}
                      className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition ${
                        upiProvider === id
                          ? "border-primary-500 bg-primary-50 text-primary-800 ring-2 ring-primary-100"
                          : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      <span
                        className={`flex size-9 items-center justify-center rounded-full text-sm font-bold ${
                          upiProvider === id
                            ? "bg-primary-600 text-white"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {initial}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
                <Field label="UPI ID">
                  <Input
                    placeholder="name@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </Field>
              </div>
            )}

            {tab === "qr" && (
              <div className="space-y-4 text-center" role="tabpanel">
                <div className="mx-auto flex size-48 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50">
                  <div className="grid grid-cols-5 gap-1 p-4 opacity-70">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <span
                        key={i}
                        className={`size-4 rounded-sm ${i % 3 === 0 ? "bg-neutral-800" : "bg-neutral-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="rounded-xl bg-warning-50 px-4 py-3 text-sm font-medium text-warning-600">
                  Test payment — no real money will be charged.
                </p>
                <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={qrCompleted}
                    onChange={(e) => setQrCompleted(e.target.checked)}
                    className="size-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  I have completed payment
                </label>
              </div>
            )}

            {tab === "card" && (
              <div className="grid gap-3 sm:grid-cols-2" role="tabpanel">
                <Field label="Card number" className="sm:col-span-2">
                  <Input
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4111 1111 1111 1111"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </Field>
                <Field label="Cardholder name" className="sm:col-span-2">
                  <Input
                    autoComplete="cc-name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </Field>
                <Field label="Expiry (MM/YY)">
                  <Input
                    placeholder="08/28"
                    autoComplete="cc-exp"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </Field>
                <Field label="CVV">
                  <Input
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    type="password"
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </Field>
                <p className="text-xs text-neutral-500 sm:col-span-2">
                  Card number and CVV are used for validation only and are never sent to or stored
                  by the server.
                </p>
              </div>
            )}

            {error && (
              <p role="alert" className="mt-4 text-sm text-danger-600">
                {error}
              </p>
            )}

          </Card>

          <FareSummaryCard
            title="Payment summary"
            rows={[
              {
                label: "Base fare",
                hint: `${passengers.length} traveller${passengers.length > 1 ? "s" : ""}`,
                amount: baseFare,
              },
              { label: "Taxes and fees", amount: taxes },
              {
                label: "Seat charges",
                hint: selectedSeats.map((seat) => seat.seatNumber).join(", ") || undefined,
                amount: seatCharges,
              },
            ]}
            total={totalPayable}
            totalLabel="Total payable"
            note="Mock payment gateway — your card details are never stored."
          >
            <Button
              className="hidden w-full lg:inline-flex"
              size="lg"
              variant="coral"
              disabled={submitting}
              onClick={() => void handlePay()}
            >
              {submitting ? "Processing payment…" : `Pay ${formatINR(totalPayable)}`}
            </Button>
          </FareSummaryCard>
        </div>
      </div>

      <StickyActionBar
        total={formatINR(totalPayable)}
        ctaLabel={`Pay ${formatINR(totalPayable)}`}
        loading={submitting}
        onClick={() => void handlePay()}
      />
    </Layout>
  );
}
