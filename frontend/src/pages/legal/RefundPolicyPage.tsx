import { Link } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { LegalArticle, LegalList, LegalSection } from "../../components/legal/LegalArticle";
import { usePageTitle } from "../../hooks/usePageTitle";
import { HELPLINE_DISPLAY, telLink } from "../../lib/contact";

export function RefundPolicyPage() {
  usePageTitle(
    "Refund & cancellation policy",
    "How refunds and cancellations work for Tripime flight bookings and packages.",
  );
  return (
    <Layout narrow>
      <PageHeader title="Refund & cancellation policy" subtitle="Last updated: August 2026" />

      <LegalArticle>
        <LegalSection title="Flight bookings">
          <LegalList
            items={[
              "Refund eligibility and amount depend on the fare rules of the booked ticket — some fares are fully refundable, others are partially refundable or non‑refundable.",
              "To cancel a flight booking, call or WhatsApp us with your booking reference; we'll confirm the applicable refund before processing.",
              "Approved refunds are processed to the original payment method within 7–10 business days.",
            ]}
          />
        </LegalSection>

        <LegalSection title="Holiday packages">
          <LegalList
            items={[
              "Package bookings are confirmed through our travel experts, who will share the specific cancellation terms (deposit, timelines, and any non‑refundable components like visa or hotel deposits) before you pay.",
              "To cancel a package, contact your assigned travel expert or reach our support team directly.",
            ]}
          />
        </LegalSection>

        <LegalSection title="Non-refundable items">
          <p>
            Some costs — such as government/embassy visa fees, convenience fees, or supplier
            cancellation charges — may be non‑refundable regardless of when you cancel. These will
            always be disclosed before you confirm a booking.
          </p>
        </LegalSection>

        <Card className="bg-primary-50/60">
          <p className="text-sm font-semibold text-neutral-900">How to request a cancellation</p>
          <p className="mt-1.5 text-sm text-neutral-700">
            Call or WhatsApp{" "}
            <a href={telLink()} className="font-semibold text-primary-700 hover:text-primary-800">
              {HELPLINE_DISPLAY}
            </a>{" "}
            with your booking reference and the email/phone used to book. Our team will confirm
            the refund amount and timeline for your specific case.
          </p>
        </Card>

        <LegalSection title="Questions">
          <p>
            See our{" "}
            <Link to="/terms" className="font-semibold text-primary-700 hover:text-primary-800">
              Terms &amp; Conditions
            </Link>{" "}
            for the full booking terms, or visit{" "}
            <Link to="/contact" className="font-semibold text-primary-700 hover:text-primary-800">
              Contact us
            </Link>{" "}
            for help.
          </p>
        </LegalSection>
      </LegalArticle>
    </Layout>
  );
}
