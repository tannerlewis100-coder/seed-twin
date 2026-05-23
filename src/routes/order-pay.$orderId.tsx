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
  currency?: string;
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
  const [bank, setBank] = useState<BankInstructions | null>(null);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankError, setBankError] = useState<string | null>(null);
  const [bankPaid, setBankPaid] = useState(false);
  const [memoCopied, setMemoCopied] = useState(false);
  const [reportedAt, setReportedAt] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(`clarum_bt_reported_${orderId}`);
    } catch {
      return null;
    }
  });
  const [reporting, setReporting] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const bankFetchedRef = useRef(false);

  async function markTransferSent() {
    if (reporting || reportedAt) return;
    setReporting(true);
    setReportError(null);
    try {
      const res = await fetch(`${WP_BASE}/bank-transfer/mark-sent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: Number(orderId), key }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || `Failed (${res.status})`);
      }
      const ts = new Date().toISOString();
      setReportedAt(ts);
      try {
        localStorage.setItem(`clarum_bt_reported_${orderId}`, ts);
      } catch { /* ignore */ }
    } catch (e) {
      console.error("mark-sent failed", e);
      setReportError(e instanceof Error ? e.message : "Could not report transfer.");
    } finally {
      setReporting(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const o = await fetchOrder(orderId, key);
        if (!cancelled) {
          setOrder(o);
          if (!tabInitialized) {
            const pm = o.payment_method;
            setTab(
              pm === "clarum_bank_transfer"
                ? "bank"
                : pm === "nowpayments"
                ? "nowpayments"
                : "depay",
            );
            setTabInitialized(true);
          }
          if (o.needs_payment === false) setBankPaid(true);
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

  // Fetch bank transfer instructions (runs once per order)
  useEffect(() => {
    if (!order || !key) return;
    if (order.payment_method !== "clarum_bank_transfer") return;
    if (bankFetchedRef.current) return;
    bankFetchedRef.current = true;
    setBankLoading(true);
    setBankError(null);
    (async () => {
      try {
        const url = `${WP_BASE}/bank-transfer/instructions?order_id=${encodeURIComponent(orderId)}&key=${encodeURIComponent(key)}`;
        const res = await fetch(url);
        const text = await res.text();
        let data: any = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch (parseErr) {
          console.error("Bank instructions: non-JSON response", { status: res.status, text, parseErr });
          throw new Error("Invalid response from bank instructions endpoint.");
        }
        if (!res.ok) {
          console.error("Bank instructions error response", { status: res.status, data });
          throw new Error(data?.message || `Bank instructions failed (${res.status})`);
        }
        console.info("Bank instructions loaded", data);
        setBank(data as BankInstructions);
      } catch (e) {
        console.error("Bank instructions fetch failed", e);
        setBankError(e instanceof Error ? e.message : "Could not load bank instructions.");
        bankFetchedRef.current = false; // allow retry on remount
      } finally {
        setBankLoading(false);
      }
    })();
  }, [order, key, orderId]);

  // Poll order status every 30s for bank transfer
  useEffect(() => {
    if (!order || !key || bankPaid) return;
    if (order.payment_method !== "clarum_bank_transfer") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${WP_BASE}/order/${encodeURIComponent(orderId)}?key=${encodeURIComponent(key)}`,
        );
        const data = await res.json().catch(() => ({}));
        if (data?.is_paid === true || data?.needs_payment === false) {
          setBankPaid(true);
          clearInterval(interval);
        }
      } catch (e) {
        console.error("Bank status poll failed", e);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [order, key, orderId, bankPaid]);


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
                    ) : tab === "nowpayments" ? (
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
                    ) : (
                      <BankTransferPanel
                        bank={bank}
                        loading={bankLoading}
                        error={bankError}
                        paid={bankPaid}
                        currency={currency}
                        total={total}
                        memoCopied={memoCopied}
                        onCopyMemo={() => {
                          if (!bank?.memo) return;
                          navigator.clipboard?.writeText(bank.memo).then(
                            () => {
                              setMemoCopied(true);
                              setTimeout(() => setMemoCopied(false), 2000);
                            },
                            () => {/* ignore */},
                          );
                        }}
                      />
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

function BankTransferPanel({
  bank,
  loading,
  error,
  paid,
  currency,
  total,
  memoCopied,
  onCopyMemo,
}: {
  bank: BankInstructions | null;
  loading: boolean;
  error: string | null;
  paid: boolean;
  currency: string;
  total: number;
  memoCopied: boolean;
  onCopyMemo: () => void;
}) {
  if (paid) {
    return (
      <>
        <h2 className="font-display text-2xl text-foreground mb-1 flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-emerald-400" /> Payment received
        </h2>
        <p className="text-sm text-foreground/70">
          We've matched your bank transfer to this order. A confirmation email is on its way.
        </p>
      </>
    );
  }

  if (loading && !bank) {
    return (
      <p className="text-sm text-foreground/60 flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading bank instructions…
      </p>
    );
  }

  if (error) {
    return <p className="text-sm text-red-300">{error}</p>;
  }

  if (!bank) return null;

  const amountNum =
    typeof bank.amount === "number"
      ? bank.amount
      : bank.amount != null
      ? Number(bank.amount)
      : total;
  const amountDisplay = `${currency}${(Number.isFinite(amountNum) ? amountNum : total).toFixed(2)} ${bank.currency ?? "USD"}`;

  return (
    <>
      <h2 className="font-display text-2xl text-foreground mb-1">Bank Transfer (ACH / Wire)</h2>
      <p className="text-sm text-foreground/50 mb-6">
        Send the exact amount below from your bank. Settlement typically takes 1–3 business days.
      </p>

      <dl className="rounded-xl border border-white/10 bg-white/[0.02] divide-y divide-white/5 mb-5">
        <InstructionRow label="Bank" value={bank.bank} />
        <InstructionRow label="Routing" value={bank.routing} mono />
        <InstructionRow label="Account" value={bank.account} mono />
        <InstructionRow label="Beneficiary" value={bank.beneficiary} />
        {bank.address && <InstructionRow label="Address" value={bank.address} />}
        <InstructionRow label="Amount" value={amountDisplay} highlight />
      </dl>

      {bank.memo && (
        <div className="rounded-xl border border-brand-gold/40 bg-brand-gold/5 p-5 mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-gold/80 mb-2">
            Memo (Required)
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <code className="font-mono text-2xl sm:text-3xl font-bold text-foreground tracking-wider break-all">
              {bank.memo}
            </code>
            <button
              type="button"
              onClick={onCopyMemo}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold text-brand-forest font-semibold px-4 py-2 text-sm hover:bg-brand-gold/90"
            >
              {memoCopied ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-red-300/90 mt-3">
            Must include this exact memo or payment won't be matched.
          </p>
        </div>
      )}

      <p className="text-[11px] text-foreground/40 text-center flex items-center justify-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin" /> Waiting for payment. This page auto-updates every 30 seconds.
      </p>
    </>
  );
}

function InstructionRow({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-xs uppercase tracking-[0.15em] text-foreground/50">{label}</span>
      <span
        className={`text-right ${mono ? "font-mono" : ""} ${
          highlight ? "text-brand-gold font-display text-lg" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

