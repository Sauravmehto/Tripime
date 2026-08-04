import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlightCard } from "../components/FlightCard";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field, Input, Select } from "../components/ui/Input";
import { useBooking } from "../context/BookingContext";
import { emptyPassenger } from "../lib/format";
import type { PassengerForm } from "../types";

export function PassengersPage() {
  const navigate = useNavigate();
  const { search, selectedFlight, setPassengers, setContact, contact } = useBooking();
  const count = search?.passengers ?? 1;

  const [forms, setForms] = useState<PassengerForm[]>(() =>
    Array.from({ length: count }, () => emptyPassenger()),
  );
  const [email, setEmail] = useState(contact.email);
  const [phone, setPhone] = useState(contact.phone);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedFlight || !search) {
      navigate("/");
    }
  }, [selectedFlight, search, navigate]);

  useEffect(() => {
    setForms(Array.from({ length: count }, (_, i) => forms[i] ?? emptyPassenger()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  function updatePassenger(index: number, patch: Partial<PassengerForm>) {
    setForms((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    for (const [i, p] of forms.entries()) {
      if (!p.firstName.trim() || !p.lastName.trim() || !p.dateOfBirth) {
        setError(`Please complete all fields for passenger ${i + 1}.`);
        return;
      }
    }
    if (!email.trim() || !phone.trim()) {
      setError("Please enter contact email and phone.");
      return;
    }
    setPassengers(forms);
    setContact({ email: email.trim(), phone: phone.trim() });
    navigate("/booking/review");
  }

  if (!selectedFlight) return null;

  return (
    <Layout>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-sm font-medium text-primary-700 hover:text-primary-800"
      >
        ← Back to results
      </button>
      <h1 className="mt-2 mb-2 text-2xl font-bold text-neutral-900 sm:text-3xl">
        Passenger details
      </h1>
      <p className="mb-6 text-sm text-neutral-600">
        Enter traveller information exactly as on ID documents.
      </p>

      <div className="mb-6">
        <FlightCard flight={selectedFlight} showSelect={false} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {forms.map((passenger, index) => (
          <Card key={index}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Passenger {index + 1}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Title">
                <Select
                  value={passenger.title}
                  onChange={(e) => updatePassenger(index, { title: e.target.value })}
                >
                  {["Mr", "Mrs", "Ms", "Miss", "Dr"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Gender">
                <Select
                  value={passenger.gender}
                  onChange={(e) => updatePassenger(index, { gender: e.target.value })}
                >
                  {["Male", "Female", "Other"].map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </Select>
              </Field>
              <Field label="First name">
                <Input
                  value={passenger.firstName}
                  onChange={(e) => updatePassenger(index, { firstName: e.target.value })}
                  required
                />
              </Field>
              <Field label="Last name">
                <Input
                  value={passenger.lastName}
                  onChange={(e) => updatePassenger(index, { lastName: e.target.value })}
                  required
                />
              </Field>
              <Field label="Date of birth" className="sm:col-span-2">
                <Input
                  type="date"
                  max="2026-08-04"
                  value={passenger.dateOfBirth}
                  onChange={(e) => updatePassenger(index, { dateOfBirth: e.target.value })}
                  required
                />
              </Field>
            </div>
          </Card>
        ))}

        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Contact
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field label="Phone">
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Field>
          </div>
        </Card>

        {error && <p className="text-sm text-danger-600">{error}</p>}

        <Button type="submit" size="lg">
          Continue to review
        </Button>
      </form>
    </Layout>
  );
}
