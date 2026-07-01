import { useEffect, useRef, useState } from "react";
import { Loader2, Check, X } from "lucide-react";

const OTP_BASE = "https://admin.clarumpeptides.com/wp-json/clarum/v1/otp";

type Props = {
  email: string;
  /** If true, the parent has already fired otp/send; we skip the initial send. */
  codeAlreadySent?: boolean;
  onVerified: (result: { email: string; token: string }) => void;
  onClose: () => void;
};

export function AttestlyVerifyDialog({ email, codeAlreadySent, onVerified, onClose }: Props) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(!codeAlreadySent);
  const [err, setErr] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [cooldown, setCooldown] = useState(codeAlreadySent ? 30 : 0);
  const [success, setSuccess] = useState(false);
  const boxRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (codeAlreadySent) return;
    void sendCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sending && !busy && !success) {
      setTimeout(() => boxRefs.current[0]?.focus(), 40);
    }
  }, [sending, busy, success]);

  async function sendCode() {
    setSending(true);
    setErr(null);
    setExpired(false);
    try {
      const res = await fetch(`${OTP_BASE}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.status === 429) {
        setErr("Please wait a moment before resending.");
        setCooldown((c) => (c > 0 ? c : 30));
        return false;
      }
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
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

  async function verify(code: string) {
    setBusy(true);
    setErr(null);
    setExpired(false);
    try {
      const res = await fetch(`${OTP_BASE}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        verified?: boolean;
        token?: string;
        error?: string;
        remaining?: number;
      };
      if (data.verified === true && data.token) {
        setSuccess(true);
        setTimeout(() => onVerified({ email, token: data.token! }), 650);
        return;
      }
      if ((data.error || "").toLowerCase().includes("expired")) {
        setExpired(true);
        setErr("Code expired. Send a new one?");
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setDigits(["", "", "", "", "", ""]);
        return;
      }
      const rem = typeof data.remaining === "number" ? data.remaining : null;
      setRemaining(rem);
      setErr(
        rem !== null
          ? `Incorrect code — ${rem} ${rem === 1 ? "attempt" : "attempts"} left.`
          : data.error || "Incorrect code.",
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
    if (cooldown > 0 || sending || busy) return;
    setDigits(["", "", "", "", "", ""]);
    setRemaining(null);
    await sendCode();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Verify your email"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className={`relative w-full overflow-hidden rounded-2xl border shadow-2xl ${
          shake ? "animate-[attestly-shake_0.45s_ease-in-out]" : ""
        }`}
        style={{
          maxWidth: "440px",
          backgroundColor: "#0F1A2E",
          borderColor: "rgba(196,160,90,0.25)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Use a different email"
          className="absolute right-3 top-3 text-white/50 hover:text-white/90 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-7 sm:p-9">
          <p
            className="text-[11px] tracking-[0.24em] uppercase mb-3"
            style={{ color: "#C4A05A" }}
          >
            Payment verification
          </p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight text-white">
            Sign in or sign up
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            We'll email you a one-time code. No password needed.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            We've sent a 6-digit code to{" "}
            <span className="text-white font-medium">{email}</span>.
          </p>

          {success ? (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 py-8">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full animate-[attestly-pop_0.4s_ease-out]"
                style={{ backgroundColor: "rgba(196,160,90,0.15)", border: "1px solid #C4A05A" }}
              >
                <Check className="h-7 w-7" style={{ color: "#C4A05A" }} />
              </div>
              <p className="text-sm text-white/80">Verified · continuing to payment…</p>
            </div>
          ) : (
            <>
              <div
                className="mt-7 flex justify-center gap-2 sm:gap-2.5"
                onPaste={(e) => {
                  const txt = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                  if (txt.length) {
                    e.preventDefault();
                    setDigit(0, txt);
                  }
                }}
              >
                {digits.map((d, i) => {
                  const hasErr = !!err;
                  return (
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
                      disabled={busy || sending}
                      aria-label={`Digit ${i + 1}`}
                      className="h-12 w-10 sm:h-14 sm:w-12 rounded-lg bg-black/30 text-center font-display text-2xl text-white outline-none transition-all"
                      style={{
                        border: `1px solid ${hasErr ? "rgba(248,113,113,0.7)" : "rgba(255,255,255,0.1)"}`,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#C4A05A";
                        e.currentTarget.style.boxShadow = "0 0 0 2px rgba(196,160,90,0.35)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = hasErr
                          ? "rgba(248,113,113,0.7)"
                          : "rgba(255,255,255,0.1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  );
                })}
              </div>

              <div className="mt-4 min-h-[20px] text-center text-xs">
                {sending ? (
                  <span className="inline-flex items-center gap-2 text-white/60">
                    <Loader2 className="h-3 w-3 animate-spin" /> Sending code…
                  </span>
                ) : busy ? (
                  <span className="inline-flex items-center gap-2 text-white/60">
                    <Loader2 className="h-3 w-3 animate-spin" /> Verifying…
                  </span>
                ) : err ? (
                  <span className="text-red-400">{err}</span>
                ) : (
                  <span className="text-white/40">
                    Code expires in ~10 minutes.{" "}
                    {remaining !== null ? `${remaining} attempts left.` : ""}
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-col items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={(cooldown > 0 && !expired) || sending || busy}
                  className="font-medium transition-colors disabled:cursor-not-allowed"
                  style={{
                    color:
                      (cooldown > 0 && !expired) || sending || busy
                        ? "rgba(255,255,255,0.35)"
                        : "#C4A05A",
                  }}
                >
                  {sending
                    ? "Sending…"
                    : expired
                      ? "Send a new code"
                      : cooldown > 0
                        ? `Resend in ${cooldown}s`
                        : "Didn't get it? Resend code"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-white/45 hover:text-white/70 transition-colors"
                >
                  Use a different email
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes attestly-shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes attestly-pop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
