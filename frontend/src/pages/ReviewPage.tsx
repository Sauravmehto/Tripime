import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Pencil, Phone, UserRound } from "lucide-react";
import { FareSummaryCard } from "../components/flights/FareSummaryCard";
import { FlightItineraryCard } from "../components/flights/FlightItineraryCard";
import { FlightRouteBar } from "../components/flights/FlightRouteBar";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Stepper } from "../components/ui/Stepper";
import { StickyActionBar } from "../components/ui/StickyActionBar";
import { useBooking } from "../context/BookingContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatINR } from "../lib/format";

export function ReviewPage() {
  usePageTitle("Review booking", "Review your flight and traveller details before choosing seats.");
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
  const backToResults = `/flights?origin=${search.origin}&destination=${search.destination}&date=${search.date}&passengers=${search.passengers}`;

  function handleConfirmContinue() {
    // This page is already the confirmation step — no second modal.
    navigate("/booking/seats");
  }

  return (
    <Layout>
      <div className="pb-24 lg:pb-0">
        <Stepper current="review" />

        <FlightRouteBar
          flight={selectedFlight}
          passengers={count}
          changeFlightTo={backToResults}
          className="mb-4"
        />

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="space-y-4">
            <FlightItineraryCard flight={selectedFlight} />

            <Card padded={false} className="p-4 sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <UserRound className="size-4" aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-neutral-900">Travellers</h2>
                    <p className="text-xs text-neutral-500">
                      {count} {count === 1 ? "adult" : "adults"} on this booking
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/booking/passengers")}
                >
                  <Pencil className="size-3.5" aria-hidden />
                  Edit
                </Button>
              </div>

              <ul className="divide-y divide-neutral-100 rounded-xl border border-neutral-200">
                {passengers.map((passenger, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm"
                  >
                    <span className="font-medium text-neutral-900">
                      {passenger.title} {passenger.firstName} {passenger.lastName}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {passenger.gender} · {passenger.dateOfBirth}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                  <Mail className="size-3.5 text-neutral-400" aria-hidden />
                  <span className="truncate">{contact.email}</span>
                </p>
                <p className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                  <Phone className="size-3.5 text-neutral-400" aria-hidden />
                  <span className="truncate">{contact.phone}</span>
                </p>
              </div>
            </Card>
          </div>

          <FareSummaryCard
            rows={[
              {
                label: "Base fare",
                hint: `${count} traveller${count > 1 ? "s" : ""}`,
                amount: baseFare,
              },
              { label: "Taxes and fees", amount: taxes },
            ]}
            total={total}
            note="No booking is created until payment is completed."
          >
            <Button
              size="lg"
              variant="coral"
              className="hidden w-full lg:inline-flex"
              onClick={handleConfirmContinue}
            >
              Confirm &amp; continue
            </Button>
          </FareSummaryCard>
        </div>
      </div>

      <StickyActionBar
        total={formatINR(total)}
        ctaLabel="Confirm & continue"
        onClick={handleConfirmContinue}
      />
    </Layout>
  );
}
