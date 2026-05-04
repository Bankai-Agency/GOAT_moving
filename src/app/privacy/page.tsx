import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { ContactFooter } from "@/components/sections/ContactFooter";
import { Touchbar } from "@/components/layout/Touchbar";
import { QuoteModal } from "@/components/ui/QuoteModal";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "GOAT Movers privacy policy — what information we collect, how we use it, your rights, and how to contact us about your data.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "April 2026";

/* Section + paragraph helpers — keep markup consistent with the site's style. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-sans font-semibold text-2xl lg:text-[28px] leading-[1.2] tracking-[-0.72px] lg:tracking-[-0.84px] text-white">
        {title}
      </h2>
      <div className="flex flex-col gap-3 font-sans font-normal text-base lg:text-lg leading-[1.5] tracking-[-0.48px] lg:tracking-[-0.36px] text-white/70">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="page-zoom">
      <Header />
      <main>
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Privacy Policy" }]} />

        {/* Hero — same container width as the body so left edges align */}
        <section className="bg-[#0c0c0c] px-4 pt-6 lg:pt-10 pb-10 lg:pb-12">
          <div className="max-w-[840px] mx-auto flex flex-col gap-4 lg:gap-5">
            <h1 className="font-sans font-bold text-[36px] lg:text-[64px] leading-[1.1] tracking-[-1.44px] lg:tracking-[-2.56px]">
              <span className="text-[#FFE533]">Privacy </span>
              <span className="text-white">Policy</span>
            </h1>
            <p className="font-mono font-medium text-xs lg:text-sm uppercase tracking-[-0.48px] text-white/40">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="bg-[#0c0c0c] px-4 pb-[60px] lg:pb-[100px]">
          <div className="max-w-[840px] mx-auto flex flex-col gap-8 lg:gap-10">
            <p className="font-sans font-normal text-base lg:text-lg leading-[1.5] tracking-[-0.48px] lg:tracking-[-0.36px] text-white/70">
              GOAT Movers (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates this website
              and provides moving services in Vancouver, WA, Portland, OR, and across the United
              States. This Privacy Policy explains how we collect, use, and protect your personal
              information when you use our website or contact us for a quote.
            </p>

            <Section title="1. Information We Collect">
              <p>We collect information you voluntarily provide when you:</p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>Submit a quote request form (name, phone number, email, addresses, move date, move size)</li>
                <li>Contact us by phone or email</li>
                <li>Subscribe to communications</li>
              </ul>
              <p>
                We also automatically collect technical data when you visit the site: IP address,
                browser type, device type, pages viewed, and approximate location (city / state level)
                via standard analytics tools.
              </p>
            </Section>

            <Section title="2. How We Use Your Information">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>Provide quotes and respond to your inquiries</li>
                <li>Schedule and execute your move</li>
                <li>Process payment for services rendered</li>
                <li>Send service-related communications (booking confirmations, schedule updates)</li>
                <li>Improve our website, services, and customer experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </Section>

            <Section title="3. Information Sharing">
              <p>
                We do not sell your personal information. We share data only with:
              </p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>Service providers who help us operate the business (e.g., CRM, email delivery, payment processing) under contractual confidentiality obligations</li>
                <li>Government agencies when required by law (subpoena, court order, regulatory request)</li>
                <li>Professional advisors (legal, accounting) under a duty of confidentiality</li>
              </ul>
            </Section>

            <Section title="4. Cookies & Analytics">
              <p>
                We use cookies and similar technologies to remember your preferences and analyze
                site usage. We use Google Analytics 4 to understand how visitors interact with the
                site. You can disable cookies in your browser settings; some features of the site
                may not function fully without them.
              </p>
            </Section>

            <Section title="5. Data Retention">
              <p>
                We retain quote requests and customer records for as long as needed to provide
                services and comply with legal obligations (typically 7 years for accounting and
                tax records). After that period, records are securely deleted or anonymized.
              </p>
            </Section>

            <Section title="6. Your Rights">
              <p>Depending on your jurisdiction (e.g., California CCPA, EU GDPR), you may have the right to:</p>
              <ul className="list-disc pl-6 flex flex-col gap-2">
                <li>Access the personal information we hold about you</li>
                <li>Correct inaccurate information</li>
                <li>Delete your information (subject to legal retention requirements)</li>
                <li>Opt out of marketing communications</li>
                <li>Receive a copy of your data in portable format</li>
              </ul>
              <p>
                To exercise any of these rights, email us at{" "}
                <a href="mailto:goatmoversla@gmail.com" className="text-[#FFE533] hover:underline">
                  goatmoversla@gmail.com
                </a>
                . We will respond within 30 days.
              </p>
            </Section>

            <Section title="7. Data Security">
              <p>
                We use reasonable administrative, technical, and physical safeguards to protect
                your personal information from unauthorized access, disclosure, alteration, or
                destruction. However, no method of transmission over the internet or electronic
                storage is 100% secure.
              </p>
            </Section>

            <Section title="8. Children's Privacy">
              <p>
                Our services are not directed to children under 13. We do not knowingly collect
                personal information from children. If we become aware that we have collected
                personal information from a child under 13, we will delete it promptly.
              </p>
            </Section>

            <Section title="9. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. We will post the updated
                version on this page and revise the &ldquo;Last updated&rdquo; date above. Material
                changes will be communicated via email if you have provided one.
              </p>
            </Section>

            <Section title="10. Contact Us">
              <p>If you have questions about this policy or your personal information, contact us:</p>
              <ul className="list-none pl-0 flex flex-col gap-1.5">
                <li>
                  <span className="text-white/50">Email:</span>{" "}
                  <a href="mailto:goatmoversla@gmail.com" className="text-[#FFE533] hover:underline">
                    goatmoversla@gmail.com
                  </a>
                </li>
                <li>
                  <span className="text-white/50">Phone:</span>{" "}
                  <a href="tel:+13805240846" className="text-[#FFE533] hover:underline">
                    +1 380-524-0846
                  </a>
                </li>
                <li>
                  <span className="text-white/50">Mail:</span> GOAT Movers, 8101 NE 14th Pl, Portland, OR 97211
                </li>
              </ul>
            </Section>
          </div>
        </section>
      </main>
      <ContactFooter />
      <Touchbar />
      <QuoteModal />
    </div>
  );
}
