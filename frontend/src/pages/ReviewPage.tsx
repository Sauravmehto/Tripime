import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FlightCard } from "../components/FlightCard";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { Card, PriceDisplay } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Stepper } from "../components/ui/Stepper";
import { useBooking } from "../context/BookingContext";
import { formatDate, formatDuration, formatINR } from "../lib/format";

export function ReviewPage() {
  const navigate = useNavigate();
  const { search, selectedFlight, passengers, contact } = useBooking();

  useEffect(() => {
    if (!selectedFlight || !search || passengers.length === 0 || !contact.email) {
      navigate("/");
    }
  }, [selectedFlight, search, passengers, contact, navigate]);

  if (!selectedFlight || !search) return null;

  const count = passengers.length;
  const baseFare = selectedFlight.fare.baseFare * count;
  const taxes = selectedFlight.fare.taxes * count;
  const total = selectedFlight.fare.totalFare * count;

  async function handleConfirmContinue() {
    if (!selectedFlight) return;

    const result = await Swal.fire({
      title: "Confirm flight details?",
      html: `
        <div style="text-align:left;font-size:14px;line-height:1.6;color:#334155;font-family:Inter,system-ui,sans-serif">
          <p><strong>Route:</strong> ${selectedFlight.origin.city} (${selectedFlight.origin.code}) → ${selectedFlight.destination.city} (${selectedFlight.destination.code})</p>
          <p><strong>Travel date:</strong> ${formatDate(selectedFlight.departureDate)}</p>
          <p><strong>Airline:</strong> ${selectedFlight.airline.name}</p>
          <p><strong>Flight:</strong> ${selectedFlight.flightNumber}</p>
          <p><strong>Total fare:</strong> ${formatINR(total)}</p>
          <p style="margin-top:12px;color:#64748b">Please verify your flight and passenger details before continuing to seat selection.</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, continue",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#94a3b8",
      reverseButtons: true,
      allowOutsideClick: false,
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Preparing your booking…",
      html: "Please wait while we prepare your seat selection.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await new Promise((resolve) => window.setTimeout(resolve, 900));
    Swal.close();
    navigate("/booking/seats");
  }

  return (
    <Layout>
      <Stepper current="review" />
      <PageHeader
        onBack={() => navigate("/booking/passengers")}
        backLabel="Back to passengers"
        title="Review booking"
        subtitle="Confirm your trip details, then continue to seat selection. No booking is created yet."
      />

      <div className="mb-6">
        <FlightCard flight={selectedFlight} showSelect={false} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card>
            <h2 className="mb-3 font-semibold text-neutral-900">Trip summary</h2>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li>
                <span className="text-neutral-500">Airline:</span> {selectedFlight.airline.name}
              </li>
              <li>
                <span className="text-neutral-500">Flight:</span> {selectedFlight.flightNumber}
              </li>
              <li>
                <span className="text-neutral-500">Route:</span> {selectedFlight.origin.city} →{" "}
                {selectedFlight.destination.city}
              </li>
              <li>
                <span className="text-neutral-500">Travel date:</span>{" "}
                {formatDate(selectedFlight.departureDate)}
              </li>
              <li>
                <span className="text-neutral-500">Time:</span> {selectedFlight.departureTime} –{" "}
                {selectedFlight.arrivalTime}
              </li>
              <li>
                <span className="text-neutral-500">Duration:</span>{" "}
                {formatDuration(selectedFlight.durationMinutes)}
              </li>
              <li>
                <span className="text-neutral-500">Baggage:</span> Cabin {selectedFlight.baggage.cabin}{" "}
                · Check-in {selectedFlight.baggage.checkIn}
              </li>
              <li>
                <span className="text-neutral-500">Fare type:</span>{" "}
                {selectedFlight.refundable ? "Refundable" : "Non-refundable"}
              </li>
            </ul>
          </Card>

          <Card>
            <h2 className="mb-3 font-semibold text-neutral-900">Passengers</h2>
            <ul className="space-y-1 text-sm text-neutral-700">
              {passengers.map((p, i) => (
                <li key={i}>
                  {p.title} {p.firstName} {p.lastName}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-neutral-500">
              Contact: {contact.email} · {contact.phone}
            </p>
          </Card>

          <Button
            size="lg"
            className="hidden w-full sm:w-auto lg:inline-flex"
            onClick={() => void handleConfirmContinue()}
          >
            Confirm &amp; continue
          </Button>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <h2 className="mb-3 font-semibold text-neutral-900">Fare breakdown</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between text-neutral-700">
              <dt>Base fare × {count}</dt>
              <dd>{formatINR(baseFare)}</dd>
            </div>
            <div className="flex justify-between text-neutral-700">
              <dt>Taxes × {count}</dt>
              <dd>{formatINR(taxes)}</dd>
            </div>
            <div className="flex justify-between border-t border-neutral-100 pt-2 text-base font-bold">
              <dt>Total</dt>
              <dd>
                <PriceDisplay amount={formatINR(total)} className="text-lg" />
              </dd>
            </div>
          </dl>
          <Button
            size="lg"
            className="mt-5 w-full lg:hidden"
            onClick={() => void handleConfirmContinue()}
          >
            Confirm &amp; continue
          </Button>
        </Card>
      </div>
    </Layout>
  );
}
