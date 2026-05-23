import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Copy, Loader2, Lock } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchOrder, fromMinor, type WooOrder } from "@/lib/woo";

export const Route = createFileRoute("/order-pay/$orderId")({
  component: OrderPayPage,
  validateSearch: (search: Record<string, unknown>) => ({
    key: typeof search.key === "string" ? search.key : "",
  }),
  head: () => ({
    meta: [
      { title: "Complete payment | CLARUM" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

const EVM_WALLET = "0xA2d94ee5716eA1C7AAB32eBb7e128476E015AEB4";
const WP_BASE = "https://admin.clarumpeptides.com/wp-json/clarum/v1";

type PaymentTab = "depay" | "nowpayments" | "bank";

type BankInstructions = {
  beneficiary?: string;
  address?: string;
  bank?: string;
  routing?: string;
  account?: string;
  memo?: string;
  amount?: string | number;
};

declare global {
  interface Window {
    DePayWidgets?: any;
  }
}

function OrderPayPage() {
  const { orderId } = Route.useParams();
  const { key } = Route.useSearch();

  const [order, setOrder] = useState<WooOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const [tab, setTab] = useState<PaymentTab>("depay");
  const [tabInitialized, setTabInitialized] = useState(false);
  const [nowLoading, setNowLoading] = useState(false);
  const [nowError, setNowError] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const o = await fetchOrder(orderId, key);
        if (!cancelled) {
          setOrder(o);
          if (!tabInitialized) {
            setTab(o.payment_method === "nowpayments" ? "nowpayments" : "depay");
            setTabInitialized(true);
          }
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load order.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, key]);

  useEffect(() => {
    if (!order || !widgetRef.current) return;
    if (order.needs_payment === false) return;
    if (tab !== "depay") return;
    let cancelled = false;
    let unmountWidget: undefined | (() => void);

    (async () => {
      try {
        const container = widgetRef.current;
        if (!container) return;

        const { Buffer } = await import("buffer");
        if (!(window as typeof window & { Buffer?: typeof Buffer }).Buffer) {
          (window as typeof window & { Buffer?: typeof Buffer }).Buffer = Buffer;
        }

        let waited = 0;
        while (!window.DePayWidgets && waited < 5000) {
          await new Promise((r) => setTimeout(r, 100));
          waited += 100;
        }
        if (cancelled) return;
        if (!window.DePayWidgets) {
          throw new Error("Payment widget failed to load. Please refresh the page.");
        }
        const DePayWidgets = window.DePayWidgets;
        const total = fromMinor(order.totals.total_price, order.totals.currency_minor_unit);
        const amount = total.toFixed(2);

        container.innerHTML = "";

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
          container,
          style: {
            colors: {
              primary: "#D4A745",
              text: "#FFFFFF",
              background: "#0B0B0B",
              cardBackground: "#141414",
              warning: "#D4A745",
              mixActive: "#FFFFFF",
              buttonText: "#000000",
              icons: "#D4A745",
            },
            fontFamily: "Karla, sans-serif",
          },
          error: (error: unknown) => {
            console.error("DePay widget error", error);
          },
          critical: (error: unknown) => {
            console.error("DePay widget critical", error);
            if (!cancelled) {
              setWidgetError(error instanceof Error ? error.message : "Could not load payment widget.");
            }
          },
          succeeded: async (transaction: unknown) => {
            try {
              await fetch(`${WP_BASE}/payment-confirm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  order_id: order.id,
                  order_key: order.order_key,
                  transaction,
                }),
              });
            } catch {
              /* ignore */
            }
            window.location.href = `/order-confirmation/${order.id}?key=${encodeURIComponent(order.order_key)}`;
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
  }, [order, tab]);

  async function generateInvoice() {
    if (!order) return;
    setNowError(null);
    setNowLoading(true);
    try {
      const res = await fetch(`${WP_BASE}/nowpayments/create-invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: order.id, key: order.order_key }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.invoice_url) {
        throw new Error(data?.message || "Could not create invoice.");
      }
      window.location.href = data.invoice_url as string;
    } catch (e) {
      setNowError(e instanceof Error ? e.message : "Could not create invoice.");
      setNowLoading(false);
    }
  }

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
              <Lock className="h-3.5 w-3.5" /> Secure crypto checkout.
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
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
                {order.needs_payment === false ? (
                  <>
                    <h2 className="font-display text-2xl text-foreground mb-1">Payment received</h2>
                    <p className="text-sm text-foreground/70">
                      This order has already been paid.{" "}
                      <Link
                        to="/order-confirmation/$orderId"
                        params={{ orderId: String(order.id) }}
                        search={{ key: order.order_key }}
                        className="text-brand-gold hover:underline"
                      >
                        View confirmation →
                      </Link>
                    </p>
                  </>
                ) : (
                  <>
                    {tab === "depay" ? (
                      <>
                        <h2 className="font-display text-2xl text-foreground mb-1">Pay with crypto</h2>
                        <p className="text-sm text-foreground/50 mb-6">
                          Choose a network and wallet to complete your order.
                        </p>
                        {widgetError ? (
                          <p className="text-sm text-red-300">{widgetError}</p>
                        ) : (
                          <div
                            ref={widgetRef}
                            id="depay-widget"
                            className="relative w-full overflow-hidden rounded-xl"
                            style={{ minHeight: "620px", height: "620px" }}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <h2 className="font-display text-2xl text-foreground mb-1">Pay with any coin</h2>
                        <p className="text-sm text-foreground/50 mb-6">
                          Generate a secure NOWPayments invoice. Supports BTC, ETH, USDT, USDC, SOL, and 200+ more.
                        </p>
                        {nowError && (
                          <p className="text-sm text-red-300 mb-4">{nowError}</p>
                        )}
                        <button
                          type="button"
                          onClick={generateInvoice}
                          disabled={nowLoading}
                          className="w-full rounded-full bg-brand-gold text-brand-forest font-semibold py-4 hover:bg-brand-gold/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          {nowLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to secure payment…
                            </>
                          ) : (
                            <>Generate Payment Invoice · {currency}{total.toFixed(2)}</>
                          )}
                        </button>
                        <p className="text-[11px] text-foreground/40 mt-4 text-center">
                          You'll be redirected to NOWPayments to complete payment, then sent back here.
                        </p>
                      </>
                    )}
                  </>

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
