import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/refund-policy")({
  component: RefundPolicyPage,
  head: () => ({
    meta: [
      { title: "Refund Policy | CLARUM" },
      {
        name: "description",
        content:
          "Returns within 14 days on unopened, unused products. Read Clarum's full refund and returns policy.",
      },
      { property: "og:title", content: "Refund Policy | CLARUM" },
      {
        property: "og:description",
        content:
          "Returns within 14 days on unopened, unused products. Read Clarum's full refund and returns policy.",
      },
    ],
  }),
});

function RefundPolicyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Refund Policy" lastUpdated="May 23, 2026">
      <p>
        <strong className="text-foreground">Returns:</strong> Unopened, unused products in
        original packaging may be returned within 14 days of delivery. For sterility reasons,
        opened or used items are not returnable. Refunds are issued to the original payment
        method within 5–10 business days of us receiving the return or approving the request.
      </p>
      <p>
        <strong className="text-foreground">Damaged, incorrect, or lost orders:</strong>{" "}
        contact us within 7 days of delivery for a replacement or full refund.
      </p>
      <p>
        To request a refund or return, email{" "}
        <a className="text-brand-gold hover:underline" href="mailto:clarumpeps@gmail.com">
          clarumpeps@gmail.com
        </a>{" "}
        with your order number.
      </p>
      <p className="text-foreground/80">
        All products are for in vitro laboratory research use only — not for human or
        veterinary use.
      </p>
    </LegalPage>
  );
}
