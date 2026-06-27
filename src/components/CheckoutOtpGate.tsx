import { useEffect, useRef, useState } from "react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

type Props = {
  onVerified: (email: string, payload: Record<string, unknown>) => void;
  summary?: React.ReactNode;
  defaultEmail?: string;
};

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutOtpGate({ onVerified, summary, defaultEmail }: Props) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [remaining, setRemaining] = useState<number | null>(null);
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
      setRemaining(rem);
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
      // If pasted multiple digits, fan them out.
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
      setRemaining(null);
      setTimeout(() => boxRefs.current[0]?.focus(), 40);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
      <div className="flex justify-center">
        <div
          className={`relative w-full max-w-[440px] rounded-[20px] p-[1px] bg-gradient-to-br from-[#C79A3A] via-[#E2BC63]/60 to-[#C79A3A]/40 shadow-[0_0_60px_-15px_rgba(199,154,58,0.45)] transition-transform ${
            shake ? "animate-[shake_0.45s_ease-in-out]" : ""
          }`}
        >
          <div className="relative rounded-[19px] bg-[#0F1A2E] overflow-hidden">
            {/* molecule watermark */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, #C79A3A 1px, transparent 1.5px), radial-gradient(circle at 70% 60%, #C79A3A 1px, transparent 1.5px), radial-gradient(circle at 50% 85%, #C79A3A 1px, transparent 1.5px)",
                backgroundSize: "180px 180px",
              }}
            />
            <div className="relative p-8 sm:p-10">
              <div className="text-center mb-6">
                <p
                  className="text-[10px] tracking-[0.4em] font-semibold"
                  style={{ color: "#C79A3A" }}
                >
                  CLARUM
                </p>
              </div>

              {step === "email" ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h2
                    className="text-center text-2xl mb-2"
                    style={{ fontFamily: "Georgia, serif", color: "#F5EBD3" }}
                  >
                    Sign in or sign up
                  </h2>
                  <p
                    className="text-center text-sm mb-6"
                    style={{ color: "rgba(199,154,58,0.7)" }}
                  >
                    We'll email you a one-time code — no password needed.
                  </p>
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <input
                      type="email"
                      autoFocus
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (err) setErr(null);
                      }}
                      placeholder="your@email.com"
                      className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all"
                      style={{
                        backgroundColor: "#0A1322",
                        border: "1px solid rgba(199,154,58,0.25)",
                        color: "#F5EBD3",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#C79A3A";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(199,154,58,0.18)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(199,154,58,0.25)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    {err && <p className="text-xs text-red-400">{err}</p>}
                    <button
                      type="submit"
                      disabled={busy}
                      className="w-full rounded-full py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                      style={{
                        background: "linear-gradient(135deg,#C79A3A 0%,#E2BC63 100%)",
                        color: "#0F1A2E",
                        boxShadow: "0 8px 24px -8px rgba(199,154,58,0.5)",
                      }}
                    >
                      {busy ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Sign in or sign up <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px]" style={{ color: "rgba(245,235,211,0.5)" }}>
                      By continuing you agree to our{" "}
                      <a href="/terms" style={{ color: "#C79A3A" }} className="hover:underline">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" style={{ color: "#C79A3A" }} className="hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </form>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex justify-center mb-5">
                    <div
                      className="h-14 w-14 rounded-full flex items-center justify-center"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(226,188,99,0.25), rgba(199,154,58,0.08))",
                        border: "1px solid rgba(199,154,58,0.5)",
                      }}
                    >
                      <Mail className="h-6 w-6" style={{ color: "#E2BC63" }} />
                    </div>
                  </div>
                  <h2
                    className="text-center text-2xl mb-2"
                    style={{ fontFamily: "Georgia, serif", color: "#F5EBD3" }}
                  >
                    Verify your email
                  </h2>
                  <p
                    className="text-center text-sm mb-6"
                    style={{ color: "rgba(245,235,211,0.65)" }}
                  >
                    We sent a 6-digit code to{" "}
                    <span style={{ color: "#E2BC63" }} className="font-medium">
                      {email}
                    </span>
                  </p>

                  <div className="flex justify-center gap-2 mb-4" onPaste={(e) => {
                    const txt = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                    if (txt.length) {
                      e.preventDefault();
                      setDigit(0, txt);
                    }
                  }}>
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
                        className="text-center rounded-xl outline-none transition-all"
                        style={{
                          width: "44px",
                          height: "56px",
                          fontFamily: "Georgia, serif",
                          fontSize: "22px",
                          backgroundColor: "#0A1322",
                          border: `1px solid ${err ? "rgba(239,68,68,0.6)" : "rgba(199,154,58,0.3)"}`,
                          color: "#F5EBD3",
                        }}
                        onFocus={(e) => {
                          if (!err) {
                            e.currentTarget.style.borderColor = "#E2BC63";
                            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(226,188,99,0.25)";
                          }
                        }}
                        onBlur={(e) => {
                          if (!err) {
                            e.currentTarget.style.borderColor = "rgba(199,154,58,0.3)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                      />
                    ))}
                  </div>

                  {err && (
                    <p className="text-center text-xs text-red-400 mb-3">{err}</p>
                  )}

                  <div className="flex items-center justify-center gap-4 text-xs mb-6">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={cooldown > 0 || busy}
                      style={{ color: cooldown > 0 ? "rgba(245,235,211,0.4)" : "#C79A3A" }}
                      className="hover:underline disabled:no-underline"
                    >
                      {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                    </button>
                    <span style={{ color: "rgba(245,235,211,0.3)" }}>·</span>
                    <button
                      type="button"
                      onClick={() => {
                        setStep("email");
                        setErr(null);
                        setRemaining(null);
                      }}
                      style={{ color: "#C79A3A" }}
                      className="hover:underline"
                    >
                      Change email
                    </button>
                  </div>

                  <div
                    className="flex items-center justify-center gap-1.5 text-[11px]"
                    style={{ color: "rgba(199,154,58,0.7)" }}
                  >
                    <Lock className="h-3 w-3" />
                    Secure, encrypted verification
                  </div>
                  {/* remaining is shown inline in err string */}
                  <input type="hidden" value={remaining ?? ""} readOnly />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {summary && (
        <aside className="hidden lg:block lg:sticky lg:top-8 self-start">{summary}</aside>
      )}

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
