import { Link } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { PageHeader } from "../../components/ui/PageHeader";
import { LegalArticle, LegalList, LegalSection } from "../../components/legal/LegalArticle";
import { usePageTitle } from "../../hooks/usePageTitle";
import { SUPPORT_EMAIL, mailLink } from "../../lib/contact";

export function PrivacyPage() {
  usePageTitle("Privacy policy", "How Tripime collects, uses and protects your personal information.");
  return (
    <Layout narrow>
      <PageHeader title="Privacy policy" subtitle="Last updated: August 2026" />

      <LegalArticle>
        <LegalSection title="What we collect">
          <p>When you search or book on Tripime, we collect only what&apos;s needed to serve you:</p>
          <LegalList
            items={[
              "Contact details — name, email address and phone number.",
              "Passenger details for bookings — title, full name, gender and date of birth, as required for e‑tickets.",
              "Enquiry details — for holiday packages, hotels, buses and visas, whatever you share in the enquiry form (destination, travel dates, number of travellers).",
              "Basic usage data — pages visited and searches performed, used only to keep the site working and improve it.",
            ]}
          />
        </LegalSection>

        <LegalSection title="What we never store">
          <p>
            On the payment step, your card number and CVV are used only to validate the form and
            are <strong className="text-neutral-900">never sent to or stored on our servers</strong>.
            No full card numbers, CVVs, or bank credentials are ever retained by Tripime.
          </p>
        </LegalSection>

        <LegalSection title="How we use your information">
          <LegalList
            items={[
              "To create and manage your flight bookings and send e‑tickets/confirmation emails.",
              "To respond to package, hotel, bus and visa enquiries and connect you with a travel expert.",
              "To send booking-related updates by email or phone — we don't sell your data to third parties.",
            ]}
          />
        </LegalSection>

        <LegalSection title="Local storage & cookies">
          <p>
            We use your browser&apos;s local/session storage to remember your in‑progress
            booking (selected flight, passenger details, currency preference) so you don&apos;t
            lose progress if you refresh the page. This data stays on your device and is cleared
            when you complete or abandon a booking.
          </p>
        </LegalSection>

        <LegalSection title="Third-party services">
          <p>
            We use a standard email delivery provider (SMTP) solely to send booking confirmations
            and receipts. We do not share your data with advertisers.
          </p>
        </LegalSection>

        <LegalSection title="Your rights">
          <p>
            You can ask us to access, correct or delete your personal data at any time by
            emailing{" "}
            <a href={mailLink()} className="font-semibold text-primary-700 hover:text-primary-800">
              {SUPPORT_EMAIL}
            </a>
            . We'll respond within a reasonable timeframe.
          </p>
        </LegalSection>

        <LegalSection title="Changes to this policy">
          <p>
            As Tripime adds new features (like hotels, buses and visas going live), we&apos;ll
            update this page and note the change date above. See also our{" "}
            <Link to="/terms" className="font-semibold text-primary-700 hover:text-primary-800">
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </LegalSection>
      </LegalArticle>
    </Layout>
  );
}
