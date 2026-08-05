import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlightCard } from "../components/FlightCard";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Field, Input, Select } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";
import { Stepper } from "../components/ui/Stepper";
import { useBooking } from "../context/BookingContext";
import { emptyPassenger } from "../lib/format";
import type { PassengerForm } from "../types";

type FieldErrors = Record<string, string>;

export function PassengersPage() {
  const navigate = useNavigate();
  const { search, selectedFlight, setPassengers, setContact, contact } = useBooking();
  const count = search?.passengers ?? 1;

  const [forms, setForms] = useState<PassengerForm[]>(() =>
    Array.from({ length: count }, () => emptyPassenger()),
  );
  const [email, setEmail] = useState(contact.email);
  const [phone, setPhone] = useState(contact.phone);
  const [errors, setErrors] = useState<FieldErrors>({});

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
    const keys = Object.keys(patch);
    if (keys.length) {
      setErrors((prev) => {
        const next = { ...prev };
        for (const k of keys) delete next[`p${index}.${k}`];
        return next;
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: FieldErrors = {};

    for (const [i, p] of forms.entries()) {
      if (!p.firstName.trim()) next[`p${i}.firstName`] = "Required";
      if (!p.lastName.trim()) next[`p${i}.lastName`] = "Required";
      if (!p.dateOfBirth) next[`p${i}.dateOfBirth`] = "Required";
    }
    if (!email.trim()) next.email = "Required";
    if (!phone.trim()) next.phone = "Required";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPassengers(forms);
    setContact({ email: email.trim(), phone: phone.trim() });
    navigate("/booking/review");
  }

  if (!selectedFlight) return null;

  function fieldError(key: string) {
    return errors[key] ? (
      <p className="mt-1 text-xs text-danger-600">{errors[key]}</p>
    ) : null;
  }

  function inputErrorClass(key: string) {
    return errors[key] ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20" : "";
  }

  return (
    <Layout>
      <Stepper current="passengers" />
      <PageHeader
        onBack={() => navigate(-1)}
        backLabel="Back to results"
        title="Passenger details"
        subtitle="Enter traveller information exactly as on ID documents."
      />

      <div className="mb-6">
        <FlightCard flight={selectedFlight} showSelect={false} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {forms.map((passenger, index) => (
          <Card key={index}>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                {index + 1}
              </span>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Passenger {index + 1}
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              <Field label="First name" className="lg:col-span-1">
                <Input
                  value={passenger.firstName}
                  onChange={(e) => updatePassenger(index, { firstName: e.target.value })}
                  className={inputErrorClass(`p${index}.firstName`)}
                  required
                />
                {fieldError(`p${index}.firstName`)}
              </Field>
              <Field label="Last name">
                <Input
                  value={passenger.lastName}
                  onChange={(e) => updatePassenger(index, { lastName: e.target.value })}
                  className={inputErrorClass(`p${index}.lastName`)}
                  required
                />
                {fieldError(`p${index}.lastName`)}
              </Field>
              <Field label="Date of birth" className="sm:col-span-2 lg:col-span-4">
                <Input
                  type="date"
                  max="2026-08-04"
                  value={passenger.dateOfBirth}
                  onChange={(e) => updatePassenger(index, { dateOfBirth: e.target.value })}
                  className={inputErrorClass(`p${index}.dateOfBirth`)}
                  required
                />
                {fieldError(`p${index}.dateOfBirth`)}
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.email;
                    return next;
                  });
                }}
                className={inputErrorClass("email")}
                required
              />
              {fieldError("email")}
            </Field>
            <Field label="Phone">
              <Input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.phone;
                    return next;
                  });
                }}
                className={inputErrorClass("phone")}
                required
              />
              {fieldError("phone")}
            </Field>
          </div>
        </Card>

        <Button type="submit" size="lg">
          Continue to review
        </Button>
      </form>
    </Layout>
  );
}
