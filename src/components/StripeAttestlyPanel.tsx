import { useCallback, useEffect, useMemo } from "react";
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

type Props = {
  publishableKey: string;
  stripeAccountId: string;
  clientSecret: string;
  returnUrl: string;
  paymentIntentId: string;
  onReady: (confirmPayment: StripePaymentHandler | null) => void;
  onPaid: (paymentIntentId: string) => void | Promise<void>;
  onError: (msg: string) => void;
};

export type StripePaymentHandler = () => Promise<void>;

export function StripeAttestlyPanel(props: Props) {
  const stripePromise = useMemo(
    () => getStripePromise(props.publishableKey, props.stripeAccountId),
    [props.publishableKey, props.stripeAccountId],
  );
  const options = useMemo(
    () => ({
      clientSecret: props.clientSecret,
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
    [props.clientSecret],
  );
  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm {...props} />
    </Elements>
  );
}

function PaymentForm({ clientSecret, returnUrl, paymentIntentId, onReady, onPaid, onError }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const verifyAndFinish = useCallback(async (piId: string) => {
    try {
      const res = await fetch("/api/public/attestly/verify-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: piId }),
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
  }, [onError, onPaid]);

  const confirmPayment = useCallback(async () => {
    if (!stripe || !elements) {
      throw new Error("Secure card form is still loading.");
    }
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    });
    if (error) {
      onError(error.message ?? "Payment failed.");
      return;
    }
    const piId = paymentIntent?.id ?? paymentIntentId;
    await verifyAndFinish(piId);
  }, [clientSecret, elements, onError, paymentIntentId, returnUrl, stripe, verifyAndFinish]);

  useEffect(() => {
    if (!stripe || !elements) {
      onReady(null);
      return;
    }
    onReady(confirmPayment);
    return () => onReady(null);
  }, [confirmPayment, elements, onReady, stripe]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="text-xs uppercase tracking-wider text-foreground/50 mb-3">
          One-tap pay
        </div>
        <ExpressCheckoutElement
          onConfirm={async () => {
            try {
              await confirmPayment();
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
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
    </div>
  );
}
