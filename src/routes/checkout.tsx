import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Lock, ShoppingBag } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCart } from "@/lib/cart";
import {
  applyCoupon,
  clearCartToken,
  fromMinor,
  gatewayLabel,
  removeCoupon,
  selectShippingRate,
  submitCheckout,
  updateCustomer,
  type WooAddress,
} from "@/lib/woo";
import { useClarumAuth } from "@/lib/clarum-auth";
import { StripeAttestlyPanel, useAttestlyConfig } from "@/components/StripeAttestlyPanel";

const STRIPE_VIRTUAL = "stripe_attestly_virtual";


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

type ShippingRate = {
  rate_id: string;
  name: string;
  price: string;
  currency_minor_unit: number;
  selected: boolean;
};

function CheckoutPage() {
  const { items, subtotal, raw, loading: cartLoading, refresh } = useCart();
  const { user: clarumUser } = useClarumAuth();
  

  const [email, setEmail] = useState("");
  const [billing, setBilling] = useState<AddressForm>(EMPTY_ADDRESS);
  const [shipSame, setShipSame] = useState(true);
  const [shipping, setShipping] = useState<AddressForm>(EMPTY_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { config: attestlyConfig } = useAttestlyConfig();
  const stripeReady = !!(
    attestlyConfig?.paymentsEnabled &&
    attestlyConfig.publishableKey &&
    attestlyConfig.stripeAccountId
  );
  const [stripeSession, setStripeSession] = useState<{
    orderId: number;
    orderKey: string;
    clientSecret: string;
    paymentIntentId: string;
    amountCents: number;
  } | null>(null);

  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRateId, setSelectedRateId] = useState<string>("");
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState<string | null>(null);

  const [couponInput, setCouponInput] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const CRYPTO_COUPON = "CRYPTO5";
  const isCryptoMethod = (m: string) => m === "depay_wc_payments" || m === "nowpayments";

  const allAppliedCoupons = ((raw as unknown as { coupons?: Array<{ code?: string }> })?.coupons ?? [])
    .map((c) => c?.code)
    .filter((c): c is string => !!c);
  // Hide CRYPTO5 from any user-visible chips/lists.
  const appliedCoupons = allAppliedCoupons.filter(
    (c) => c.toUpperCase() !== CRYPTO_COUPON,
  );
  const cryptoCouponApplied = allAppliedCoupons.some(
    (c) => c.toUpperCase() === CRYPTO_COUPON,
  );


  async function handleApplyCoupon(e?: React.FormEvent | React.MouseEvent) {
    if (e) e.preventDefault();
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

  const baseGateways = raw?.payment_methods ?? [];
  const withNow = baseGateways.includes("nowpayments")
    ? baseGateways
    : [...baseGateways, "nowpayments"];
  const withBank = withNow.includes("clarum_bank_transfer")
    ? withNow
    : [...withNow, "clarum_bank_transfer"];
  // Quiklie is retired — Attestly/Stripe is the card processor.
  const withoutQuiklie = withBank.filter((g) => g !== "quiklie");
  // Surface the Attestly/Stripe card option only when the hub is configured.
  const gateways = useMemo(() => {
    if (!stripeReady) return withoutQuiklie.filter((g) => g !== STRIPE_VIRTUAL);
    return withoutQuiklie.includes(STRIPE_VIRTUAL)
      ? withoutQuiklie
      : [STRIPE_VIRTUAL, ...withoutQuiklie];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withoutQuiklie.join("|"), stripeReady]);
  const needsShipping = raw?.needs_shipping ?? true;

  // Resolve the real Woo gateway slug we send when the virtual Stripe option is selected.
  const stripeWooSlug = useMemo(() => {
    const candidates = ["stripe", "stripe_cc", "woocommerce_payments", "attestly"];
    return candidates.find((g) => baseGateways.includes(g)) ?? baseGateways[0] ?? "stripe";
  }, [baseGateways]);

  useEffect(() => {
    if (paymentMethod || !gateways.length) return;
    // Prefer the Attestly card option, otherwise first available gateway.
    const preferred = gateways.includes(STRIPE_VIRTUAL) ? STRIPE_VIRTUAL : gateways[0];
    setPaymentMethod(preferred);
  }, [gateways, paymentMethod]);



  // Auto-fill from logged-in Clarum account
  useEffect(() => {
    if (!clarumUser) return;
    setEmail((prev) => prev || clarumUser.email || "");
    setBilling((prev) => ({
      ...prev,
      first_name: prev.first_name || clarumUser.first_name || "",
      last_name: prev.last_name || clarumUser.last_name || "",
    }));
  }, [clarumUser]);

  // Auto-apply unused welcome coupon once per cart session.
  // Woo's coupon engine validates against billing_address.email in the cart
  // session, so we must push the user's email to the cart BEFORE applying.
  useEffect(() => {
    if (!clarumUser?.welcome_coupon?.code) return;
    if (clarumUser.welcome_coupon.used) return;
    if (cartLoading || items.length === 0) return;
    const code = clarumUser.welcome_coupon.code;
    const applied = ((raw as unknown as { coupons?: Array<{ code?: string }> })?.coupons ?? []).some(
      (c) => c?.code?.toLowerCase() === code.toLowerCase(),
    );
    if (applied) return;
    const key = `clarum_coupon_applied_${code}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    (async () => {
      try {
        await updateCustomer({
          billing_address: {
            first_name: clarumUser.first_name || "",
            last_name: clarumUser.last_name || "",
            address_1: "",
            city: "",
            state: "",
            postcode: "",
            country: "US",
            email: clarumUser.email,
          } as WooAddress,
        });
      } catch {
        /* non-fatal — try the coupon anyway */
      }
      try {
        await applyCoupon(code);
        await refresh();
      } catch {
        // silent — coupon might already be used server-side
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clarumUser, cartLoading, items.length]);

  // Silently apply/remove CRYPTO5 based on payment method.
  useEffect(() => {
    if (!paymentMethod || cartLoading || items.length === 0) return;
    const wantsCrypto = isCryptoMethod(paymentMethod);
    if (wantsCrypto && !cryptoCouponApplied) {
      (async () => {
        try {
          await applyCoupon(CRYPTO_COUPON);
          await refresh();
        } catch {
          /* silent — coupon may be disabled server-side */
        }
      })();
    } else if (!wantsCrypto && cryptoCouponApplied) {
      (async () => {
        try {
          await removeCoupon(CRYPTO_COUPON);
          await refresh();
        } catch {
          /* silent */
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, cryptoCouponApplied, cartLoading, items.length]);




  const currency = raw?.totals.currency_symbol ?? "$";
  const minor = raw?.totals.currency_minor_unit ?? 2;
  const itemsSubtotal = fromMinor(raw?.totals.total_items, minor) || subtotal;

  const taxTotal = fromMinor(raw?.totals.total_tax, minor);
  const discountTotal = fromMinor(raw?.totals.total_discount, minor);
  const selectedRate = rates.find((r) => r.rate_id === selectedRateId);
  const shippingCost = selectedRate
    ? fromMinor(selectedRate.price, selectedRate.currency_minor_unit)
    : 0;
  const shippingKnown = !!selectedRate;
  // Compute total client-side so it stays in sync with the shipping row:
  // before a rate is selected, total = subtotal (no hidden shipping).
  const total = Math.max(
    0,
    itemsSubtotal - discountTotal + (shippingKnown ? shippingCost : 0) + taxTotal,
  );

  const cartEmpty = !cartLoading && items.length === 0;

  // Effective shipping address for rate calculation
  const shipAddr = shipSame ? billing : shipping;
  const addrReady =
    shipAddr.country.trim().length === 2 &&
    shipAddr.state.trim().length > 0 &&
    shipAddr.postcode.trim().length > 0 &&
    shipAddr.city.trim().length > 0 &&
    shipAddr.address_1.trim().length > 0;



  // Debounced: when address is complete, update customer to fetch rates
  useEffect(() => {
    if (!needsShipping || cartEmpty || !addrReady) return;
    const handle = setTimeout(async () => {
      setRatesLoading(true);
      setRatesError(null);
      try {
        const cart = await updateCustomer({
          shipping_address: {
            first_name: shipAddr.first_name,
            last_name: shipAddr.last_name,
            address_1: shipAddr.address_1,
            address_2: shipAddr.address_2,
            city: shipAddr.city,
            state: shipAddr.state,
            postcode: shipAddr.postcode,
            country: shipAddr.country,
          },
        });
        const pkg = cart.shipping_rates?.[0]?.shipping_rates ?? [];
        setRates(pkg);
        const preselected = pkg.find((r) => r.selected)?.rate_id;
        // Auto-select free shipping when the cart qualifies.
        const freeRate = pkg.find(
          (r) => fromMinor(r.price, r.currency_minor_unit) === 0 || /free/i.test(r.name),
        );
        const target =
          (itemsSubtotal >= 150 && freeRate?.rate_id) || preselected || pkg[0]?.rate_id;
        if (target) {
          if (target !== selectedRateId) {
            await selectShippingRate({ package_id: 0, rate_id: target });
            setSelectedRateId(target);
            await refresh();
          } else {
            setSelectedRateId(target);
          }
        } else {
          setSelectedRateId("");
        }
      } catch (e) {
        setRatesError(e instanceof Error ? e.message : "Could not load shipping rates.");
      } finally {
        setRatesLoading(false);
      }
    }, 500);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    needsShipping,
    cartEmpty,
    addrReady,
    // Re-fetch when cart contents change so rates / free-shipping never go stale.
    itemsSubtotal,
    items.length,
    shipAddr.first_name,
    shipAddr.last_name,
    shipAddr.address_1,
    shipAddr.address_2,
    shipAddr.city,
    shipAddr.state,
    shipAddr.postcode,
    shipAddr.country,
  ]);

  async function onSelectRate(rateId: string) {
    setRatesLoading(true);
    setRatesError(null);
    try {
      await selectShippingRate({ package_id: 0, rate_id: rateId });
      setSelectedRateId(rateId);
      await refresh();
    } catch (e) {
      setRatesError(e instanceof Error ? e.message : "Could not select shipping rate.");
    } finally {
      setRatesLoading(false);
    }
  }


  function bindBilling<K extends keyof AddressForm>(k: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setBilling((b) => ({ ...b, [k]: e.target.value }));
  }
  function bindShipping<K extends keyof AddressForm>(k: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setShipping((b) => ({ ...b, [k]: e.target.value }));
  }

  // Per-country postcode validation. WooCommerce rejects mismatched formats
  // with a generic "invalid postcode" error — we catch it client-side first.
  const POSTCODE_RULES: Record<string, { re: RegExp; example: string }> = {
    US: { re: /^\d{5}(-\d{4})?$/, example: "12345 or 12345-6789" },
    CA: { re: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/i, example: "A1A 1A1" },
    GB: { re: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, example: "SW1A 1AA" },
    AU: { re: /^\d{4}$/, example: "2000" },
    DE: { re: /^\d{5}$/, example: "10115" },
    FR: { re: /^\d{5}$/, example: "75001" },
    NL: { re: /^\d{4} ?[A-Z]{2}$/i, example: "1011 AB" },
    IT: { re: /^\d{5}$/, example: "00100" },
    ES: { re: /^\d{5}$/, example: "28001" },
    JP: { re: /^\d{3}-?\d{4}$/, example: "100-0001" },
    BR: { re: /^\d{5}-?\d{3}$/, example: "01310-100" },
    MX: { re: /^\d{5}$/, example: "01000" },
  };

  function postcodeError(country: string, postcode: string): string | null {
    const rule = POSTCODE_RULES[country?.toUpperCase()];
    if (!rule) return null; // unknown country — let server decide
    if (!rule.re.test(postcode.trim())) {
      return `Postcode doesn't match the format for ${country.toUpperCase()} (e.g. ${rule.example}).`;
    }
    return null;
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
    ];
    for (const k of req) {
      if (!String(billing[k] ?? "").trim()) return `Billing ${k.replace("_", " ")} is required.`;
    }
    const bPc = postcodeError(billing.country, billing.postcode);
    if (bPc) return `Billing: ${bPc}`;
    if (!shipSame) {
      for (const k of req) {
        if (!String(shipping[k] ?? "").trim())
          return `Shipping ${k.replace("_", " ")} is required.`;
      }
      const sPc = postcodeError(shipping.country, shipping.postcode);
      if (sPc) return `Shipping: ${sPc}`;
    }
    if (!paymentMethod) return "Select a payment method.";
    if (needsShipping && !selectedRateId) return "Select a shipping method.";
    return null;
  }



  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    // Defensive: hide stripe panel until we recreate the order.
    if (paymentMethod !== STRIPE_VIRTUAL) setStripeSession(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSubmitting(true);
    try {
      const billingAddr: WooAddress = { ...billing, email };
      const shippingAddr: WooAddress = shipSame ? { ...billing, email } : { ...shipping };
      // Sync customer session with billing email before submitting checkout.
      // Woo Store API validates billing_address.email from session state.
      try {
        await updateCustomer({
          billing_address: billingAddr,
          shipping_address: shippingAddr,
        });
      } catch {
        /* non-fatal — submitCheckout will surface the real error if any */
      }
      const wooGateway =
        paymentMethod === STRIPE_VIRTUAL ? stripeWooSlug : paymentMethod;
      const res = await submitCheckout({
        billing_address: billingAddr,
        shipping_address: shippingAddr,
        payment_method: wooGateway,
        payment_data:
          paymentMethod === "quiklie"
            ? [
                { key: "quiklie_card_holder_name", value: card.name.trim() },
                { key: "quiklie_card_number", value: card.number.replace(/\s+/g, "") },
                { key: "quiklie_expiry", value: card.expiry },
                { key: "quiklie_cvv", value: card.cvv },
              ]
            : [],
        customer_note: note || undefined,
      });
      // eslint-disable-next-line no-console
      console.log("CHECKOUT RESPONSE:", res);
      const result = res.payment_result;
      const status = result?.payment_status;
      const failed = status === "failure" || status === "error";
      if (failed) {
        setError(result?.message || "Payment could not be processed.");
        return;
      }
      if (!res.order_id) {
        setError(result?.message || "Payment could not be processed.");
        return;
      }

      // Stripe (Attestly) flow — keep cart, create PaymentIntent, reveal Elements.
      if (paymentMethod === STRIPE_VIRTUAL) {
        try {
          const intentRes = await fetch("/api/public/attestly/create-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: res.order_id, orderKey: res.order_key }),
          });
          const intent = (await intentRes.json()) as {
            clientSecret?: string;
            amountCents?: number;
            error?: string;
          };
          if (!intentRes.ok || !intent.clientSecret) {
            setError(intent.error ?? "Could not initialize card payment.");
            return;
          }
          const piId = intent.clientSecret.split("_secret_")[0];
          setStripeSession({
            orderId: res.order_id,
            orderKey: res.order_key,
            clientSecret: intent.clientSecret,
            paymentIntentId: piId,
            amountCents: intent.amountCents ?? 0,
          });
          // Scroll the panel into view shortly after render.
          setTimeout(() => {
            document.getElementById("stripe-payment-panel")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 80);
          return;
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not initialize card payment.");
          return;
        }
      }

      // Existing non-Stripe flow → continue to /order-pay
      clearCartToken();
      try {
        await refresh();
      } catch {
        /* ignore */
      }
      window.location.href = `/order-pay/${res.order_id}?key=${encodeURIComponent(res.order_key)}`;
      return;
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
                      <StateSelect value={billing.state} onChange={bindBilling("state")} autoComplete="address-level1" />
                    </Field>
                    <Field label="Postcode" required>
                      <input value={billing.postcode} onChange={bindBilling("postcode")} className={inputCls} autoComplete="postal-code" />
                    </Field>
                    <Field label="Country" required>
                      <input value={billing.country} onChange={bindBilling("country")} className={inputCls} autoComplete="country" placeholder="US" maxLength={2} />
                    </Field>
                    <Field label="Phone (optional)" className="sm:col-span-2">
                      <input type="tel" value={billing.phone ?? ""} onChange={bindBilling("phone")} className={inputCls} autoComplete="tel" placeholder="(555) 123-4567" />
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
                        <StateSelect value={shipping.state} onChange={bindShipping("state")} autoComplete="address-level1" />
                      </Field>
                      <Field label="Postcode" required>
                        <input value={shipping.postcode} onChange={bindShipping("postcode")} className={inputCls} />
                      </Field>
                      <Field label="Country" required>
                        <input value={shipping.country} onChange={bindShipping("country")} className={inputCls} maxLength={2} />
                      </Field>
                      <Field label="Phone (optional)" className="sm:col-span-2">
                        <input type="tel" value={shipping.phone ?? ""} onChange={bindShipping("phone")} className={inputCls} placeholder="(555) 123-4567" />
                      </Field>
                    </div>
                  )}
                </Section>

                {needsShipping && (
                  <Section title="Shipping method">
                    {!addrReady ? (
                      <p className="text-sm text-foreground/50">
                        Enter your shipping address to see available rates.
                      </p>
                    ) : ratesLoading && rates.length === 0 ? (
                      <p className="text-sm text-foreground/50 flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading shipping rates…
                      </p>
                    ) : ratesError ? (
                      <p className="text-sm text-red-300">{ratesError}</p>
                    ) : rates.length === 0 ? (
                      <p className="text-sm text-foreground/50">
                        No shipping options available for this address.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {rates.map((r) => {
                          const cost = fromMinor(r.price, r.currency_minor_unit);
                          return (
                            <label
                              key={r.rate_id}
                              className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                                selectedRateId === r.rate_id
                                  ? "border-brand-gold/60 bg-brand-gold/5"
                                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="shipping_rate"
                                  value={r.rate_id}
                                  checked={selectedRateId === r.rate_id}
                                  onChange={() => onSelectRate(r.rate_id)}
                                  className="h-4 w-4 accent-brand-gold"
                                />
                                <span className="text-sm text-foreground">{r.name}</span>
                              </span>
                              <span className="text-sm text-foreground">
                                {currency}
                                {cost.toFixed(2)}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </Section>
                )}

                <Section title="Payment method">
                  {gateways.length === 0 ? (
                    <p className="text-sm text-foreground/50">
                      {cartLoading ? "Loading payment options…" : "No payment methods available."}
                    </p>
                  ) : (
                    (() => {
                      const categorize = (id: string): "cards_bank" | "crypto" | "other" => {
                        if (
                          id === STRIPE_VIRTUAL ||
                          id === "stripe" ||
                          id === "stripe_cc" ||
                          id === "quiklie" ||
                          id === "clarum_bank_transfer" ||
                          id === "bacs"
                        )
                          return "cards_bank";
                        if (id === "depay_wc_payments" || id === "nowpayments") return "crypto";
                        return "other";
                      };
                      const groups: { key: string; title: string; items: string[] }[] = [
                        {
                          key: "cards_bank",
                          title: "Card & Bank",
                          items: gateways.filter((g) => categorize(g) === "cards_bank"),
                        },
                        {
                          key: "crypto",
                          title: "Cryptocurrency",
                          items: gateways.filter((g) => categorize(g) === "crypto"),
                        },
                        {
                          key: "other",
                          title: "Other",
                          items: gateways.filter((g) => categorize(g) === "other"),
                        },
                      ].filter((grp) => grp.items.length > 0);

                      return (
                        <div className="space-y-5">
                          {groups.map((grp) => (
                            <div key={grp.key} className="space-y-2">
                              <div className="text-xs uppercase tracking-wider text-foreground/50">
                                {grp.title}
                              </div>
                              <div className="space-y-2">
                                {grp.items.map((g) => (
                                  <div key={g}>
                                    <label
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
                                      {isCryptoMethod(g) && (
                                        <span className="ml-auto inline-flex items-center whitespace-nowrap rounded-full border border-brand-gold/40 bg-brand-gold/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-gold">
                                          Save 5%
                                        </span>
                                      )}
                                    </label>
                                    {g === "quiklie" && paymentMethod === "quiklie" && (
                                      <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                                        <div>
                                          <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-1">
                                            Cardholder name
                                          </label>
                                          <input
                                            type="text"
                                            value={card.name}
                                            onChange={(e) =>
                                              setCard((c) => ({ ...c, name: e.target.value }))
                                            }
                                            autoComplete="cc-name"
                                            maxLength={100}
                                            placeholder="Name on card"
                                            className={inputCls}
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-1">
                                            Card number
                                          </label>
                                          <input
                                            type="text"
                                            inputMode="numeric"
                                            value={card.number}
                                            onChange={(e) => {
                                              const digits = e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 19);
                                              const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
                                              setCard((c) => ({ ...c, number: formatted }));
                                            }}
                                            autoComplete="cc-number"
                                            placeholder="1234 5678 9012 3456"
                                            className={`${inputCls} tracking-wider`}
                                          />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                          <div>
                                            <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-1">
                                              Expiry (MM/YY)
                                            </label>
                                            <input
                                              type="text"
                                              inputMode="numeric"
                                              value={card.expiry}
                                              onChange={(e) => {
                                                const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                                                const v =
                                                  d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
                                                setCard((c) => ({ ...c, expiry: v }));
                                              }}
                                              autoComplete="cc-exp"
                                              placeholder="MM/YY"
                                              maxLength={5}
                                              className={inputCls}
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-1">
                                              CVV
                                            </label>
                                            <input
                                              type="text"
                                              inputMode="numeric"
                                              value={card.cvv}
                                              onChange={(e) =>
                                                setCard((c) => ({
                                                  ...c,
                                                  cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                                                }))
                                              }
                                              autoComplete="cc-csc"
                                              placeholder="123"
                                              maxLength={4}
                                              className={inputCls}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()
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

                {stripeSession && paymentMethod === STRIPE_VIRTUAL ? (
                  <div id="stripe-payment-panel" className="space-y-3">
                    <StripeAttestlyPanel
                      publishableKey={attestlyConfig!.publishableKey!}
                      stripeAccountId={attestlyConfig!.stripeAccountId!}
                      clientSecret={stripeSession.clientSecret}
                      paymentIntentId={stripeSession.paymentIntentId}
                      amountLabel={`${currency}${(stripeSession.amountCents / 100).toFixed(2)}`}
                      returnUrl={`${window.location.origin}/order-confirmation/${stripeSession.orderId}?key=${encodeURIComponent(stripeSession.orderKey)}`}
                      onPaid={async () => {
                        clearCartToken();
                        try { await refresh(); } catch { /* ignore */ }
                        window.location.href = `/order-confirmation/${stripeSession.orderId}?key=${encodeURIComponent(stripeSession.orderKey)}`;
                      }}
                      onError={(msg) => setError(msg)}
                    />
                    <p className="text-center text-xs text-foreground/50">
                      Your bank/card statement will show{" "}
                      <span className="text-foreground/70 font-medium">CLARUMPEPTIDES.COM</span>
                    </p>
                  </div>
                ) : !stripeReady && paymentMethod === STRIPE_VIRTUAL ? (
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-foreground/60">
                    Card payment temporarily unavailable. Please choose another option.
                  </div>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={submitting || cartLoading}
                      className="w-full rounded-full bg-brand-gold text-brand-forest font-semibold py-4 hover:bg-brand-gold/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Placing order…
                        </>
                      ) : (
                        <>
                          {paymentMethod === STRIPE_VIRTUAL ? "Continue to card payment" : "Place order"}
                          {needsShipping && !shippingKnown ? "" : ` · ${currency}${total.toFixed(2)}`}
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-foreground/50">
                      Your bank/card statement will show{" "}
                      <span className="text-foreground/70 font-medium">CLARUMPEPTIDES.COM</span>
                    </p>
                  </>
                )}
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
                    <Row label="Subtotal" value={`${currency}${itemsSubtotal.toFixed(2)}`} />
                    {(() => {
                      const sel = rates.find((r) => r.rate_id === selectedRateId && r.selected);
                      let value: string;
                      if (sel) {
                        const cost = fromMinor(sel.price, sel.currency_minor_unit);
                        value = `${sel.name} · ${currency}${cost.toFixed(2)}`;
                      } else {
                        value = "Calculated next";
                      }
                      return <Row label="Shipping" value={value} />;
                    })()}
                    {(() => {
                      const showCrypto = cryptoCouponApplied && isCryptoMethod(paymentMethod);
                      // Approximate the crypto portion as 5% of the items subtotal so
                      // we can show "Crypto discount (5%)" separately from any other
                      // active coupons (e.g. welcome coupon).
                      const cryptoPortion = showCrypto
                        ? Math.min(discountTotal, +(itemsSubtotal * 0.05).toFixed(2))
                        : 0;
                      const otherDiscount = Math.max(0, discountTotal - cryptoPortion);
                      return (
                        <>
                          {otherDiscount > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-brand-gold/80">Discount</span>
                              <span className="text-brand-gold">
                                -{currency}
                                {otherDiscount.toFixed(2)}
                              </span>
                            </div>
                          )}
                          {showCrypto && cryptoPortion > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-emerald-400/90">Crypto discount (5%)</span>
                              <span className="text-emerald-400">
                                −{currency}
                                {cryptoPortion.toFixed(2)}
                              </span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                    {taxTotal > 0 && (
                      <Row label="Tax" value={`${currency}${taxTotal.toFixed(2)}`} />
                    )}

                    <div className="pt-3 mt-1 border-t border-white/5 space-y-2">
                      {appliedCoupons.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {appliedCoupons.map((code) => (
                            <span
                              key={code}
                              className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-xs text-brand-gold"
                            >
                              {code}
                              <button
                                type="button"
                                onClick={() => handleRemoveCoupon(code)}
                                disabled={couponBusy}
                                aria-label={`Remove coupon ${code}`}
                                className="hover:text-foreground disabled:opacity-50"
                              >
                                ×
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
                          onClick={(e) => handleApplyCoupon(e)}
                          disabled={couponBusy || !couponInput.trim()}
                          className="rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-foreground hover:border-brand-gold/60 hover:text-brand-gold transition-colors disabled:opacity-50"
                        >
                          {couponBusy ? "…" : "Apply"}
                        </button>
                      </div>

                      {couponError && (
                        <p className="text-xs text-red-400">{couponError}</p>
                      )}
                    </div>
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

const US_STATES: ReadonlyArray<{ code: string; name: string }> = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" }, { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" }, { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" }, { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" }, { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" }, { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" }, { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" }, { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" }, { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" }, { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" }, { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" }, { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" }, { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" }, { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" }, { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
].sort((a, b) => a.name.localeCompare(b.name));

function StateSelect({
  value,
  onChange,
  autoComplete,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  autoComplete?: string;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className={`${inputCls} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23a3a3a3%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-no-repeat bg-[right_0.85rem_center] pr-9 ${value ? "" : "text-foreground/30"}`}
    >
      <option value="" disabled className="bg-background text-foreground">Select state</option>
      {US_STATES.map((s) => (
        <option key={s.code} value={s.code} className="bg-background text-foreground">
          {s.name}
        </option>
      ))}
    </select>
  );
}

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
