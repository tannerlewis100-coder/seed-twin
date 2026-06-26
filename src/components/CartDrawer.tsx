import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCart } from "@/lib/cart";
import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { applyCoupon, removeCoupon } from "@/lib/woo";

const FREE_SHIPPING_THRESHOLD = 150;
const CRYPTO_COUPON = "CRYPTO5";

export function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, updateQty, removeItem, loading, raw, refresh } = useCart();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const appliedCoupons = (((raw as unknown as { coupons?: Array<{ code?: string }> })?.coupons) ?? [])
    .map((c) => c?.code)
    .filter((c): c is string => !!c)
    .filter((c) => c.toUpperCase() !== CRYPTO_COUPON);

  const minor = raw?.totals.currency_minor_unit ?? 2;
  const div = Math.pow(10, minor);
  const discount = raw?.totals.total_discount ? Number(raw.totals.total_discount) / div : 0;
  const total = raw?.totals.total_price ? Number(raw.totals.total_price) / div : subtotal;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const discountLabel = appliedCoupons.join(", ");

  async function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code || couponBusy) return;
    setCouponBusy(true);
    setCouponError(null);
    try {
      await applyCoupon(code);
      await refresh();
      setCouponInput("");
    } catch {
      setCouponError("That code isn't valid");
    } finally {
      setCouponBusy(false);
    }
  }

  async function handleRemoveCoupon(code: string) {
    if (couponBusy) return;
    setCouponBusy(true);
    setCouponError(null);
    try {
      await removeCoupon(code);
      await refresh();
    } catch {
      /* ignore */
    } finally {
      setCouponBusy(false);
    }
  }

  function onCheckout() {
    if (!items.length) return;
    closeCart();
    navigate({ to: "/checkout" });
  }

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
  const unlocked = discountedSubtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent className="bg-brand-forest-deep border-white/10 text-foreground flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-white/5">
          <SheetTitle className="font-display text-xl text-foreground">Your Cart</SheetTitle>
          <SheetDescription className="sr-only">
            Review the items in your cart, adjust quantities, and continue to checkout.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-3">
            <ShoppingBag className="h-10 w-10 text-foreground/30" />
            <p className="text-sm text-foreground/60">Cart is empty.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.map((item) => (
              <div key={item.key} className="flex gap-4 pb-4 border-b border-white/5">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 object-contain rounded-lg bg-white/[0.03] border border-white/5 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base text-foreground leading-tight truncate">
                    {item.name}
                  </p>
                  {item.size && (
                    <p className="text-xs text-foreground/50 mt-1">{item.size}</p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQty(item.key, item.qty - 1)}
                      disabled={loading}
                      className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-white/30 disabled:opacity-40"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm w-6 text-center">{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(item.key, item.qty + 1)}
                      disabled={loading}
                      className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-white/30 disabled:opacity-40"
                      aria-label="Increase"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      disabled={loading}
                      className="ml-auto text-foreground/40 hover:text-red-400 disabled:opacity-40"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                  <p className="text-[11px] text-foreground/40 mt-0.5">${item.price.toFixed(2)} ea</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t border-white/5 px-6 py-5 space-y-4">
            <div className="flex items-start gap-2.5 rounded-lg border border-brand-gold/30 bg-brand-gold/[0.07] px-3 py-2.5">
              <span aria-hidden className="text-base leading-none mt-0.5">🎁</span>
              <p className="text-[12px] leading-snug text-brand-gold/90">
                <span className="font-semibold text-brand-gold">Free BAC Water (3ml)</span>
                <span className="text-foreground/60"> — included with every order, added automatically at checkout.</span>
              </p>
            </div>
            <div className="space-y-2">
              {appliedCoupons.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {appliedCoupons.map((code) => (
                    <span
                      key={code}
                      className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-2.5 py-1 text-[11px] text-brand-gold"
                    >
                      {code}
                      <button
                        type="button"
                        onClick={() => handleRemoveCoupon(code)}
                        disabled={couponBusy}
                        aria-label={`Remove coupon ${code}`}
                        className="hover:text-foreground disabled:opacity-50"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    if (couponError) setCouponError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyCoupon();
                    }
                  }}
                  placeholder="Promo code"
                  aria-label="Promo code"
                  className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-brand-gold/60"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponBusy || !couponInput.trim()}
                  className="rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-foreground hover:border-brand-gold/60 hover:text-brand-gold transition-colors disabled:opacity-50"
                >
                  {couponBusy ? "…" : "Apply"}
                </button>
              </div>
              {couponError && <p className="text-xs text-red-400">{couponError}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/60">Subtotal</span>
                <span className="text-sm text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-gold/90">
                    Discount{discountLabel ? ` (${discountLabel})` : ""}
                  </span>
                  <span className="text-brand-gold">−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground/50">Shipping</span>
                <span className="text-foreground/50">Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-sm text-foreground/60">Total</span>
                <span className="font-display text-2xl text-foreground">${total.toFixed(2)}</span>
              </div>
            </div>
            <div
              className={`text-[11px] ${
                unlocked ? "text-emerald-400" : "text-brand-gold/80"
              }`}
            >
              {unlocked
                ? "✓ Free shipping unlocked"
                : `You're $${remaining.toFixed(2)} away from free shipping`}
            </div>
            <button
              type="button"
              onClick={onCheckout}
              disabled={loading}
              className="w-full rounded-full bg-brand-gold text-brand-forest font-semibold py-3.5 hover:bg-brand-gold/90 transition-colors disabled:opacity-60"
            >
              {loading ? "Updating…" : "Checkout"}
            </button>
            <p className="text-[11px] text-foreground/40 text-center">
              For in vitro laboratory research only. Not for human or veterinary use.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
