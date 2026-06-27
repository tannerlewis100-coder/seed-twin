import { useEffect, useRef, useState } from "react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import clarumLogo from "@/assets/clarum-logo.png";

type Props = {
  onVerified: (email: string, payload: Record<string, unknown>) => void;
  summary?: React.ReactNode;
  defaultEmail?: string;
};

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutOtpGate({ onVerified, defaultEmail }: Props) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [shake, setShake] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const boxRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendCode(targetEmail: string) {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/public/otp-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };
      if (!res.ok || !data.ok) {
        setErr(data.error || data.message || "Could not send code. Try again.");
        return false;
      }
      return true;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!emailRx.test(trimmed)) {
      setErr("Enter a valid email.");
      return;
    }
    const ok = await sendCode(trimmed);
    if (ok) {
      setEmail(trimmed);
      setDigits(["", "", "", "", "", ""]);
      setStep("code");
      setCooldown(30);
      setTimeout(() => boxRefs.current[0]?.focus(), 60);
    }
  }

  async function verify(code: string) {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/public/otp-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = (await res.json()) as Record<string, unknown> & {
        ok?: boolean;
        verified?: boolean;
        remaining?: number;
        error?: string;
        message?: string;
      };
      if (data.verified === true || data.ok === true) {
        onVerified(email, data);
        return;
      }
      const rem = typeof data.remaining === "number" ? data.remaining : null;
      setErr(
        rem !== null
          ? `Incorrect code — ${rem} ${rem === 1 ? "try" : "tries"} left.`
          : data.error || data.message || "Incorrect code.",
      );
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setDigits(["", "", "", "", "", ""]);
      setTimeout(() => boxRefs.current[0]?.focus(), 40);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error.");
    } finally {
      setBusy(false);
    }
  }

  function setDigit(idx: number, val: string) {
    const cleaned = val.replace(/\D/g, "");
    if (!cleaned) {
      setDigits((d) => {
        const next = [...d];
        next[idx] = "";
        return next;
      });
      return;
    }
    setDigits((d) => {
      const next = [...d];
      for (let i = 0; i < cleaned.length && idx + i < 6; i++) {
        next[idx + i] = cleaned[i];
      }
      const fullCode = next.join("");
      const lastFilled = Math.min(idx + cleaned.length, 6) - 1;
      const focusTarget = Math.min(lastFilled + 1, 5);
      setTimeout(() => boxRefs.current[focusTarget]?.focus(), 0);
      if (fullCode.length === 6 && !next.includes("")) {
        setTimeout(() => verify(fullCode), 60);
      }
      return next;
    });
  }

  function onKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      e.preventDefault();
      boxRefs.current[idx - 1]?.focus();
      setDigits((d) => {
        const next = [...d];
        next[idx - 1] = "";
        return next;
      });
    } else if (e.key === "ArrowLeft" && idx > 0) {
      boxRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      boxRefs.current[idx + 1]?.focus();
    }
  }

  async function handleResend() {
    if (cooldown > 0 || busy) return;
    const ok = await sendCode(email);
    if (ok) {
      setCooldown(30);
      setDigits(["", "", "", "", "", ""]);
      setErr(null);
      setTimeout(() => boxRefs.current[0]?.focus(), 40);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Verify your email to continue to checkout"
    >
      <div
        className={`relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl border border-border bg-card shadow-2xl md:max-w-3xl md:overflow-hidden ${
          shake ? "animate-[shake_0.45s_ease-in-out]" : ""
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Brand panel */}
          <div className="relative w-full overflow-hidden bg-black aspect-[4/3] md:aspect-auto md:min-h-[480px] flex items-center justify-center p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, #C79A3A 1px, transparent 1.5px), radial-gradient(circle at 70% 60%, #C79A3A 1px, transparent 1.5px), radial-gradient(circle at 50% 85%, #C79A3A 1px, transparent 1.5px)",
                backgroundSize: "180px 180px",
              }}
            />
            <img
              src={clarumLogo}
              alt="Clarum Peptides"
              className="relative z-10 max-h-40 w-auto object-contain"
            />
            <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lg">
              Secure checkout
            </div>
          </div>

          {/* Form panel */}
          <div className="flex flex-col justify-center gap-4 p-5 md:gap-5 md:p-10">
            {step === "email" ? (
              <>
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Verify it's you
                  </p>
                  <h2 className="font-display text-2xl leading-tight text-foreground md:text-4xl">
                    Sign in or sign up.
                  </h2>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  We'll email you a one-time code. No password needed.
                </p>

                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <input
                    type="email"
                    autoFocus
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (err) setErr(null);
                    }}
                    placeholder="your@email.com"
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={busy}
                  />
                  {err && <p className="text-xs text-red-400">{err}</p>}
                  <button
                    type="submit"
                    disabled={busy}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Send my code <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] leading-relaxed text-muted-foreground/80">
                    By continuing you agree to our{" "}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </form>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                    <Mail className="h-4 w-4" /> Check your email
                  </div>
                  <h2 className="font-display text-2xl leading-tight text-foreground md:text-4xl">
                    Verify your email.
                  </h2>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-primary">{email}</span>
                </p>

                <div
                  className="flex justify-center gap-2"
                  onPaste={(e) => {
                    const txt = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                    if (txt.length) {
                      e.preventDefault();
                      setDigit(0, txt);
                    }
                  }}
                >
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        boxRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => onKeyDown(i, e)}
                      disabled={busy}
                      className={`h-14 w-11 rounded-md border bg-background text-center font-display text-xl text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary ${
                        err ? "border-red-500/60" : "border-border"
                      }`}
                    />
                  ))}
                </div>

                {err && <p className="text-center text-xs text-red-400">{err}</p>}

                <div className="flex items-center justify-center gap-4 text-xs">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || busy}
                    className="text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                  </button>
                  <span className="text-muted-foreground/40">·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setErr(null);
                    }}
                    className="text-primary hover:underline"
                  >
                    Change email
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Secure, encrypted verification
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
