import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Package, Search } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchOrder, fromMinor, type WooOrder } from "@/lib/woo";

export const Route = createFileRoute("/order-status")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : typeof search.id === "number" ? String(search.id) : "",
    key: typeof search.key === "string" ? search.key : "",
  }),
  head: () => ({
    meta: [
      { title: "Order status — Clarum" },
      { name: "description", content: "Look up your Clarum order — no account needed." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: OrderStatusPage,
});

const STATUS_TONE: Record<string, "amber" | "blue" | "gray" | "green"> = {
  "pending": "amber",
  "on-hold": "amber",
  "awaiting-payment": "amber",
  "processing": "blue",
  "shipped": "blue",
  "completed": "green",
  "cancelled": "gray",
  "refunded": "gray",
  "failed": "gray",
};

function statusLabel(s: string): string {
  return s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function OrderStatusPage() {
  const { id, key } = Route.useSearch();
  const [orderIdInput, setOrderIdInput] = useState(id ?? "");
  const [keyInput, setKeyInput] = useState(key ?? "");
  const [order, setOrder] = useState<WooOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !key) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const o = await fetchOrder(id, key);
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
  }, [id, key]);

  const onLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = orderIdInput.trim().replace(/^#/, "");
    const cleanKey = keyInput.trim();
    if (!cleanId || !cleanKey) {
      setError("Enter both your order number and order key.");
      return;
    }
    const params = new URLSearchParams({ id: cleanId, key: cleanKey });
    window.history.replaceState(null, "", `/order-status?${params.toString()}`);
    setError(null);
    setOrder(null);
    // trigger effect by mutating URL — but effect keys on search. Reload search:
    window.location.assign(`/order-status?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-brand-forest-deep text-foreground flex flex-col">
      <AnnouncementBar />
      <SiteHeader />
      <main className="flex-1 px-4 sm:px-8 py-10 sm:py-16">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <p className="text-xs tracking-[0.2em] text-brand-gold/80 uppercase">Guest order</p>
            <h1 className="font-display text-3xl sm:text-5xl mt-2">Track your order</h1>
            <p className="text-sm text-foreground/50 mt-2">
              Enter your order number and order key from your confirmation email.
            </p>
          </div>

          {!order && (
            <form onSubmit={onLookup} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-foreground/60 mb-1.5">Order number</label>
                <input
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="e.g. 12345"
                  inputMode="numeric"
                  className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2.5 text-foreground placeholder:text-foreground/30 focus:border-brand-gold/60 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-foreground/60 mb-1.5">Order key</label>
                <input
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="wc_order_..."
                  className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-sm text-foreground placeholder:text-foreground/30 focus:border-brand-gold/60 focus:outline-none"
                />
              </div>
              {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-forest-deep hover:bg-brand-gold/90 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Look up order
              </button>
              <p className="text-[12px] text-foreground/50 pt-2">
                Have an account?{" "}
                <Link to="/sign-in" className="text-brand-gold hover:underline">Sign in</Link>{" "}
                to see all your orders.
              </p>
            </form>
          )}

          {loading && order === null && id && key && (
            <div className="flex items-center gap-3 text-foreground/60 mt-4">
              <Loader2 className="h-4 w-4 animate-spin text-brand-gold" /> Loading order…
            </div>
          )}

          {order && <OrderCard order={order} />}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function OrderCard({ order }: { order: WooOrder }) {
  const currency = order.totals.currency_symbol ?? "$";
  const minor = order.totals.currency_minor_unit ?? 2;
  const subtotal = fromMinor(order.totals.total_items, minor);
  const shipping = fromMinor(order.totals.total_shipping, minor);
  const tax = fromMinor(order.totals.total_tax, minor);
  const total = fromMinor(order.totals.total_price, minor);
  const ship = order.shipping_address;
  const tone = STATUS_TONE[order.status?.toLowerCase()] ?? "gray";
  const toneCls = {
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    blue: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    gray: "bg-white/5 text-foreground/60 border-white/10",
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  }[tone];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Package className="h-4 w-4 text-brand-gold" />
              <span className="text-xs tracking-[0.2em] text-brand-gold/80 uppercase">
                Order #{order.number ?? order.id}
              </span>
            </div>
            <h2 className="font-display text-2xl mt-1">{statusLabel(order.status || "Pending")}</h2>
          </div>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${toneCls}`}>
            {statusLabel(order.status || "Pending")}
          </span>
        </div>

        <ul className="space-y-4 mb-6">
          {order.items.map((item) => {
            const lineTotal = fromMinor(item.totals.line_total, item.totals.currency_minor_unit);
            return (
              <li key={item.id} className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{item.name}</p>
                  <p className="text-xs text-foreground/50">Qty {item.quantity}</p>
                </div>
                <p className="text-sm text-foreground tabular-nums">
                  {currency}{lineTotal.toFixed(2)}
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
              {currency}{total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {ship && (ship.address_1 || ship.city) && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <h3 className="text-[11px] uppercase tracking-wider text-foreground/60 mb-3">Shipping address</h3>
          <address className="not-italic text-sm text-foreground/90 leading-relaxed">
            {(ship.first_name || ship.last_name) && (
              <>{ship.first_name} {ship.last_name}<br /></>
            )}
            {ship.company && <>{ship.company}<br /></>}
            {ship.address_1}<br />
            {ship.address_2 && <>{ship.address_2}<br /></>}
            {ship.city}{ship.state ? `, ${ship.state}` : ""} {ship.postcode}<br />
            {ship.country}
          </address>
        </div>
      )}

      <div className="flex items-center justify-center gap-3 pt-2">
        <Link to="/shop" className="rounded-full bg-brand-gold text-brand-forest-deep font-semibold px-6 py-2.5 hover:bg-brand-gold/90">
          Continue shopping
        </Link>
        <Link to="/contact" className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-foreground/80 hover:border-white/30">
          Contact support
        </Link>
      </div>
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
