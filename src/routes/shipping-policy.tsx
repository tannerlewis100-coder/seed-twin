import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalH2 } from "@/components/LegalPage";

export const Route = createFileRoute("/shipping-policy")({
  component: ShippingPolicyPage,
  head: () => ({
    meta: [
      { title: "Shipping Policy | CLARUM" },
      { name: "description", content: "Where Clarum ships, how long it takes, and what to do if a package is delayed or lost." },
      { property: "og:title", content: "Shipping Policy | CLARUM" },
      { property: "og:description", content: "Where Clarum ships, how long it takes, and what to do if a package is delayed or lost." },
    ],
  }),
});

function ShippingPolicyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Shipping Policy" lastUpdated="May 23, 2026">
      <LegalH2>1. Shipping Destinations</LegalH2>
      <p>
        We currently ship within the United States. We do not ship to: Hawaii, Alaska, U.S.
        territories, P.O. boxes, APO/FPO addresses, or internationally.
      </p>

      <LegalH2>2. Jurisdictional Compliance</LegalH2>
      <p>
        You are responsible for ensuring our products may be lawfully received at your delivery
        address. By placing an order, you confirm that receipt and use of the products at your
        shipping address complies with all applicable state and local laws. Clarum is not
        responsible for orders that cannot be delivered or that result in legal issues at your
        end due to local regulations. We reserve the right to refuse or cancel any order at our
        sole discretion.
      </p>

      <LegalH2>3. Processing Time</LegalH2>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>Crypto and confirmed payments: orders are processed and prepared for shipment within 1–2 business days of payment confirmation.</li>
        <li>ACH/wire payments: orders are processed within 1–2 business days after the transfer lands at our bank (typically 1–3 business days after you initiate the transfer).</li>
        <li>Orders placed on weekends or holidays are processed the next business day.</li>
      </ul>

      <LegalH2>4. Shipping Method and Times</LegalH2>
      <p>
        We ship via United States Postal Service (USPS) or a comparable carrier. Estimated
        transit times:
      </p>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>Standard shipping: 3–5 business days</li>
        <li>Expedited shipping: 1–3 business days (where available)</li>
      </ul>
      <p>
        Transit times are estimates only and are not guaranteed. Delays caused by the carrier,
        weather, customs, or other factors outside our control are not grounds for refund or
        replacement.
      </p>

      <LegalH2>5. Shipping Costs</LegalH2>
      <p>
        Shipping is a flat $12.00 for standard delivery anywhere in the continental US. Orders
        over $150 ship free. Shipping fees are non-refundable.
      </p>

      <LegalH2>6. Tracking</LegalH2>
      <p>
        You will receive an email with a tracking number once your order ships. Allow up to 24
        hours for tracking information to appear in the carrier's system.
      </p>

      <LegalH2>7. Lost or Stolen Packages</LegalH2>
      <p>Risk of loss transfers to you when the carrier accepts the package.</p>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>If tracking shows "delivered" but you did not receive the package, file a claim with the carrier first.</li>
        <li>If tracking shows the package as lost in transit for more than 14 days past the estimated delivery date, contact us. We will work with the carrier and may, at our sole discretion, ship a replacement.</li>
        <li>We are not responsible for theft after delivery. We recommend shipping to a secure address.</li>
      </ul>

      <LegalH2>8. Incorrect Address</LegalH2>
      <p>
        You are responsible for providing a complete and accurate shipping address. If the
        package is returned to us due to an incorrect address, you must pay the reshipping cost
        before we send it out again. If the package is destroyed by the carrier as
        undeliverable, no refund or replacement will be issued.
      </p>

      <LegalH2>9. Package Inspection</LegalH2>
      <p>
        Inspect your package within 48 hours of delivery. If contents are damaged or incorrect,
        contact{" "}
        <a className="text-brand-gold hover:underline" href="mailto:clarumpeps@gmail.com">
          clarumpeps@gmail.com
        </a>{" "}
        within 48 hours with photos. See our Refund Policy for available remedies.
      </p>

      <LegalH2>10. Signatures and Discreet Packaging</LegalH2>
      <p>
        All packages ship in plain, discreet packaging with no external indication of contents.
        Signature confirmation is available on request and may be required for higher-value
        orders.
      </p>

      <LegalH2>11. Contact</LegalH2>
      <p>
        Questions about a shipment? Email{" "}
        <a className="text-brand-gold hover:underline" href="mailto:clarumpeps@gmail.com">
          clarumpeps@gmail.com
        </a>{" "}
        with your order details.
      </p>
    </LegalPage>
  );
}
