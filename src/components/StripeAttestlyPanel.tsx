import { useCallback, useEffect, useMemo, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

export type AttestlyConfig = {
  publishableKey: string | null;
  stripeAccountId: string | null;
  paymentsEnabled: boolean;
  error?: string;
};

export function useAttestlyConfig() {
  const [config, setConfig] = useState<AttestlyConfig | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/public/attestly/config");
        const data = (await res.json()) as AttestlyConfig;
        if (!cancelled) setConfig(data);
      } catch {
        if (!cancelled) setConfig({ publishableKey: null, stripeAccountId: null, paymentsEnabled: false });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return { config, loading };
}

const stripeCache = new Map<string, Promise<Stripe | null>>();
function getStripePromise(pk: string, stripeAccount: string) {
  const key = `${pk}::${stripeAccount}`;
  let p = stripeCache.get(key);
  if (!p) {
    p = loadStripe(pk, { stripeAccount });
    stripeCache.set(key, p);
  }
  return p;
}

export type PaymentContext = {
  clientSecret: string;
  returnUrl: string;
  paymentIntentId: string;
  orderId: number;
  orderKey: string;
};

/**
 * Called by the panel AFTER a successful `elements.submit()`. Returns the
 * payment context (clientSecret + return URL + Woo order info) or `null` if
 * the caller already surfaced an error and the flow should abort.
 */
export type GetPaymentContext = () => Promise<PaymentContext | null>;

export type StripePaymentHandler = () => Promise<void>;

type Props = {
  publishableKey: string;
  stripeAccountId: string;
  amountCents: number;
  currency?: string;
  getPaymentContext: GetPaymentContext;
  onReady: (pay: StripePaymentHandler | null) => void;
  onPaid: (paymentIntentId: string) => void | Promise<void>;
  onError: (msg: string) => void;
};

export function StripeAttestlyPanel(props: Props) {
  const stripePromise = useMemo(
    () => getStripePromise(props.publishableKey, props.stripeAccountId),
    [props.publishableKey, props.stripeAccountId],
  );
  // Deferred PaymentIntent flow: mount Elements with mode/amount/currency and
  // fetch the clientSecret AFTER `elements.submit()` on Place Order.
  const options = useMemo(
    () => ({
      mode: "payment" as const,
      amount: Math.max(props.amountCents, 50),
      currency: (props.currency ?? "usd").toLowerCase(),
      appearance: {
        theme: "night" as const,
        variables: {
          colorPrimary: "#4d9e3f",
          colorBackground: "#0b1812",
          colorText: "#e7ece6",
          colorDanger: "#f87171",
          borderRadius: "10px",
        },
      },
    }),
    [props.amountCents, props.currency],
  );
  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm {...props} />
    </Elements>
  );
}

function PaymentForm({ getPaymentContext, onReady, onPaid, onError }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const verifyAndFinish = useCallback(
    async (piId: string, orderId: number, orderKey: string) => {
      try {
        const res = await fetch("/api/public/attestly/verify-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: piId, orderId, orderKey }),
        });
        const data = (await res.json()) as { paid?: boolean; error?: string };
        if (data.paid) {
          await onPaid(piId);
        } else {
          onError(data.error ?? "Payment was not completed. Please try again.");
        }
      } catch (e) {
        onError(e instanceof Error ? e.message : "Could not verify payment.");
      }
    },
    [onError, onPaid],
  );

  const runPayFlow = useCallback(async () => {
    if (!stripe || !elements) {
      throw new Error("Secure card form is still loading.");
    }

    // STEP 1 — MUST be the very first thing on the pay click. In Stripe's
    // deferred-intent flow, `elements.submit()` validates and collects the
    // payment details before we go async for the intent.
    const { error: submitError } = await elements.submit();
    if (submitError) {
      onError(submitError.message ?? "Please check your card details.");
      return;
    }

    // STEP 2 — Only now do async server work: create the Woo order and the
    // Stripe PaymentIntent, returning the clientSecret.
    const ctx = await getPaymentContext();
    if (!ctx) return; // caller already surfaced any error

    // STEP 3 — Confirm the payment using the freshly-fetched clientSecret.
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: ctx.clientSecret,
      confirmParams: {
        return_url: ctx.returnUrl,
        payment_method_data: {
          billing_details: { address: { country: "US" } },
        },
      },
      redirect: "if_required",
    });
    if (error) {
      onError(error.message ?? "Payment failed.");
      return;
    }
    const piId = paymentIntent?.id ?? ctx.paymentIntentId;
    await verifyAndFinish(piId, ctx.orderId, ctx.orderKey);
  }, [elements, getPaymentContext, onError, stripe, verifyAndFinish]);

  useEffect(() => {
    if (!stripe || !elements) {
      onReady(null);
      return;
    }
    onReady(runPayFlow);
    return () => onReady(null);
  }, [runPayFlow, elements, onReady, stripe]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="text-xs uppercase tracking-wider text-foreground/50 mb-3">
          One-tap pay
        </div>
        <ExpressCheckoutElement
          onConfirm={async () => {
            try {
              await runPayFlow();
            } catch (e) {
              onError(e instanceof Error ? e.message : "Payment failed.");
            }
          }}
        />
      </div>

      <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-foreground/40">
        <span className="h-px flex-1 bg-white/10" />
        or pay with card
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <PaymentElement
          options={{
            layout: "tabs",
            fields: {
              billingDetails: {
                address: { country: "never" },
              },
            },
            defaultValues: {
              billingDetails: { address: { country: "US" } },
            },
          }}
        />
      </div>
    </div>
  );
}
