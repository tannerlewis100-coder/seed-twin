import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalH2 } from "@/components/LegalPage";

export const Route = createFileRoute("/refund-policy")({
  component: RefundPolicyPage,
  head: () => ({
    meta: [
      { title: "Refund Policy | CLARUM" },
      { name: "description", content: "All sales are final. Read Clarum's full refund and returns policy." },
      { property: "og:title", content: "Refund Policy | CLARUM" },
      { property: "og:description", content: "All sales are final. Read Clarum's full refund and returns policy." },
    ],
  }),
});

function RefundPolicyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Refund Policy" lastUpdated="May 23, 2026">
      <p className="text-foreground font-medium">
        ALL SALES ARE FINAL. NO REFUNDS, NO RETURNS, NO EXCHANGES.
      </p>
      <p>
        Due to the nature of our products — sterile research peptides intended for in vitro
        laboratory use — we cannot accept returns or issue refunds under any circumstances. This
        applies whether you paid by cryptocurrency, ACH/wire transfer, credit card, or any
        other method.
      </p>

      <LegalH2>1. Why We Don't Accept Returns</LegalH2>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>Our products are sterile and cannot be resold or reused once shipped.</li>
        <li>We cannot verify how a product was stored or handled after it leaves our facility.</li>
        <li>Cryptocurrency payments are irreversible by design.</li>
        <li>This policy is industry-standard for research chemicals and protects the integrity of our supply chain.</li>
      </ul>
      <p>By placing an order with Clarum, you acknowledge and accept that all sales are final.</p>

      <LegalH2>2. Exceptions</LegalH2>
      <p>
        We may issue store credit (NOT a refund) in the following limited circumstances, at our
        sole discretion:
      </p>
      <p>
        <strong className="text-foreground">a) Shipping errors on our part:</strong> if we send
        you the wrong product, contact us within 7 days of delivery with photos of the package,
        label, and contents. We will ship the correct product at no additional cost. The
        incorrect item does not need to be returned.
      </p>
      <p>
        <strong className="text-foreground">b) Damage in transit:</strong> if your package
        arrives visibly damaged AND the contents are unusable, contact us within 48 hours of
        delivery with photos of the outer packaging and damaged contents. We will replace the
        damaged items at no additional cost.
      </p>
      <p>
        <strong className="text-foreground">c) Lost packages:</strong> see our Shipping Policy.
      </p>
      <p>
        In all exception cases, replacement is the only remedy. No cash, crypto, or bank
        refunds will be issued.
      </p>

      <LegalH2>3. Cancellations</LegalH2>
      <p>
        <strong className="text-foreground">a) Crypto orders:</strong> cannot be cancelled once
        payment is confirmed on-chain.
      </p>
      <p>
        <strong className="text-foreground">b) ACH/wire orders:</strong> can be cancelled
        before payment lands at our bank. After payment is received, the order is final.
      </p>
      <p>
        <strong className="text-foreground">c) Pending orders</strong> that have not been paid
        within 7 days are automatically cancelled. No charge is incurred.
      </p>

      <LegalH2>4. Chargebacks and Disputes</LegalH2>
      <p>
        Filing a chargeback or payment dispute without first contacting us at{" "}
        <a className="text-brand-gold hover:underline" href="mailto:clarumpeps@gmail.com">
          clarumpeps@gmail.com
        </a>{" "}
        is a violation of these terms. We respond to all legitimate concerns within 1 business
        day. Unauthorized chargebacks may result in:
      </p>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>Permanent banning from future orders</li>
        <li>Submission of evidence of order fulfillment to the disputing bank or processor</li>
        <li>Collection action for unpaid balances and fees</li>
      </ul>

      <LegalH2>5. Wrong Address</LegalH2>
      <p>
        If you provide an incorrect or incomplete shipping address and the package is returned
        to us, you are responsible for the reshipping cost. If the package is undeliverable, no
        refund or store credit will be issued.
      </p>

      <LegalH2>6. International Orders</LegalH2>
      <p>
        We do not currently ship internationally. If we add international shipping, customs
        seizures, duties, and import-related losses are the buyer's sole responsibility — no
        refunds or replacements.
      </p>

      <LegalH2>7. Contact</LegalH2>
      <p>
        For shipping errors, damaged packages, or questions:{" "}
        <a className="text-brand-gold hover:underline" href="mailto:clarumpeps@gmail.com">
          clarumpeps@gmail.com
        </a>
        . Include your order details and photos when applicable.
      </p>
    </LegalPage>
  );
}
