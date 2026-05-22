import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchOrder, fromMinor, getOrderBillingEmail, type WooOrder } from "@/lib/woo";

export const Route = createFileRoute("/order-pay/$orderId")({
  component: OrderPayPage,
  validateSearch: (search: Record<string, unknown>) => ({
    key: typeof search.key === "string" ? search.key : "",
    email: typeof search.email === "string" ? search.email : "",
  }),
  head: () => ({
    meta: [
      { title: "Complete payment | CLARUM" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

const EVM_WALLET = "0xA2d94ee5716eA1C7AAB32eBb7e128476E015AEB4";

function OrderPayPage() {
  const { orderId } = Route.useParams();
  const { key, email } = Route.useSearch();
  const billingEmail = email || getOrderBillingEmail(orderId);

  const [order, setOrder] = useState<WooOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!order || !widgetRef.current) return;
    if (order.needs_payment === false) return;
    let cancelled = false;
    let unmountWidget: undefined | (() => void);

    (async () => {
      try {
        const { Buffer } = await import("buffer");
        if (!(window as typeof window & { Buffer?: typeof Buffer }).Buffer) {
          (window as typeof window & { Buffer?: typeof Buffer }).Buffer = Buffer;
        }

        const mod = await import("@depay/widgets");
        if (cancelled) return;
        const DePayWidgets = (mod as any).default ?? mod;
        const total = fromMinor(order.totals.total_price, order.totals.currency_minor_unit);
        const amount = total.toFixed(2);

        widgetRef.current.innerHTML = "";

        const widget = await DePayWidgets.Payment({
          accept: [
            { blockchain: "ethereum", amount, token: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", receiver: EVM_WALLET },
            { blockchain: "ethereum", amount, token: "0xdac17f958d2ee523a2206206994597c13d831ec7", receiver: EVM_WALLET },
            { blockchain: "polygon", amount, token: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", receiver: EVM_WALLET },
            { blockchain: "bsc", amount, token: "0x55d398326f99059ff775485246999027b3197955", receiver: EVM_WALLET },
            { blockchain: "arbitrum", amount, token: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", receiver: EVM_WALLET },
            { blockchain: "base", amount, token: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", receiver: EVM_WALLET },
          ],
          document,
          container: widgetRef.current,
          style: {
            colors: {
              primary: "#D4A745",
              text: "#FFFFFF",
              buttonText: "#000000",
              icons: "#D4A745",
            },
            fontFamily: "Karla, sans-serif",
          },
          succeeded: async (transaction: unknown) => {
            try {
              await fetch(`https://admin.clarumpeptides.com/wp-json/clarum/v1/payment-confirm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  order_id: order.id,
                  order_key: order.order_key,
                  transaction,
                }),
              });
            } catch {
              /* ignore — still take user to confirmation */
            }
            window.location.href = `/order-received/${order.id}?key=${encodeURIComponent(order.order_key)}&email=${encodeURIComponent(billingEmail || order.billing_address?.email || "")}`;
          },
        });

        unmountWidget = typeof widget?.unmount === "function" ? widget.unmount : undefined;
      } catch (e) {
        if (!cancelled) setWidgetError(e instanceof Error ? e.message : "Could not load payment widget.");
      }
    })();

    return () => {
      cancelled = true;
      unmountWidget?.();
    };
  }, [order]);

  const currency = order?.totals.currency_symbol ?? "$";
  const minor = order?.totals.currency_minor_unit ?? 2;
  const subtotal = fromMinor(order?.totals.total_items, minor);
  const shipping = fromMinor(order?.totals.total_shipping, minor);
  const tax = fromMinor(order?.totals.total_tax, minor);
  const total = fromMinor(order?.totals.total_price, minor);

  return (
    <div className="min-h-screen bg-brand-forest-deep text-foreground flex flex-col">
      <AnnouncementBar />
      <SiteHeader />

      <main className="flex-1 px-4 sm:px-8 py-10 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-xs tracking-[0.2em] text-brand-gold/80 uppercase mb-2">Payment</p>
            <h1 className="font-display text-3xl sm:text-5xl text-foreground">
              Complete payment
            </h1>
            <p className="text-sm text-foreground/50 mt-2 flex items-center gap-2">
              <Lock className="h-3.5 w-3.5" /> Secure crypto checkout via DePay.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-brand-gold mx-auto mb-3" />
              <p className="text-foreground/60">Loading order…</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
              <p className="text-red-300 mb-4">{error}</p>
              <Link
                to="/shop"
                className="inline-block rounded-full bg-brand-gold text-brand-forest font-semibold px-6 py-2.5 hover:bg-brand-gold/90"
              >
                Back to shop
              </Link>
            </div>
          ) : order ? (
            <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
              {/* DePay widget */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
                <h2 className="font-display text-2xl text-foreground mb-1">Pay with crypto</h2>
                <p className="text-sm text-foreground/50 mb-6">
                  Choose a network and wallet to complete your order.
                </p>
                {order.needs_payment === false ? (
                  <p className="text-sm text-foreground/70">
                    This order has already been paid.{" "}
                    <Link
                      to="/order-received/$orderId"
                      params={{ orderId: String(order.id) }}
                      search={{ key: order.order_key }}
                      className="text-brand-gold hover:underline"
                    >
                      View confirmation →
                    </Link>
                  </p>
                ) : widgetError ? (
                  <p className="text-sm text-red-300">{widgetError}</p>
                ) : (
                  <div ref={widgetRef} id="depay-widget" className="relative min-h-[400px]" />
                )}
              </div>

              {/* Order summary */}
              <aside className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 h-fit">
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
              </aside>
            </div>
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
