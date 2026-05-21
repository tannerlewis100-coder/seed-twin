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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-body">
      <AnnouncementBar />
      <SiteHeader />

      <main className="flex-1 px-4 md:px-8 lg:px-12 py-16 lg:py-20">
        <div className="w-full max-w-6xl mx-auto">
          <header className="space-y-3 mb-12">
            <span className="text-[#D4A63A] text-xs font-medium tracking-[0.3em] uppercase">
              Checkout
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-tight text-white">
              Complete your order
            </h1>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Lock className="w-3.5 h-3.5" />
              <span className="font-light">
                Secure checkout. For in vitro laboratory research only.
              </span>
            </div>
          </header>

          {cartEmpty ? (
            <div className="bg-[#111111] border border-white/5 p-16 text-center">
              <ShoppingBag className="h-10 w-10 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">Your cart is empty.</p>
              <Link
                to="/shop"
                className="inline-block mt-6 rounded-full bg-[#D4A63A] text-black font-bold uppercase tracking-[0.2em] text-xs px-8 py-4 hover:bg-[#C1942E] transition-colors"
              >
                Browse catalog
              </Link>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-16"
            >
              {/* Left: form */}
              <div className="space-y-16">
                <SectionBlock number="1." title="Contact Information">
                  <Field label="Email Address">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="researcher@institute.edu"
                      className={inputCls}
                      autoComplete="email"
                      required
                    />
                  </Field>
                </SectionBlock>

                <SectionBlock number="2." title="Billing Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="First Name">
                      <input value={billing.first_name} onChange={bindBilling("first_name")} className={inputCls} autoComplete="given-name" />
                    </Field>
                    <Field label="Last Name">
                      <input value={billing.last_name} onChange={bindBilling("last_name")} className={inputCls} autoComplete="family-name" />
                    </Field>
                    <Field label="Address" className="md:col-span-2">
                      <input value={billing.address_1} onChange={bindBilling("address_1")} placeholder="Street address" className={inputCls} autoComplete="address-line1" />
                    </Field>
                    <Field label="Apartment, suite, etc. (optional)" className="md:col-span-2">
                      <input value={billing.address_2 ?? ""} onChange={bindBilling("address_2")} className={inputCls} autoComplete="address-line2" />
                    </Field>
                    <Field label="City">
                      <input value={billing.city} onChange={bindBilling("city")} className={inputCls} autoComplete="address-level2" />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="State">
                        <input value={billing.state} onChange={bindBilling("state")} className={inputCls} autoComplete="address-level1" placeholder="TX" />
                      </Field>
                      <Field label="Zip Code">
                        <input value={billing.postcode} onChange={bindBilling("postcode")} className={inputCls} autoComplete="postal-code" />
                      </Field>
                    </div>
                    <Field label="Country">
                      <input value={billing.country} onChange={bindBilling("country")} className={inputCls} autoComplete="country" placeholder="US" maxLength={2} />
                    </Field>
                    <Field label="Phone">
                      <input type="tel" value={billing.phone ?? ""} onChange={bindBilling("phone")} className={inputCls} autoComplete="tel" />
                    </Field>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group mt-6">
                    <span className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={shipSame}
                        onChange={(e) => setShipSame(e.target.checked)}
                        className="peer sr-only"
                      />
                      <span className="w-5 h-5 border border-white/20 bg-[#111111] peer-checked:bg-[#D4A63A] peer-checked:border-[#D4A63A] transition-all block" />
                      <svg
                        className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 left-1 transition-opacity pointer-events-none"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                      Shipping address is the same as billing
                    </span>
                  </label>

                  {!shipSame && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                      <Field label="First Name">
                        <input value={shipping.first_name} onChange={bindShipping("first_name")} className={inputCls} />
                      </Field>
                      <Field label="Last Name">
                        <input value={shipping.last_name} onChange={bindShipping("last_name")} className={inputCls} />
                      </Field>
                      <Field label="Address" className="md:col-span-2">
                        <input value={shipping.address_1} onChange={bindShipping("address_1")} className={inputCls} />
                      </Field>
                      <Field label="Apartment, suite, etc. (optional)" className="md:col-span-2">
                        <input value={shipping.address_2 ?? ""} onChange={bindShipping("address_2")} className={inputCls} />
                      </Field>
                      <Field label="City">
                        <input value={shipping.city} onChange={bindShipping("city")} className={inputCls} />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="State">
                          <input value={shipping.state} onChange={bindShipping("state")} className={inputCls} />
                        </Field>
                        <Field label="Zip Code">
                          <input value={shipping.postcode} onChange={bindShipping("postcode")} className={inputCls} />
                        </Field>
                      </div>
                      <Field label="Country">
                        <input value={shipping.country} onChange={bindShipping("country")} className={inputCls} maxLength={2} />
                      </Field>
                      <Field label="Phone">
                        <input type="tel" value={shipping.phone ?? ""} onChange={bindShipping("phone")} className={inputCls} />
                      </Field>
                    </div>
                  )}
                </SectionBlock>

                <SectionBlock number="3." title="Payment Method">
                  {gateways.length === 0 ? (
                    <p className="text-sm text-white/50">
                      {cartLoading ? "Loading payment options…" : "No payment methods available."}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {gateways.map((g) => {
                        const selected = paymentMethod === g;
                        return (
                          <label
                            key={g}
                            className={`flex items-center justify-between p-4 bg-[#111111] cursor-pointer transition-all ${
                              selected
                                ? "border border-[#D4A63A]/30"
                                : "border border-white/5 hover:border-white/20"
                            }`}
                          >
                            <span className="flex items-center gap-4">
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  selected ? "border-[#D4A63A]" : "border-white/20"
                                }`}
                              >
                                {selected && (
                                  <span className="w-2 h-2 rounded-full bg-[#D4A63A]" />
                                )}
                              </span>
                              <span className="text-sm font-medium text-white">
                                {gatewayLabel(g)}
                              </span>
                            </span>
                            <input
                              type="radio"
                              name="payment_method"
                              value={g}
                              checked={selected}
                              onChange={() => setPaymentMethod(g)}
                              className="sr-only"
                            />
                          </label>
                        );
                      })}
                    </div>
                  )}
                </SectionBlock>

                <section className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1 block">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    maxLength={500}
                    placeholder="Special instructions for delivery or research references..."
                    className={`${inputCls} resize-none`}
                  />
                </section>

                {error && (
                  <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}
              </div>

              {/* Right: sticky summary */}
              <aside className="lg:sticky lg:top-12 self-start">
                <div className="bg-[#111111] border border-white/5 p-8 space-y-8">
                  <h2 className="font-display text-2xl font-medium italic text-white">
                    Order Summary
                  </h2>

                  <div className="space-y-6 max-h-[360px] overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div key={item.key} className="flex gap-4">
                        <div className="relative w-20 h-20 bg-[#050505] border border-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="font-display text-[10px] text-white/30 italic">
                              {item.name.split(" ")[0]}
                            </span>
                          )}
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#D4A63A] text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                            {item.qty}
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col justify-center space-y-1 min-w-0">
                          <h3 className="text-sm font-medium leading-tight text-white truncate">
                            {item.name}
                          </h3>
                          {item.size && (
                            <p className="text-[10px] text-white/40 uppercase tracking-widest">
                              {item.size}
                            </p>
                          )}
                          <div className="flex justify-between items-end mt-1 gap-2">
                            <span className="text-xs text-white/60">
                              {currency}
                              {item.price.toFixed(2)} ea.
                            </span>
                            <span className="text-sm font-medium text-white whitespace-nowrap">
                              {currency}
                              {(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-3">
                    <SummaryRow label="Subtotal" value={`${currency}${subtotal.toFixed(2)}`} />
                    <SummaryRow
                      label="Insured Shipping"
                      value={
                        shippingTotal > 0
                          ? `${currency}${shippingTotal.toFixed(2)}`
                          : "Calculated next"
                      }
                    />
                    {taxTotal > 0 && (
                      <SummaryRow
                        label="Estimated Tax"
                        value={`${currency}${taxTotal.toFixed(2)}`}
                      />
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/10 flex justify-between items-baseline">
                    <span className="font-display text-lg font-light text-white">
                      Total
                    </span>
                    <div className="text-right">
                      <span className="text-xs text-white/30 block">USD</span>
                      <span className="font-display text-3xl font-light text-[#D4A63A]">
                        {currency}
                        {total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || cartLoading || gateways.length === 0}
                    className="w-full bg-[#D4A63A] hover:bg-[#C1942E] text-black text-sm font-bold uppercase tracking-[0.2em] py-5 rounded-full transition-all shadow-[0_10px_30px_-10px_rgba(212,166,58,0.3)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Placing order…
                      </>
                    ) : (
                      <>
                        Place Order · {currency}
                        {total.toFixed(2)}
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">
                    By placing this order, you confirm the products are for
                    <br />
                    in vitro research only.
                  </p>
                </div>
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
  "w-full bg-[#111111] border border-white/5 rounded-none px-4 py-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:ring-1 focus:ring-[#D4A63A] transition-all";

function SectionBlock({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <h2
        className="text-2xl font-medium border-b border-white/10 pb-4 text-white"
        className-marker
      >
        <span className="text-[#D4A63A] mr-2">{number}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block space-y-1.5 ${className ?? ""}`}>
      <span className="text-[10px] uppercase tracking-widest text-white/40 ml-1 block">
        {label}
      </span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-white/40">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
