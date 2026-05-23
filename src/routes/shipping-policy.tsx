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
        We currently ship only within the United States. We do not ship to: Hawaii, Alaska,
        U.S. territories, P.O. boxes, APO/FPO addresses, or internationally.
      </p>

      <LegalH2>2. Restricted States</LegalH2>
      <p>
        We do not ship to jurisdictions where the sale of research peptides is restricted.
        Orders placed with shipping addresses in restricted states will be cancelled. You are
        responsible for ensuring our products may be lawfully received at your delivery
        address.
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
        Shipping rates are calculated at checkout based on order weight and destination.
        Shipping fees are non-refundable.
      </p>

      <LegalH2>6. Tracking</LegalH2>
      <p>
        Once your order ships, you will receive a confirmation email with a tracking number.
        Tracking information is also available from your account order history. Please allow up
        to 24 hours after shipment for tracking events to appear with the carrier.
      </p>

      <LegalH2>7. Lost or Stolen Packages</LegalH2>
      <p>
        A package is considered lost if tracking shows no movement for 10 consecutive business
        days, or if the carrier marks it as lost. In that case, contact us at{" "}
        <a className="text-brand-gold hover:underline" href="mailto:clarumpeps@gmail.com">
          clarumpeps@gmail.com
        </a>{" "}
        and we will open a carrier investigation. If the carrier confirms the package is lost,
        we will reship the order at no cost to you.
      </p>
      <p>
        Packages marked "delivered" by the carrier but reported missing are presumed stolen and
        are not eligible for replacement. We recommend shipping to a secure address where
        someone can receive the package.
      </p>

      <LegalH2>8. Discreet Packaging</LegalH2>
      <p>
        All orders ship in plain, unbranded packaging. The sender address is generic and no
        product information appears on the outside of the package.
      </p>

      <LegalH2>9. Storage on Arrival</LegalH2>
      <p>
        Lyophilized peptides are stable at room temperature for short periods during transit,
        but should be refrigerated or frozen promptly on arrival per the storage instructions
        included with your order. Improper storage after delivery is the buyer's responsibility.
      </p>

      <LegalH2>10. Contact</LegalH2>
      <p>
        Shipping questions or issues? Email{" "}
        <a className="text-brand-gold hover:underline" href="mailto:clarumpeps@gmail.com">
          clarumpeps@gmail.com
        </a>{" "}
        with your order number.
      </p>
    </LegalPage>
  );
}
