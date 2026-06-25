import { useEffect, useMemo, useState } from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Loader2, Lock } from "lucide-react";

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
  amountLabel: string;
  paymentIntentId: string;
  onPaid: (paymentIntentId: string) => void | Promise<void>;
  onError: (msg: string) => void;
};

export function StripeAttestlyPanel(props: Props) {
  const stripePromise = useMemo(
    () => getStripePromise(props.publishableKey, props.stripeAccountId),
    [props.publishableKey, props.stripeAccountId],
  );
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: props.clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#4d9e3f",
            colorBackground: "#0b1812",
            colorText: "#e7ece6",
            colorDanger: "#f87171",
            borderRadius: "10px",
          },
        },
      }}
    >
      <PaymentForm {...props} />
    </Elements>
  );
}

function PaymentForm({ returnUrl, amountLabel, paymentIntentId, onPaid, onError }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);

  async function verifyAndFinish(piId: string) {
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
  }

  async function handleConfirm() {
    if (!stripe || !elements) return;
    setBusy(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: undefined as unknown as string, // Elements supplies it
        confirmParams: { return_url: returnUrl },
        redirect: "if_required",
      });
      if (error) {
        onError(error.message ?? "Payment failed.");
        return;
      }
      const piId = paymentIntent?.id ?? paymentIntentId;
      await verifyAndFinish(piId);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="text-xs uppercase tracking-wider text-foreground/50 mb-3">
          One-tap pay
        </div>
        <ExpressCheckoutElement
          onConfirm={async () => {
            if (!stripe || !elements) return;
            setBusy(true);
            try {
              const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                clientSecret: undefined as unknown as string,
                confirmParams: { return_url: returnUrl },
                redirect: "if_required",
              });
              if (error) {
                onError(error.message ?? "Payment failed.");
                return;
              }
              const piId = paymentIntent?.id ?? paymentIntentId;
              await verifyAndFinish(piId);
            } finally {
              setBusy(false);
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

      <button
        type="button"
        onClick={handleConfirm}
        disabled={busy || !stripe || !elements}
        className="w-full rounded-full bg-[#4d9e3f] text-white font-semibold py-4 hover:bg-[#5cb84d] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Processing…
          </>
        ) : (
          <>
            <Lock className="h-3.5 w-3.5" /> Pay {amountLabel}
          </>
        )}
      </button>
    </div>
  );
}
