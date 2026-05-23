import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Package, Copy, ArrowRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useClarumAuth } from "@/lib/clarum-auth";

export const Route = createFileRoute("/account/orders")({
  head: () => ({
    meta: [
      { title: "Your Orders — Clarum" },
      { name: "description", content: "All your Clarum orders: awaiting payment, active, and past." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: OrdersPage,
});

type OrderRow = {
  id: number;
  key?: string;
  status?: string;
  total?: string | number;
  currency?: string;
  payment_method?: string;
  payment_label?: string;
  memo?: string | null;
  items_preview?: string | Array<{ qty?: number; quantity?: number; name?: string } | string>;
  date?: string;
  bt_user_reported?: boolean;
};

type OrdersResponse = {
  awaiting: OrderRow[];
  active: OrderRow[];
  past: OrderRow[];
  counts?: { awaiting?: number; active?: number; past?: number; total?: number };
};

const API_BASE = "https://admin.clarumpeptides.com/wp-json";

function relativeTime(date?: string): string {
  if (!date) return "";
  const t = new Date(date).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const d = Math.round(hr / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  const mo = Math.round(d / 30);
  if (mo < 12) return `${mo} month${mo === 1 ? "" : "s"} ago`;
  return new Date(date).toLocaleDateString();
}

function fmtMoney(total?: string | number, currency?: string): string {
  const n = typeof total === "string" ? parseFloat(total) : total ?? 0;
  const sym = (currency ?? "USD") === "USD" ? "$" : `${currency} `;
  return `${sym}${(n || 0).toFixed(2)}`;
}

function formatItemsPreview(
  preview?: string | Array<{ qty?: number; quantity?: number; name?: string } | string>
): string {
  if (!preview) return "—";
  if (typeof preview === "string") return preview;
  const parts = preview
    .map((it) => {
      if (typeof it === "string") return it;
      const qty = it.qty ?? it.quantity;
      const name = it.name ?? "";
      if (!name) return "";
      return qty && qty > 1 ? `${qty}× ${name}` : `1× ${name}`;
    })
    .filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
}


function OrdersPage() {
  const { token, loading: authLoading } = useClarumAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !token) {
      navigate({ to: "/sign-in" });
    }
  }, [authLoading, token, navigate]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/clarum/v1/me/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.message || `Request failed (${res.status})`);
        if (!cancelled) setData(json as OrdersResponse);
      } catch (err) {
        console.error("[orders] fetch failed", err);
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (authLoading || (loading && !data)) {
    return (
      <div className="min-h-screen bg-brand-forest-deep text-foreground flex flex-col">
        <AnnouncementBar />
        <SiteHeader />
        <main className="flex-1 grid place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand-gold" />
        </main>
        <SiteFooter />
      </div>
    );
  }

  const awaiting = data?.awaiting ?? [];
  const active = data?.active ?? [];
  const past = data?.past ?? [];
  const total = (data?.counts?.total ?? awaiting.length + active.length + past.length) || 0;

  return (
    <div className="min-h-screen bg-brand-forest-deep text-foreground flex flex-col">
      <AnnouncementBar />
      <SiteHeader />

      <main className="flex-1 px-4 sm:px-8 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <Link to="/account" className="text-xs tracking-[0.2em] text-brand-gold/80 uppercase hover:text-brand-gold">
              ← Account
            </Link>
            <h1 className="font-display text-3xl sm:text-5xl mt-2">Your orders</h1>
            <p className="text-sm text-foreground/50 mt-2">
              {total === 0 ? "No orders yet." : `${total} order${total === 1 ? "" : "s"} total.`}
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {total === 0 && !error ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <Package className="h-10 w-10 text-brand-gold/60 mx-auto mb-4" />
              <p className="text-foreground/70">No orders yet.</p>
              <Link to="/shop" className="inline-block mt-3 text-brand-gold hover:underline">
                Browse the catalog →
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {awaiting.length > 0 && (
                <Section title="Awaiting payment" count={awaiting.length}>
                  {awaiting.map((o) => (
                    <AwaitingCard key={o.id} order={o} />
                  ))}
                </Section>
              )}
              {active.length > 0 && (
                <Section title="Active orders" count={active.length}>
                  {active.map((o) => (
                    <ActiveCard key={o.id} order={o} />
                  ))}
                </Section>
              )}
              {past.length > 0 && (
                <Section title="Past orders" count={past.length}>
                  {past.map((o) => (
                    <PastCard key={o.id} order={o} />
                  ))}
                </Section>
              )}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl mb-4 flex items-baseline gap-2">
        {title}
        <span className="text-xs text-foreground/40 font-sans">({count})</span>
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function StatusPill({
  tone,
  children,
}: {
  tone: "amber" | "blue" | "gray" | "green";
  children: React.ReactNode;
}) {
  const styles = {
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    blue: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    gray: "bg-white/5 text-foreground/60 border-white/10",
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  }[tone];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${styles}`}>
      {children}
    </span>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      {children}
    </div>
  );
}

function OrderMeta({ order }: { order: OrderRow }) {
  return (
    <div className="text-[12px] text-foreground/50 mt-1">
      Order #{order.id}
      {order.date ? ` · ${relativeTime(order.date)}` : ""}
      {order.payment_label ? ` · ${order.payment_label}` : ""}
    </div>
  );
}

function AwaitingCard({ order }: { order: OrderRow }) {
  const isBank = order.payment_method === "clarum_bank_transfer";
  const copyMemo = async () => {
    if (!order.memo) return;
    try {
      await navigator.clipboard.writeText(order.memo);
      toast.success("Memo copied");
    } catch {
      toast.error(`Memo: ${order.memo}`);
    }
  };
  return (
    <CardShell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill tone="amber">Awaiting payment</StatusPill>
            {order.bt_user_reported === true && (
              <StatusPill tone="green">✓ Reported</StatusPill>
            )}
          </div>
          <p className="text-sm text-foreground mt-2 truncate">{order.items_preview || "—"}</p>
          <OrderMeta order={order} />
          {isBank && order.memo && (
            <div className="mt-3">
              <div className="text-[11px] uppercase tracking-wider text-foreground/50 mb-1">Memo (required)</div>
              <button
                onClick={copyMemo}
                className="group inline-flex items-center gap-2 rounded-md border-2 border-dashed border-brand-gold/60 bg-brand-gold/5 px-3 py-2 font-mono font-bold text-foreground hover:bg-brand-gold/10"
              >
                {order.memo}
                <Copy className="h-3.5 w-3.5 text-foreground/50 group-hover:text-foreground" />
              </button>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="font-display text-lg">{fmtMoney(order.total, order.currency)}</p>
          {order.key && (
            <a
              href={`/order-pay/${order.id}?key=${encodeURIComponent(order.key)}`}
              className="mt-3 inline-flex items-center gap-1 rounded-full bg-brand-gold px-4 py-2 text-xs font-semibold text-brand-forest-deep hover:bg-brand-gold/90"
            >
              View payment instructions <ArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </CardShell>
  );
}

function ActiveCard({ order }: { order: OrderRow }) {
  return (
    <CardShell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <StatusPill tone="blue">{order.status || "Processing"}</StatusPill>
          <p className="text-sm text-foreground mt-2 truncate">{order.items_preview || "—"}</p>
          <OrderMeta order={order} />
        </div>
        <div className="text-right">
          <p className="font-display text-lg">{fmtMoney(order.total, order.currency)}</p>
          <Link
            to="/order-confirmation/$orderId"
            params={{ orderId: String(order.id) }}
            className="mt-2 inline-block text-[12px] text-brand-gold hover:underline"
          >
            View details →
          </Link>
        </div>
      </div>
    </CardShell>
  );
}

function PastCard({ order }: { order: OrderRow }) {
  const isCompleted = (order.status || "").toLowerCase() === "completed";
  return (
    <CardShell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <StatusPill tone={isCompleted ? "green" : "gray"}>{order.status || "Closed"}</StatusPill>
          <p className="text-sm text-foreground mt-2 truncate">{order.items_preview || "—"}</p>
          <OrderMeta order={order} />
        </div>
        <div className="text-right">
          <p className="font-display text-lg">{fmtMoney(order.total, order.currency)}</p>
          <Link
            to="/shop"
            className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-foreground/80 hover:border-brand-gold/60 hover:text-brand-gold"
          >
            <RotateCcw className="h-3 w-3" /> Reorder
          </Link>
        </div>
      </div>
    </CardShell>
  );
}
