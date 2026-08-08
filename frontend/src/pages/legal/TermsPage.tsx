import { Link } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { PageHeader } from "../../components/ui/PageHeader";
import { LegalArticle, LegalList, LegalSection } from "../../components/legal/LegalArticle";
import { usePageTitle } from "../../hooks/usePageTitle";
import { HELPLINE_DISPLAY, telLink } from "../../lib/contact";

export function TermsPage() {
  usePageTitle("Terms & conditions", "Terms of use for booking flights and holiday packages on Tripime.");
  return (
    <Layout narrow>
      <PageHeader title="Terms & conditions" subtitle="Last updated: August 2026" />

      <LegalArticle>
        <LegalSection title="1. What Tripime offers">
          <p>Tripime is a travel booking platform. Today, that means:</p>
          <LegalList
            items={[
              "Flights — instantly bookable for the routes and dates shown in search results, with payment and e‑ticket delivery handled on our platform.",
              "Holiday packages — browsable with pricing shown; booking a package is completed as an enquiry, and a travel expert follows up to confirm details and payment.",
              "Hotels, buses and visas — currently enquiry-only. Submitting a search connects you with our team rather than an instant online booking.",
            ]}
          />
        </LegalSection>

        <LegalSection title="2. Eligibility">
          <p>
            You must be at least 18 years old and able to enter a legally binding contract to
            book on Tripime. When booking for other travellers, you confirm the details you
            provide (name, date of birth, gender) are accurate.
          </p>
        </LegalSection>

        <LegalSection title="3. Pricing & payment">
          <LegalList
            items={[
              "Flight prices shown are in Indian Rupees (₹) and include base fare and applicable taxes unless stated otherwise.",
              "Prices can change until a booking is confirmed and paid for — airline fares fluctuate in real time.",
              "For package/hotel/bus/visa enquiries, the price shown is an estimate; your travel expert will confirm the final price before you pay anything.",
            ]}
          />
        </LegalSection>

        <LegalSection title="4. Cancellations & refunds">
          <p>
            Cancellation eligibility and refund amounts depend on the airline's fare rules or the
            package operator's policy. See our{" "}
            <Link to="/refund-policy" className="font-semibold text-primary-700 hover:text-primary-800">
              Refund &amp; Cancellation Policy
            </Link>{" "}
            for details on how to request a cancellation and what to expect.
          </p>
        </LegalSection>

        <LegalSection title="5. Our responsibility">
          <p>
            We work to show accurate, up-to-date information, but airlines and travel operators
            can change schedules, fares or availability outside our control. We're not liable for
            losses caused by such third-party changes, but we'll always help you find the best
            resolution.
          </p>
        </LegalSection>

        <LegalSection title="6. Changes to these terms">
          <p>
            We may update these terms as we launch new features. Continued use of Tripime after
            an update means you accept the revised terms.
          </p>
        </LegalSection>

        <LegalSection title="7. Contact">
          <p>
            Questions about these terms? Call or WhatsApp us at{" "}
            <a href={telLink()} className="font-semibold text-primary-700 hover:text-primary-800">
              {HELPLINE_DISPLAY}
            </a>{" "}
            or visit our{" "}
            <Link to="/contact" className="font-semibold text-primary-700 hover:text-primary-800">
              Contact page
            </Link>
            .
          </p>
        </LegalSection>
      </LegalArticle>
    </Layout>
  );
}
