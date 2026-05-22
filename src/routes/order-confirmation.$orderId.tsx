import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchOrder, fromMinor, type WooOrder } from "@/lib/woo";

export const Route = createFileRoute("/order-confirmation/$orderId")({
  component: OrderConfirmationPage,
  validateSearch: (search: Record<string, unknown>) => ({
    key: typeof search.key === "string" ? search.key : "",
  }),
  head: () => ({
    meta: [
      { title: "Order confirmed | CLARUM" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

const WP_BASE = "https://admin.clarumpeptides.com/wp-json/clarum/v1";

function OrderConfirmationPage() {
  const { orderId } = Route.useParams();
  const { key } = Route.useSearch();

  const [order, setOrder] = useState<WooOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [polling, setPolling] = useState(false);

  // Initial order fetch
  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    (async () => {
      try {
        const o = await fetchOrder(orderId, key);
        if (cancelled) return;
        setOrder(o);
        if (o.needs_payment === false) setIsPaid(true);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load order.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, key]);

  // Poll NOWPayments status every 5s until paid
  useEffect(() => {
    if (!key || isPaid) return;
    if (!order) return;
    setPolling(true);
    let cancelled = false;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${WP_BASE}/nowpayments/payment-status?order_id=${encodeURIComponent(orderId)}&key=${encodeURIComponent(key)}`,
        );
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (data?.is_paid === true) {
          setIsPaid(true);
          setPolling(false);
          clearInterval(interval);
        }
      } catch {
        /* ignore network blips */
      }
    }, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [order, isPaid, orderId, key]);

  const currency = order?.totals.currency_symbol ?? "$";
  const minor = order?.totals.currency_minor_unit ?? 2;
  const total = fromMinor(order?.totals.total_price, minor);

  return (
    <div className="min-h-screen bg-brand-forest-deep text-foreground flex flex-col">
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1 px-4 py-16 sm:py-24">
        <div className="max-w-xl mx-auto text-center">
          <div
            className={`inline-flex h-14 w-14 items-center justify-center rounded-full border mb-6 ${
              isPaid
                ? "bg-emerald-500/10 border-emerald-500/40"
                : "bg-brand-gold/10 border-brand-gold/30"
            }`}
          >
            {isPaid ? (
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            ) : (
              <Loader2 className="h-7 w-7 text-brand-gold animate-spin" />
            )}
          </div>
          <p className="text-xs tracking-[0.2em] text-brand-gold/80 uppercase mb-3">
            {isPaid ? "Payment received" : "Awaiting payment"}
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-4">
            {isPaid ? "Thank you." : "Confirming payment…"}
          </h1>

          {error ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : isPaid ? (
            <>
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
            </>
          ) : (
            <>
              <p className="text-foreground/60 mb-2">
                We're waiting for your payment to be confirmed on the network.
              </p>
              <p className="text-sm text-foreground/50">
                Order reference{" "}
                <span className="font-mono text-foreground/80">#{orderId}</span>
                {order && (
                  <>
                    {" · "}
                    <span className="text-brand-gold/90">
                      {currency}
                      {total.toFixed(2)}
                    </span>
                  </>
                )}
              </p>
              {polling && (
                <p className="text-[11px] text-foreground/40 mt-4">
                  Checking every few seconds. You can safely leave this page open.
                </p>
              )}
            </>
          )}

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
