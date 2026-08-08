import { Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { Layout } from "../../components/Layout";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { usePageTitle } from "../../hooks/usePageTitle";
import { HELPLINE_DISPLAY, SUPPORT_EMAIL, mailLink, telLink, whatsappLink } from "../../lib/contact";

export function ContactPage() {
  usePageTitle("Contact us", "Call, email or WhatsApp Tripime travel experts for booking help.");
  return (
    <Layout narrow>
      <PageHeader
        title="Contact us"
        subtitle="Real people, not a bot. Reach out any time — we usually reply within a few hours."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex flex-col">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <Phone className="size-5" aria-hidden />
          </div>
          <p className="mt-3 font-semibold text-neutral-900">Call us</p>
          <p className="mt-1 text-sm text-neutral-600">
            Flight bookings, packages, or anything else — just call.
          </p>
          <a href={telLink()} className="mt-3 text-base font-bold text-primary-700 hover:text-primary-800">
            {HELPLINE_DISPLAY}
          </a>
        </Card>

        <Card className="flex flex-col">
          <div className="flex size-10 items-center justify-center rounded-xl bg-success-50 text-success-700">
            <MessageCircle className="size-5" aria-hidden />
          </div>
          <p className="mt-3 font-semibold text-neutral-900">WhatsApp</p>
          <p className="mt-1 text-sm text-neutral-600">
            Prefer to chat? Message us and a travel expert will get back to you.
          </p>
          <Button
            variant="secondary"
            className="mt-3 w-fit"
            onClick={() =>
              window.open(
                whatsappLink("Hi Tripime, I'd like some help with a booking."),
                "_blank",
              )
            }
          >
            Message on WhatsApp
          </Button>
        </Card>

        <Card className="flex flex-col">
          <div className="flex size-10 items-center justify-center rounded-xl bg-secondary-50 text-secondary-700">
            <Mail className="size-5" aria-hidden />
          </div>
          <p className="mt-3 font-semibold text-neutral-900">Email</p>
          <p className="mt-1 text-sm text-neutral-600">
            For detailed queries, invoices, or feedback.
          </p>
          <a href={mailLink()} className="mt-3 text-base font-bold text-primary-700 hover:text-primary-800">
            {SUPPORT_EMAIL}
          </a>
        </Card>

        <Card className="flex flex-col">
          <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
            <Clock className="size-5" aria-hidden />
          </div>
          <p className="mt-3 font-semibold text-neutral-900">Support hours</p>
          <p className="mt-1 text-sm text-neutral-600">
            Our team is available every day, 9 AM – 11 PM IST. Call or WhatsApp outside these
            hours and we&apos;ll get back to you as soon as we&apos;re online.
          </p>
        </Card>
      </div>

      <Card className="mt-6 bg-primary-50/60">
        <p className="text-sm text-neutral-700">
          <strong className="text-neutral-900">Booked a flight already?</strong> Keep your
          booking reference and the email/phone used to book handy — it&apos;ll help us find your
          reservation faster when you call.
        </p>
      </Card>
    </Layout>
  );
}
