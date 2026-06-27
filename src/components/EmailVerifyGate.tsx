import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MailCheck } from "lucide-react";

export async function sendOtp(email: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/public/attestly/otp-start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (!res.ok || !data.ok) return { ok: false, error: data.error ?? "Couldn't send code." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error sending code." };
  }
}

async function verifyOtp(
  email: string,
  code: string,
): Promise<{ ok: boolean; verified: boolean; token?: string; remaining?: number; error?: string }> {
  try {
    const res = await fetch(`/api/public/attestly/otp-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      verified?: boolean;
      token?: string;
      remaining?: number;
      error?: string;
    };
    return {
      ok: !!data.ok,
      verified: !!data.verified,
      token: data.token,
      remaining: data.remaining,
      error: data.error,
    };
  } catch {
    return { ok: false, verified: false, error: "Network error verifying code." };
  }
}

type Props = {
  email: string;
  onVerified: (token?: string) => void;
  onChangeEmail: () => void;
};

export function EmailVerifyGate({ email, onVerified, onChangeEmail }: Props) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(30);
  const [resending, setResending] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const doVerify = useCallback(
    async (code: string) => {
      if (submitting) return;
      setSubmitting(true);
      setError(null);
      const res = await verifyOtp(email, code);
      setSubmitting(false);
      if (res.verified) {
        onVerified(res.token);
        return;
      }
      const remaining = typeof res.remaining === "number" ? res.remaining : null;
      setError(
        remaining !== null
          ? `Incorrect code — ${remaining} attempts left`
          : res.error ?? "Incorrect code.",
      );
      setDigits(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    },
    [email, onVerified, submitting],
  );

  function setDigit(i: number, val: string) {
    const v = val.replace(/\D/g, "").slice(0, 1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = v;
      if (v && i < 5) inputs.current[i + 1]?.focus();
      if (next.every((d) => d.length === 1)) {
        void doVerify(next.join(""));
      }
      return next;
    });
  }

  function onKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < 5) {
      inputs.current[i + 1]?.focus();
    }
  }

  function onPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    const lastIdx = Math.min(text.length, 6) - 1;
    inputs.current[lastIdx]?.focus();
    if (text.length === 6) void doVerify(text);
  }

  async function resend() {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError(null);
    const res = await sendOtp(email);
    setResending(false);
    if (!res.ok) {
      setError(res.error ?? "Couldn't resend code.");
      return;
    }
    setCooldown(30);
  }

  return (
    <div className="rounded-2xl border border-brand-gold/30 bg-gradient-to-b from-brand-gold/5 to-transparent p-6 sm:p-8">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-full bg-brand-gold/15 p-2.5 border border-brand-gold/30">
          <MailCheck className="h-5 w-5 text-brand-gold" />
        </div>
        <div>
          <h3 className="font-display text-xl text-foreground">Verify your email</h3>
          <p className="text-sm text-foreground/60 mt-0.5">
            We sent a 6-digit code to{" "}
            <span className="text-foreground font-medium">{email}</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2 sm:gap-3 justify-center my-6" onPaste={onPaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={d}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
            disabled={submitting}
            className="h-14 w-12 sm:h-16 sm:w-14 rounded-xl border border-white/15 bg-white/[0.04] text-center text-2xl font-semibold text-foreground focus:outline-none focus:border-brand-gold focus:bg-white/[0.06] disabled:opacity-50 transition-colors"
          />
        ))}
      </div>

      {submitting && (
        <p className="text-center text-xs text-foreground/60 flex items-center justify-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying…
        </p>
      )}
      {error && !submitting && (
        <p className="text-center text-sm text-red-300">{error}</p>
      )}

      <div className="flex items-center justify-center gap-5 mt-5 text-xs">
        <button
          type="button"
          onClick={resend}
          disabled={cooldown > 0 || resending}
          className="text-brand-gold hover:text-brand-gold-light disabled:text-foreground/40 disabled:hover:text-foreground/40 transition-colors"
        >
          {resending ? "Sending…" : cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
        <span className="text-foreground/20">·</span>
        <button
          type="button"
          onClick={onChangeEmail}
          className="text-foreground/60 hover:text-foreground transition-colors"
        >
          Change email
        </button>
      </div>
    </div>
  );
}
