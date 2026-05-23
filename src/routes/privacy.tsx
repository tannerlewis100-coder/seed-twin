import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalH2, LegalH3 } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy | CLARUM" },
      { name: "description", content: "How Clarum collects, uses, and protects your personal information." },
      { property: "og:title", content: "Privacy Policy | CLARUM" },
      { property: "og:description", content: "How Clarum collects, uses, and protects your personal information." },
    ],
  }),
});

function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" lastUpdated="May 23, 2026">
      <p>
        This Privacy Policy describes how TLSEVEN LLC ("Clarum," "we," "us," or "our") collects,
        uses, and shares information when you visit clarumpeptides.com or make a purchase.
      </p>

      <LegalH2>1. Information We Collect</LegalH2>

      <LegalH3>a) Information you provide</LegalH3>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>Account info: name, email, password (hashed)</li>
        <li>Order info: billing and shipping address, phone number, email</li>
        <li>Communications: contact form messages, support emails</li>
        <li>Newsletter: email address if you subscribe</li>
      </ul>

      <LegalH3>b) Information collected automatically</LegalH3>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>IP address and approximate location</li>
        <li>Browser type, device, operating system</li>
        <li>Pages viewed, time on site, referring URL</li>
        <li>Cookies and similar tracking technologies</li>
      </ul>

      <LegalH3>c) Information from payment processors</LegalH3>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>We do NOT store full payment card numbers or bank account credentials.</li>
        <li>For cryptocurrency: we store the on-chain transaction hash and sending wallet address.</li>
        <li>For bank transfers: we store the matched memo code and reconciliation confirmation from our bank.</li>
      </ul>

      <LegalH2>2. How We Use Your Information</LegalH2>
      <p>We use your information to:</p>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>Process and fulfill orders</li>
        <li>Communicate about your order (confirmations, shipping, support)</li>
        <li>Provide and improve the site</li>
        <li>Send newsletters (only if you opt in)</li>
        <li>Detect and prevent fraud</li>
        <li>Comply with legal obligations</li>
      </ul>

      <LegalH2>3. Sharing Your Information</LegalH2>
      <p>We share information only with:</p>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>Payment processors (DePay, NOWPayments, our bank Mercury, future processors) to complete transactions</li>
        <li>Shipping partners and fulfillment supplier to deliver your order</li>
        <li>Email service providers (Resend for transactional email, Klaviyo for newsletters if subscribed)</li>
        <li>Hosting and infrastructure providers (DigitalOcean, Alchemy for blockchain verification)</li>
        <li>Government authorities when legally required</li>
      </ul>
      <p>We do not sell or rent your personal information to anyone.</p>

      <LegalH2>4. Cookies</LegalH2>
      <p>
        We use cookies and localStorage to keep you signed in, remember your cart, age
        verification, and analyze site usage. You can disable cookies in your browser, but parts
        of the site may not function correctly.
      </p>

      <LegalH2>5. Data Security</LegalH2>
      <p>
        We take reasonable measures to protect your information, including encrypted connections
        (HTTPS), hashed passwords, scoped API keys, and IP-whitelisted bank API access. No
        system is perfectly secure; we cannot guarantee absolute security.
      </p>

      <LegalH2>6. Data Retention</LegalH2>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>Order records: retained for 7 years for tax and compliance purposes</li>
        <li>Account info: retained while your account is active</li>
        <li>Marketing email: retained until you unsubscribe</li>
        <li>Contact form submissions: retained for 2 years</li>
      </ul>

      <LegalH2>7. Your Rights</LegalH2>
      <p>Depending on your jurisdiction, you may have rights to:</p>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>Access the personal information we hold about you</li>
        <li>Correct inaccurate information</li>
        <li>Delete your account and associated data (subject to legal retention requirements)</li>
        <li>Opt out of marketing communications at any time</li>
        <li>Object to or restrict certain processing</li>
      </ul>
      <p>
        To exercise these rights, email{" "}
        <a className="text-brand-gold hover:underline" href="mailto:clarumpeps@gmail.com">
          clarumpeps@gmail.com
        </a>
        .
      </p>

      <LegalH2>8. Children</LegalH2>
      <p>
        The site is not intended for anyone under 18. We do not knowingly collect information
        from minors. If you believe we have collected information from a minor, contact us and
        we will delete it.
      </p>

      <LegalH2>9. International Transfers</LegalH2>
      <p>
        Our servers are located in the United States. By using the site, you consent to your
        information being transferred to and processed in the U.S.
      </p>

      <LegalH2>10. Third-Party Links</LegalH2>
      <p>
        The site may contain links to third-party sites. We are not responsible for the privacy
        practices of those sites.
      </p>

      <LegalH2>11. Changes to This Policy</LegalH2>
      <p>
        We may update this Policy at any time. Updates take effect when posted. We will notify
        you of material changes by email or a notice on the site.
      </p>

      <LegalH2>12. Contact</LegalH2>
      <p>
        Privacy questions? Email{" "}
        <a className="text-brand-gold hover:underline" href="mailto:clarumpeps@gmail.com">
          clarumpeps@gmail.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
