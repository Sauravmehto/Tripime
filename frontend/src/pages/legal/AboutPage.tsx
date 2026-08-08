import { Link } from "react-router-dom";
import { Layout } from "../../components/Layout";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { LegalArticle, LegalSection } from "../../components/legal/LegalArticle";
import { usePageTitle } from "../../hooks/usePageTitle";
import { HELPLINE_DISPLAY, telLink } from "../../lib/contact";

export function AboutPage() {
  usePageTitle("About us", "Learn about Tripime — honest flight booking and curated holiday packages.");
  return (
    <Layout narrow>
      <PageHeader
        title="About Tripime"
        subtitle="A travel platform built to make booking honest, fast and human."
      />

      <LegalArticle>
        <LegalSection title="Our story">
          <p>
            Tripime started with a simple idea: booking travel shouldn&apos;t feel like a maze
            of hidden fees and confusing screens. We&apos;re a small, growing team building a
            single place to search flights, plan holidays, and get real help from people who
            actually know travel — not just a chatbot.
          </p>
        </LegalSection>

        <LegalSection title="What you can do here today">
          <p>
            We&apos;re rolling out Tripime in stages so every feature we ship actually works
            end‑to‑end:
          </p>
          <Card className="!p-4">
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary-500" aria-hidden />
                <span>
                  <strong className="text-neutral-900">Flights</strong> — search, compare and
                  book with instant e‑tickets, currently covering select domestic routes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-secondary-500" aria-hidden />
                <span>
                  <strong className="text-neutral-900">Holiday packages</strong> — browse curated
                  domestic and international packages and send us an enquiry; our travel experts
                  take it from there.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neutral-300" aria-hidden />
                <span>
                  <strong className="text-neutral-900">Hotels, buses &amp; visas</strong> — coming
                  soon. You can still reach our team for these today by phone or WhatsApp.
                </span>
              </li>
            </ul>
          </Card>
        </LegalSection>

        <LegalSection title="How we work">
          <p>
            Every booking or enquiry you submit reaches a real person on our team. We&apos;d
            rather tell you a route or feature isn&apos;t live yet than pretend it is — that&apos;s
            the standard we&apos;re holding ourselves to as we grow.
          </p>
        </LegalSection>

        <LegalSection title="Get in touch">
          <p>
            Questions, feedback, or need help with a booking? Visit our{" "}
            <Link to="/contact" className="font-semibold text-primary-700 hover:text-primary-800">
              Contact page
            </Link>{" "}
            or call/WhatsApp us directly at{" "}
            <a href={telLink()} className="font-semibold text-primary-700 hover:text-primary-800">
              {HELPLINE_DISPLAY}
            </a>
            .
          </p>
        </LegalSection>
      </LegalArticle>
    </Layout>
  );
}
