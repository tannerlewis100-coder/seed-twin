import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/order-confirmation/$orderId")({
  component: OrderConfirmationPage,
  head: () => ({
    meta: [
      { title: "Order confirmed | CLARUM" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function OrderConfirmationPage() {
  const { orderId } = Route.useParams();

  return (
    <div className="min-h-screen bg-brand-forest-deep text-foreground flex flex-col">
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1 px-4 py-20 sm:py-28">
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/10 border border-brand-gold/30 mb-6">
            <CheckCircle2 className="h-7 w-7 text-brand-gold" />
          </div>
          <p className="text-xs tracking-[0.2em] text-brand-gold/80 uppercase mb-3">Order received</p>
          <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-4">Thank you.</h1>
          <p className="text-foreground/60 mb-2">
            Your order has been placed successfully.
          </p>
          <p className="text-sm text-foreground/50">
            Order reference{" "}
            <span className="font-mono text-foreground/80">#{orderId}</span>
          </p>
          <p className="text-sm text-foreground/50 mt-6">
            A confirmation email is on its way. We'll follow up with tracking once your order ships.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <Link
              to="/shop"
              className="rounded-full bg-brand-gold text-brand-forest font-semibold px-6 py-2.5 hover:bg-brand-gold/90"
            >
              Continue shopping
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-foreground/80 hover:border-white/30"
            >
              Contact support
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
