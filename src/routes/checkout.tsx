import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Lock, ShoppingBag } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCart } from "@/lib/cart";
import {
  fromMinor,
  gatewayLabel,
  submitCheckout,
  type WooAddress,
} from "@/lib/woo";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Checkout | CLARUM" },
      { name: "description", content: "Complete your research peptide order securely." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

type AddressForm = WooAddress;

const EMPTY_ADDRESS: AddressForm = {
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "US",
  phone: "",
};

function CheckoutPage() {
  const { items, subtotal, raw, loading: cartLoading } = useCart();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [billing, setBilling] = useState<AddressForm>(EMPTY_ADDRESS);
  const [shipSame, setShipSame] = useState(true);
  const [shipping, setShipping] = useState<AddressForm>(EMPTY_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gateways = raw?.payment_methods ?? [];

  useEffect(() => {
    if (!paymentMethod && gateways.length) setPaymentMethod(gateways[0]);
  }, [gateways, paymentMethod]);

  const currency = raw?.totals.currency_symbol ?? "$";
  const minor = raw?.totals.currency_minor_unit ?? 2;
  const shippingTotal = fromMinor(raw?.totals.total_shipping, minor);
  const taxTotal = fromMinor(raw?.totals.total_tax, minor);
  const total = fromMinor(raw?.totals.total_price, minor) || subtotal;

  const cartEmpty = !cartLoading && items.length === 0;

  function bindBilling<K extends keyof AddressForm>(k: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setBilling((b) => ({ ...b, [k]: e.target.value }));
  }
  function bindShipping<K extends keyof AddressForm>(k: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setShipping((b) => ({ ...b, [k]: e.target.value }));
  }

  function validate(): string | null {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email.";
    const req: Array<keyof AddressForm> = [
      "first_name",
      "last_name",
      "address_1",
      "city",
      "state",
      "postcode",
      "country",
      "phone",
    ];
    for (const k of req) {
      if (!String(billing[k] ?? "").trim()) return `Billing ${k.replace("_", " ")} is required.`;
    }
    if (!shipSame) {
      for (const k of req) {
        if (!String(shipping[k] ?? "").trim())
          return `Shipping ${k.replace("_", " ")} is required.`;
      }
    }
    if (!paymentMethod) return "Select a payment method.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSubmitting(true);
    try {
      const billingAddr: WooAddress = { ...billing, email };
      const shippingAddr: WooAddress = shipSame ? { ...billing } : { ...shipping };
      const res = await submitCheckout({
        billing_address: billingAddr,
        shipping_address: shippingAddr,
        payment_method: paymentMethod,
        payment_data: [],
        customer_note: note || undefined,
      });
      const result = res.payment_result;
      if (result?.payment_status === "success" || result?.payment_status === "pending") {
        if (result.redirect_url) {
          window.location.assign(result.redirect_url);
          return;
        }
        navigate({ to: "/order-confirmation/$orderId", params: { orderId: String(res.order_id) } });
        return;
      }
      setError(result?.message || "Payment could not be processed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-forest-deep text-foreground flex flex-col">
      <AnnouncementBar />
      <SiteHeader />

      <main className="flex-1 px-4 sm:px-8 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-xs tracking-[0.2em] text-brand-gold/80 uppercase mb-2">Checkout</p>
            <h1 className="font-display text-3xl sm:text-5xl text-foreground">Complete your order</h1>
            <p className="text-sm text-foreground/50 mt-2 flex items-center gap-2">
              <Lock className="h-3.5 w-3.5" /> Secure checkout. For in vitro laboratory research only.
            </p>
          </div>

          {cartEmpty ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <ShoppingBag className="h-10 w-10 text-foreground/30 mx-auto mb-4" />
              <p className="text-foreground/70">Your cart is empty.</p>
              <Link
                to="/shop"
                className="inline-block mt-6 rounded-full bg-brand-gold text-brand-forest font-semibold px-6 py-2.5 hover:bg-brand-gold/90"
              >
                Browse catalog
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12">
              {/* Left: form */}
              <div className="space-y-10">
                <Section title="Contact">
                  <Field label="Email" required>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                      required
                      autoComplete="email"
                    />
                  </Field>
                </Section>

                <Section title="Billing address">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="First name" required>
                      <input value={billing.first_name} onChange={bindBilling("first_name")} className={inputCls} autoComplete="given-name" />
                    </Field>
                    <Field label="Last name" required>
                      <input value={billing.last_name} onChange={bindBilling("last_name")} className={inputCls} autoComplete="family-name" />
                    </Field>
                    <Field label="Address" required className="sm:col-span-2">
                      <input value={billing.address_1} onChange={bindBilling("address_1")} className={inputCls} autoComplete="address-line1" />
                    </Field>
                    <Field label="Apartment, suite, etc. (optional)" className="sm:col-span-2">
                      <input value={billing.address_2 ?? ""} onChange={bindBilling("address_2")} className={inputCls} autoComplete="address-line2" />
                    </Field>
                    <Field label="City" required>
                      <input value={billing.city} onChange={bindBilling("city")} className={inputCls} autoComplete="address-level2" />
                    </Field>
                    <Field label="State" required>
                      <input value={billing.state} onChange={bindBilling("state")} className={inputCls} autoComplete="address-level1" placeholder="e.g. TX" />
                    </Field>
                    <Field label="Postcode" required>
                      <input value={billing.postcode} onChange={bindBilling("postcode")} className={inputCls} autoComplete="postal-code" />
                    </Field>
                    <Field label="Country" required>
                      <input value={billing.country} onChange={bindBilling("country")} className={inputCls} autoComplete="country" placeholder="US" maxLength={2} />
                    </Field>
                    <Field label="Phone" required className="sm:col-span-2">
                      <input type="tel" value={billing.phone ?? ""} onChange={bindBilling("phone")} className={inputCls} autoComplete="tel" />
                    </Field>
                  </div>
                </Section>

                <Section title="Shipping address">
                  <label className="flex items-center gap-3 text-sm text-foreground/80 mb-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shipSame}
                      onChange={(e) => setShipSame(e.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-white/5 accent-brand-gold"
                    />
                    Shipping address same as billing
                  </label>
                  {!shipSame && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="First name" required>
                        <input value={shipping.first_name} onChange={bindShipping("first_name")} className={inputCls} />
                      </Field>
                      <Field label="Last name" required>
                        <input value={shipping.last_name} onChange={bindShipping("last_name")} className={inputCls} />
                      </Field>
                      <Field label="Address" required className="sm:col-span-2">
                        <input value={shipping.address_1} onChange={bindShipping("address_1")} className={inputCls} />
                      </Field>
                      <Field label="Apartment, suite, etc. (optional)" className="sm:col-span-2">
                        <input value={shipping.address_2 ?? ""} onChange={bindShipping("address_2")} className={inputCls} />
                      </Field>
                      <Field label="City" required>
                        <input value={shipping.city} onChange={bindShipping("city")} className={inputCls} />
                      </Field>
                      <Field label="State" required>
                        <input value={shipping.state} onChange={bindShipping("state")} className={inputCls} />
                      </Field>
                      <Field label="Postcode" required>
                        <input value={shipping.postcode} onChange={bindShipping("postcode")} className={inputCls} />
                      </Field>
                      <Field label="Country" required>
                        <input value={shipping.country} onChange={bindShipping("country")} className={inputCls} maxLength={2} />
                      </Field>
                      <Field label="Phone" required className="sm:col-span-2">
                        <input type="tel" value={shipping.phone ?? ""} onChange={bindShipping("phone")} className={inputCls} />
                      </Field>
                    </div>
                  )}
                </Section>

                <Section title="Payment method">
                  {gateways.length === 0 ? (
                    <p className="text-sm text-foreground/50">
                      {cartLoading ? "Loading payment options…" : "No payment methods available."}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {gateways.map((g) => (
                        <label
                          key={g}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                            paymentMethod === g
                              ? "border-brand-gold/60 bg-brand-gold/5"
                              : "border-white/10 bg-white/[0.02] hover:border-white/20"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment_method"
                            value={g}
                            checked={paymentMethod === g}
                            onChange={() => setPaymentMethod(g)}
                            className="h-4 w-4 accent-brand-gold"
                          />
                          <span className="text-sm text-foreground">{gatewayLabel(g)}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </Section>

                <Section title="Order notes (optional)">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Special instructions for your order"
                    className={`${inputCls} resize-none`}
                  />
                </Section>

                {error && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || cartLoading || gateways.length === 0}
                  className="w-full rounded-full bg-brand-gold text-brand-forest font-semibold py-4 hover:bg-brand-gold/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Placing order…
                    </>
                  ) : (
                    <>Place order · {currency}{total.toFixed(2)}</>
                  )}
                </button>
              </div>

              {/* Right: order summary */}
              <aside className="lg:sticky lg:top-8 self-start">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <h2 className="font-display text-lg text-foreground mb-4">Order summary</h2>
                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.key} className="flex gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-14 w-14 object-contain rounded-lg bg-white/[0.03] border border-white/5 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{item.name}</p>
                          {item.size && (
                            <p className="text-[11px] text-foreground/50">{item.size}</p>
                          )}
                          <p className="text-[11px] text-foreground/50">Qty {item.qty}</p>
                        </div>
                        <p className="text-sm text-foreground whitespace-nowrap">
                          {currency}
                          {(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5 space-y-2 text-sm">
                    <Row label="Subtotal" value={`${currency}${subtotal.toFixed(2)}`} />
                    <Row
                      label="Shipping"
                      value={shippingTotal > 0 ? `${currency}${shippingTotal.toFixed(2)}` : "Calculated next"}
                    />
                    {taxTotal > 0 && (
                      <Row label="Tax" value={`${currency}${taxTotal.toFixed(2)}`} />
                    )}
                    <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-foreground/60">Total</span>
                      <span className="font-display text-2xl text-foreground">
                        {currency}
                        {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-foreground/40 text-center mt-3 px-2">
                  By placing this order, you confirm the products are for in vitro research only.
                </p>
              </aside>
            </form>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-brand-gold/60 focus:bg-white/[0.05] transition-colors";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl text-foreground mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="block text-xs text-foreground/60 mb-1.5">
        {label}
        {required && <span className="text-brand-gold/80"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-foreground/60">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
