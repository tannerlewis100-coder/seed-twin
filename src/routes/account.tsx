import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut, Package, Ticket, Check, Copy, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useClarumAuth } from "@/lib/clarum-auth";

type RecentOrder = {
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
};

type OrdersResponse = {
  awaiting?: RecentOrder[];
  active?: RecentOrder[];
  past?: RecentOrder[];
  counts?: { awaiting?: number; active?: number; past?: number; total?: number };
};

const ORDERS_API = "https://admin.clarumpeptides.com/wp-json/clarum/v1/me/orders";

function relativeTime(date?: string): string {
  if (!date) return "";
  const t = new Date(date).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return hr < 6 ? `${hr} hour${hr === 1 ? "" : "s"} ago` : "Today";
  const d = Math.round(hr / 24);
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d} days ago`;
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


function statusTone(status?: string, paymentMethod?: string, isAwaiting?: boolean): {
  tone: "amber" | "blue" | "green" | "gray";
  label: string;
} {
  const s = (status || "").toLowerCase();
  if (isAwaiting || s === "pending" || s === "on-hold" || s === "awaiting-payment") {
    return { tone: "amber", label: "Awaiting Payment" };
  }
  if (s === "completed") return { tone: "green", label: "Completed" };
  if (s === "cancelled" || s === "failed" || s === "refunded") {
    return { tone: "gray", label: status ? status[0].toUpperCase() + status.slice(1) : "Closed" };
  }
  if (s === "processing" || s === "shipped" || s === "in-transit") {
    return { tone: "blue", label: status ? status[0].toUpperCase() + status.slice(1) : "Processing" };
  }
  void paymentMethod;
  return { tone: "blue", label: status || "Processing" };
}

function pillClasses(tone: "amber" | "blue" | "green" | "gray"): string {
  const styles = {
    amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    blue: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    gray: "bg-white/5 text-foreground/60 border-white/10",
    green: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  } as const;
  return `inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${styles[tone]}`;
}


export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your Account — Clarum" },
      { name: "description", content: "Your Clarum account: orders, welcome coupon, and account info." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, loading, signOut, token } = useClarumAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrdersResponse | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);


  useEffect(() => {
    if (!loading && !token) {
      navigate({ to: "/sign-in" });
    }
  }, [loading, token, navigate]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setOrdersLoading(true);
      setOrdersError(null);
      try {
        const res = await fetch(ORDERS_API, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.message || `Request failed (${res.status})`);
        if (!cancelled) setOrders(json as OrdersResponse);
      } catch (err) {
        console.error("[account/orders] fetch failed", err);
        if (!cancelled) setOrdersError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);


  if (loading || !user) {
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

  const coupon = user.welcome_coupon;
  const couponUsed = coupon?.used === true;
  const greeting = user.first_name || user.display_name || user.email;


  const copyCoupon = async () => {
    if (!coupon?.code) return;
    try {
      await navigator.clipboard.writeText(coupon.code);
      toast.success(`Copied ${coupon.code}`);
    } catch {
      toast.error(`Code is ${coupon.code}`);
    }
  };

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-brand-forest-deep text-foreground flex flex-col">
      <AnnouncementBar />
      <SiteHeader />

      <main className="flex-1 px-4 sm:px-8 py-10 sm:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs tracking-[0.2em] text-brand-gold/80 uppercase mb-2">Your account</p>
              <h1 className="font-display text-3xl sm:text-5xl">Hi, {name}.</h1>
              <p className="text-sm text-foreground/50 mt-2">{user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-foreground/80 hover:border-brand-gold/60 hover:text-brand-gold transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>

          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            {/* Orders */}
            <RecentOrdersSection
              loading={ordersLoading}
              error={ordersError}
              data={orders}
            />


            {/* Welcome coupon + account */}
            <aside className="space-y-6">
              <div className="rounded-2xl border border-brand-gold/30 bg-brand-gold/[0.06] p-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">
                  <Ticket className="h-3.5 w-3.5" /> Welcome coupon
                </div>
                {coupon?.code ? (
                  couponUsed ? (
                    <>
                      <div className="mt-3 flex items-center gap-2 text-sm text-foreground/70">
                        <Check className="h-4 w-4 text-brand-gold" /> Already used. Thanks for the order.
                      </div>
                      <div className="mt-2 font-mono text-foreground/40 line-through">{coupon.code}</div>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-foreground/70 mt-2">
                        10% off your first order. Applied automatically at checkout.
                      </p>
                      <button
                        onClick={copyCoupon}
                        className="mt-3 w-full group rounded-md border-2 border-dashed border-brand-gold/60 bg-brand-gold/5 px-4 py-3 font-mono tracking-[0.2em] text-foreground hover:bg-brand-gold/10 inline-flex items-center justify-center gap-2"
                      >
                        {coupon.code}
                        <Copy className="h-3.5 w-3.5 text-foreground/50 group-hover:text-foreground" />
                      </button>
                    </>
                  )
                ) : (
                  <p className="text-sm text-foreground/70 mt-2">
                    No welcome coupon on file.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="font-display text-lg mb-3">Account info</h3>
                <dl className="space-y-2 text-sm">
                  <Row label="Name" value={[user.first_name, user.last_name].filter(Boolean).join(" ") || "—"} />
                  <Row label="Email" value={user.email} />
                  <Row
                    label="Newsletter"
                    value={user.marketing_opt_in ? "Subscribed" : "Not subscribed"}
                  />
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-foreground/50">{label}</dt>
      <dd className="text-foreground text-right truncate">{value}</dd>
    </div>
  );
}

function RecentOrdersSection({
  loading,
  error,
  data,
}: {
  loading: boolean;
  error: string | null;
  data: OrdersResponse | null;
}) {
  const awaiting = data?.awaiting ?? [];
  const active = data?.active ?? [];
  const past = data?.past ?? [];
  const total =
    data?.counts?.total ?? awaiting.length + active.length + past.length;

  const top3: RecentOrder[] = [...awaiting, ...active, ...past].slice(0, 3);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-xl flex items-center gap-2">
          <Package className="h-5 w-5 text-brand-gold" /> Recent orders
          {total > 0 && (
            <span className="text-xs text-foreground/40 font-sans">({total})</span>
          )}
        </h2>
        {total > 0 && (
          <Link to="/account/orders" className="text-[12px] text-brand-gold hover:underline">
            View all orders →
          </Link>
        )}
      </div>

      {loading ? (
        <div className="py-10 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-brand-gold/60" />
        </div>
      ) : error ? (
        <div className="py-6 text-center text-sm text-destructive/80">{error}</div>
      ) : total === 0 ? (
        <div className="py-10 text-center text-sm text-foreground/50">
          No orders yet.{" "}
          <Link to="/shop" className="text-brand-gold hover:underline">Browse the catalog →</Link>
        </div>
      ) : (
        <ul className="divide-y divide-white/5">
          {top3.map((o) => {
            const isAwaiting = awaiting.some((a) => a.id === o.id);
            const { tone, label } = statusTone(o.status, o.payment_method, isAwaiting);
            const itemsText = formatItemsPreview(o.items_preview);

            const isBank = o.payment_method === "clarum_bank_transfer";
            return (
              <li key={o.id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className={pillClasses(tone)}>{label}</span>
                    <p className="text-sm text-foreground mt-2 truncate">{itemsText}</p>
                    <p className="text-[12px] text-foreground/50 mt-1">
                      {o.date ? relativeTime(o.date) : ""}
                    </p>

                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-foreground">{fmtMoney(o.total, o.currency)}</p>
                  </div>
                </div>

                {isAwaiting && o.key && (
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {isBank && o.memo && (
                      <span className="font-mono text-[12px] font-bold text-brand-gold tracking-wider">
                        {o.memo}
                      </span>
                    )}
                    <a
                      href={`/order-pay/${o.id}?key=${encodeURIComponent(o.key)}`}
                      className="inline-flex items-center gap-1 text-[12px] text-brand-gold hover:underline"
                    >
                      {isBank ? "View payment details" : "Complete payment"} <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
