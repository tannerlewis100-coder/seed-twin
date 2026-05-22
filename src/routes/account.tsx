import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut, Package, Ticket, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useClarumAuth } from "@/lib/clarum-auth";

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

  useEffect(() => {
    if (!loading && !token) {
      navigate({ to: "/sign-in" });
    }
  }, [loading, token, navigate]);

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
  const name =
    user.display_name ||
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.email;

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
            <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h2 className="font-display text-xl mb-5 flex items-center gap-2">
                <Package className="h-5 w-5 text-brand-gold" /> Recent orders
              </h2>
              {user.orders && user.orders.length > 0 ? (
                <ul className="divide-y divide-white/5">
                  {user.orders.map((o) => (
                    <li key={o.id} className="py-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-foreground">Order #{o.number ?? o.id}</p>
                        <p className="text-[12px] text-foreground/50">
                          {o.date_created ? new Date(o.date_created).toLocaleDateString() : ""}
                          {o.status ? ` · ${o.status}` : ""}
                        </p>
                        {o.items && o.items.length > 0 && (
                          <p className="text-[12px] text-foreground/60 mt-1">
                            {o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground">
                          {o.currency === "USD" ? "$" : (o.currency ?? "$")}
                          {o.total ?? "0.00"}
                        </p>
                        <Link
                          to="/order-confirmation/$orderId"
                          params={{ orderId: String(o.id) }}
                          className="text-[12px] text-brand-gold hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-10 text-center text-sm text-foreground/50">
                  No orders yet.{" "}
                  <Link to="/shop" className="text-brand-gold hover:underline">Browse the catalog →</Link>
                </div>
              )}
            </section>

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
