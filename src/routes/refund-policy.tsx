import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/refund-policy")({
  component: RefundPolicyPage,
  head: () => ({
    meta: [
      { title: "Refund Policy | CLARUM" },
      {
        name: "description",
        content:
          "All sales are final. How to reach us if your order arrives damaged, incorrect, or does not arrive.",
      },
      { property: "og:title", content: "Refund Policy | CLARUM" },
      {
        property: "og:description",
        content:
          "All sales are final. How to reach us if your order arrives damaged, incorrect, or does not arrive.",
      },
    ],
  }),
});

function RefundPolicyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Refund Policy" lastUpdated="September 21, 2026">
      <p>
        <strong className="text-foreground">All sales are final.</strong> We do not accept
        returns or exchanges for change of mind, including unopened or unused products. These
        are research materials, and once an order leaves us we cannot verify how it has been
        stored or handled.
      </p>
      <p>
        <strong className="text-foreground">Problems with an order.</strong> If your order
        arrives damaged or incorrect, or has not arrived, contact{" "}
        <a className="text-brand-gold hover:underline" href="mailto:clarumpeps@gmail.com">
          clarumpeps@gmail.com
        </a>{" "}
        promptly with your order number and a description of the issue. Include photos of the
        item and packaging when applicable. We will review the issue and any available
        resolution.
      </p>
      <p>
        For packages that appear lost or delayed in transit, see our{" "}
        <Link className="text-brand-gold hover:underline" to="/shipping-policy">
          Shipping Policy
        </Link>
        , which explains carrier claims and investigation timelines.
      </p>
      <p>
        This policy does not limit any rights or remedies required by applicable law.
      </p>
      <p className="text-foreground/80">
        All products are for in vitro laboratory research use only — not for human or
        veterinary use.
      </p>
    </LegalPage>
  );
}
