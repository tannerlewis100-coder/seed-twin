import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchOrder, fromMinor, getOrderBillingEmail, type WooOrder } from "@/lib/woo";

export const Route = createFileRoute("/order-received/$orderId")({
  component: OrderReceivedPage,
  validateSearch: (search: Record<string, unknown>) => ({
    key: typeof search.key === "string" ? search.key : "",
    email: typeof search.email === "string" ? search.email : "",
  }),
  head: () => ({
    meta: [
      { title: "Order confirmed | CLARUM" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function OrderReceivedPage() {
  const { orderId } = Route.useParams();
  const { key, email: searchEmail } = Route.useSearch();
  const billingEmail = searchEmail || getOrderBillingEmail(orderId);

  const [order, setOrder] = useState<WooOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const o = await fetchOrder(orderId, key, billingEmail);
        if (!cancelled) setOrder(o);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load order.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId, key, billingEmail]);

  const currency = order?.totals.currency_symbol ?? "$";
  const minor = order?.totals.currency_minor_unit ?? 2;
  const subtotal = fromMinor(order?.totals.total_items, minor);
  const shipping = fromMinor(order?.totals.total_shipping, minor);
  const tax = fromMinor(order?.totals.total_tax, minor);
  const total = fromMinor(order?.totals.total_price, minor);
  const orderEmail = order?.billing_address?.email;

  return (
    <div className="min-h-screen bg-brand-forest-deep text-foreground flex flex-col">
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1 px-4 py-20 sm:py-28">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin text-brand-gold mx-auto mb-3" />
              <p className="text-foreground/60">Loading order…</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-300 mb-4">{error}</p>
              <Link
                to="/shop"
                className="inline-block rounded-full bg-brand-gold text-brand-forest font-semibold px-6 py-2.5 hover:bg-brand-gold/90"
              >
                Back to shop
              </Link>
            </div>
          ) : order ? (
            <>
              <div className="text-center mb-10">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/10 border border-brand-gold/30 mb-6">
                  <CheckCircle2 className="h-7 w-7 text-brand-gold" />
                </div>
                <p className="text-xs tracking-[0.2em] text-brand-gold/80 uppercase mb-3">
                  Payment received
                </p>
                <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-4">
                  Thanks for your order, #{order.number ?? order.id}!
                </h1>
                {orderEmail && (
                  <p className="text-foreground/60">
                    We've sent a confirmation to{" "}
                    <span className="text-foreground/80">{orderEmail}</span>.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
                <h2 className="font-display text-2xl text-foreground mb-6">Order summary</h2>
                <ul className="space-y-4 mb-6">
                  {order.items.map((item) => {
                    const lineTotal = fromMinor(item.totals.line_total, item.totals.currency_minor_unit);
                    return (
                      <li key={item.id} className="flex items-start gap-3">
                        {item.images?.[0]?.src && (
                          <img
                            src={item.images[0].src}
                            alt={item.images[0].alt ?? item.name}
                            className="h-14 w-14 rounded-md object-cover border border-white/10"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{item.name}</p>
                          <p className="text-xs text-foreground/50">Qty {item.quantity}</p>
                        </div>
                        <p className="text-sm text-foreground tabular-nums">
                          {currency}
                          {lineTotal.toFixed(2)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
                <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                  <Row label="Subtotal" value={`${currency}${subtotal.toFixed(2)}`} />
                  {shipping > 0 && <Row label="Shipping" value={`${currency}${shipping.toFixed(2)}`} />}
                  {tax > 0 && <Row label="Tax" value={`${currency}${tax.toFixed(2)}`} />}
                  <div className="border-t border-white/10 pt-3 mt-3 flex items-center justify-between">
                    <span className="text-foreground/80">Total</span>
                    <span className="font-display text-xl text-brand-gold tabular-nums">
                      {currency}
                      {total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

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
            </>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-foreground/70">
      <span>{label}</span>
      <span className="tabular-nums text-foreground/90">{value}</span>
    </div>
  );
}
