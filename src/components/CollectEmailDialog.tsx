import { useEffect, useRef, useState } from "react";
import { Loader2, X, ArrowRight, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useClarumAuth } from "@/lib/clarum-auth";

const WP_BASE = "https://admin.clarumpeptides.com/wp-json/clarum/v1";
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = "email" | "code";

export function CollectEmailDialog() {
  const { needsEmail, token, dismissEmailPrompt, updateUser } = useClarumAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [errCode, setErrCode] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [success, setSuccess] = useState(false);
  const boxRefs = useRef<Array<HTMLInputElement | null>>([]);

  const open = needsEmail && !!token;

  useEffect(() => {
    if (!open) {
      setStep("email");
      setEmail("");
      setDigits(["", "", "", "", "", ""]);
      setErr(null);
      setErrCode(null);
      setSuccess(false);
    }
  }, [open]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "code" && !sending && !verifying) {
      setTimeout(() => boxRefs.current[0]?.focus(), 40);
    }
  }, [step, sending, verifying]);

  if (!open) return null;

  async function sendCode(): Promise<boolean> {
    setSending(true);
    setErr(null);
    setErrCode(null);
    try {
      const res = await fetch(`${WP_BASE}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.status === 429) {
        setErr("Please wait a moment before resending.");
        setCooldown((c) => (c > 0 ? c : 30));
        return false;
      }
      if (!res.ok || data.ok === false) {
        setErr(data.error || "Could not send code. Try again.");
        return false;
      }
      setCooldown(30);
      return true;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error.");
      return false;
    } finally {
      setSending(false);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RX.test(trimmed)) {
      setErr("Enter a valid email address.");
      return;
    }
    setEmail(trimmed);
    const ok = await sendCode();
    if (ok) {
      setDigits(["", "", "", "", "", ""]);
      setStep("code");
    }
  }

  async function verifyAndSave(code: string) {
    if (!token) return;
    setVerifying(true);
    setErr(null);
    setErrCode(null);
    try {
      const vRes = await fetch(`${WP_BASE}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const vData = (await vRes.json().catch(() => ({}))) as {
        verified?: boolean;
        token?: string;
        error?: string;
        remaining?: number;
      };
      if (vData.verified !== true || !vData.token) {
        if ((vData.error || "").toLowerCase().includes("expired")) {
          setErr("Code expired. Send a new one?");
        } else {
          const rem = typeof vData.remaining === "number" ? vData.remaining : null;
          setErr(
            rem !== null
              ? `Incorrect code — ${rem} ${rem === 1 ? "attempt" : "attempts"} left.`
              : vData.error || "Incorrect code.",
          );
        }
        setDigits(["", "", "", "", "", ""]);
        setTimeout(() => boxRefs.current[0]?.focus(), 40);
        return;
      }

      // Save email against the account.
      setSaving(true);
      const sRes = await fetch(`${WP_BASE}/me/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, token: vData.token }),
      });
      const sData = (await sRes.json().catch(() => ({}))) as {
        code?: string;
        message?: string;
      };
      if (sRes.status === 409 || sData.code === "email_taken") {
        setErrCode("email_taken");
        setErr("That email is already used by another account.");
        return;
      }
      if (sRes.status === 401 || sData.code === "unverified_email") {
        setErrCode("unverified_email");
        setErr("Your verification expired. Please request a new code.");
        return;
      }
      if (!sRes.ok) {
        setErr(sData.message || "Could not save email. Try again.");
        return;
      }
      updateUser({ email });
      setSuccess(true);
      toast.success("Email saved", {
        description: "You'll get order updates here from now on.",
      });
      setTimeout(() => dismissEmailPrompt(), 800);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error.");
    } finally {
      setVerifying(false);
      setSaving(false);
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
        setTimeout(() => verifyAndSave(fullCode), 60);
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
    }
  }

  async function handleResend() {
    if (cooldown > 0 || sending || verifying) return;
    setDigits(["", "", "", "", "", ""]);
    setErrCode(null);
    await sendCode();
  }

  const showEmailTaken = errCode === "email_taken";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Add your email"
      onKeyDown={(e) => {
        if (e.key === "Escape") dismissEmailPrompt();
      }}
    >
      <div className="relative w-full max-w-[440px] overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-2xl">
        <button
          type="button"
          onClick={dismissEmailPrompt}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-7 sm:p-9">
          <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-primary">
            One quick thing
          </p>
          <h2 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
            Where should we send order updates?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Order confirmations, shipping notices, and your order history all go to
            this email. It stays on your account.
          </p>

          {success ? (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 py-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary bg-primary/15">
                <Check className="h-7 w-7 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Email saved</p>
            </div>
          ) : step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-3">
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (err) setErr(null);
                }}
                placeholder="you@example.com"
                className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                disabled={sending}
              />
              {err && <p className="text-xs text-red-400">{err}</p>}
              <button
                type="submit"
                disabled={sending}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:opacity-60"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Send verification code <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={dismissEmailPrompt}
                className="block w-full pt-2 text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Not now
              </button>
            </form>
          ) : showEmailTaken ? (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-red-400">
                <span className="font-medium text-foreground">{email}</span> already
                belongs to another Clarum account.
              </p>
              <p className="text-sm text-muted-foreground">
                Sign in with that email instead, or contact us and we'll help merge
                your accounts.
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setErr(null);
                    setErrCode(null);
                    setEmail("");
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Try a different email
                </button>
                <Link
                  to="/contact"
                  onClick={dismissEmailPrompt}
                  className="text-center text-xs text-primary hover:underline"
                >
                  Contact support
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-foreground">{email}</span>.
              </p>
              <div
                className="mt-7 flex justify-center gap-2 sm:gap-2.5"
                onPaste={(e) => {
                  const txt = e.clipboardData
                    .getData("text")
                    .replace(/\D/g, "")
                    .slice(0, 6);
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
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={d}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    disabled={verifying || sending || saving}
                    aria-label={`Digit ${i + 1}`}
                    className={`h-12 w-10 rounded-lg border bg-background text-center font-display text-2xl text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 sm:h-14 sm:w-12 ${
                      err ? "border-red-500/60" : "border-border"
                    }`}
                  />
                ))}
              </div>

              <div className="mt-4 min-h-[20px] text-center text-xs">
                {sending ? (
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" /> Sending code…
                  </span>
                ) : verifying || saving ? (
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {saving ? "Saving…" : "Verifying…"}
                  </span>
                ) : err ? (
                  <span className="text-red-400">{err}</span>
                ) : (
                  <span className="text-muted-foreground/70">
                    Code expires in ~10 minutes.
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-col items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || sending || verifying}
                  className="font-medium text-primary transition-colors hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
                >
                  {sending
                    ? "Sending…"
                    : cooldown > 0
                      ? `Resend in ${cooldown}s`
                      : "Didn't get it? Resend code"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setDigits(["", "", "", "", "", ""]);
                    setErr(null);
                    setErrCode(null);
                  }}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Use a different email
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
