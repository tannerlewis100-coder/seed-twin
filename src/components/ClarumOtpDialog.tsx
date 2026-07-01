import { useEffect, useRef, useState } from "react";
import { Loader2, Check, X, ArrowRight } from "lucide-react";
import clarumLogo from "@/assets/clarum-logo.png";
import {
  parseIdentifier,
  otpPayload,
  type ParsedIdentifier,
} from "@/lib/otpIdentifier";

const OTP_BASE = "https://admin.clarumpeptides.com/wp-json/clarum/v1/otp";

export type ClarumOtpResult = {
  /** Identifier the user actually verified with. */
  channel: "email" | "phone";
  /** For emails, the address. For phones, the 10-digit US number. */
  identifier: string;
  /** Verify token from /otp/verify — pass to /otp-login and to create-intent. */
  token: string;
  /** Full /otp/verify response for advanced use. */
  raw: Record<string, unknown>;
};

type Props = {
  /** "modal" renders as fixed overlay; "inline" renders as an embedded card. */
  mode?: "modal" | "inline";
  /** Prefill value for the identifier field (email or phone). */
  initialEmail?: string;
  /** When true and initialEmail is a valid identifier, auto-send on mount. */
  autoSend?: boolean;
  /** Card kicker line above the title. */
  eyebrow?: string;
  /** Card title. */
  title?: string;
  /** Card subtitle line. */
  subtitle?: string;
  /** Show the Clarum logo on the card (defaults true for inline, false for modal). */
  showLogo?: boolean;
  /** Copy on the primary send button. */
  sendLabel?: string;
  /** Loader called after successful code verification. Return quickly. */
  onVerified: (result: ClarumOtpResult) => Promise<void> | void;
  /** Called when the modal is dismissed. Only relevant when mode="modal". */
  onClose?: () => void;
};

export function ClarumOtpDialog({
  mode = "modal",
  initialEmail = "",
  autoSend = false,
  eyebrow = "Passwordless sign-in",
  title = "Sign in or sign up",
  subtitle = "We'll text or email you a one-time code. No password needed.",
  showLogo,
  sendLabel = "Send my code",
  onVerified,
  onClose,
}: Props) {
  const isModal = mode === "modal";
  const displayLogo = showLogo ?? !isModal;

  const initialParsed =
    autoSend && initialEmail ? parseIdentifier(initialEmail) : null;
  const parsedReady = initialParsed && initialParsed.channel;

  const [step, setStep] = useState<"identifier" | "code">(
    parsedReady ? "code" : "identifier",
  );
  const [rawInput, setRawInput] = useState(initialEmail);
  const [identifier, setIdentifier] = useState<ParsedIdentifier | null>(
    parsedReady ? initialParsed : null,
  );

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [success, setSuccess] = useState(false);
  const [handoffBusy, setHandoffBusy] = useState(false);
  const boxRefs = useRef<Array<HTMLInputElement | null>>([]);
  const idInputRef = useRef<HTMLInputElement | null>(null);
  const autoSentRef = useRef(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "code" && !sending && !busy && !success) {
      setTimeout(() => boxRefs.current[0]?.focus(), 40);
    }
    if (step === "identifier") {
      setTimeout(() => idInputRef.current?.focus(), 40);
    }
  }, [step, sending, busy, success]);

  // Fire the initial send when we started already at the code step.
  useEffect(() => {
    if (!autoSend || autoSentRef.current) return;
    if (!parsedReady || !initialParsed) return;
    autoSentRef.current = true;
    void sendCode(initialParsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendCode(id: ParsedIdentifier): Promise<boolean> {
    if (id.channel == null) return false;
    setSending(true);
    setErr(null);
    setExpired(false);
    try {
      const res = await fetch(`${OTP_BASE}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(otpPayload(id)),
      });
      if (res.status === 429) {
        setErr("Please wait a moment before resending.");
        setCooldown((c) => (c > 0 ? c : 30));
        return false;
      }
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      const errCode = (data.error || "").toLowerCase();
      if (
        id.channel === "phone" &&
        (errCode === "sms_unavailable" || errCode === "sms_failed")
      ) {
        setErr("Texting is unavailable right now — please use your email instead.");
        setStep("identifier");
        setRawInput("");
        setIdentifier(null);
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

  async function handleIdentifierSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseIdentifier(rawInput);
    if (parsed.channel == null) {
      setErr(parsed.error);
      return;
    }
    setIdentifier(parsed);
    const ok = await sendCode(parsed);
    if (ok) {
      setDigits(["", "", "", "", "", ""]);
      setStep("code");
    }
  }

  async function verify(code: string) {
    if (!identifier || identifier.channel == null) return;
    setBusy(true);
    setErr(null);
    setExpired(false);
    try {
      const res = await fetch(`${OTP_BASE}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(otpPayload(identifier, code)),
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
        setHandoffBusy(true);
        const result: ClarumOtpResult = {
          channel: identifier.channel,
          identifier:
            identifier.channel === "email" ? identifier.email : identifier.phone,
          token: data.token,
          raw: data as Record<string, unknown>,
        };
        try {
          await onVerified(result);
        } catch (e) {
          setSuccess(false);
          setErr(e instanceof Error ? e.message : "Sign-in failed.");
        } finally {
          setHandoffBusy(false);
        }
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
    if ((cooldown > 0 && !expired) || sending || busy || !identifier) return;
    setDigits(["", "", "", "", "", ""]);
    setRemaining(null);
    await sendCode(identifier);
  }

  function useDifferent() {
    setStep("identifier");
    setDigits(["", "", "", "", "", ""]);
    setErr(null);
    setExpired(false);
    setRemaining(null);
  }

  const sentToLabel =
    identifier && identifier.channel != null ? identifier.display : "";

  const card = (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border shadow-2xl ${
        shake ? "animate-[clarum-otp-shake_0.45s_ease-in-out]" : ""
      }`}
      style={{
        maxWidth: "440px",
        backgroundColor: "#0F1A2E",
        borderColor: "rgba(196,160,90,0.25)",
      }}
    >
      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 text-white/50 hover:text-white/90 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="p-7 sm:p-9">
        {displayLogo && (
          <img
            src={clarumLogo}
            alt="Clarum Peptides"
            className="mx-auto mb-5 h-10 w-auto object-contain"
          />
        )}
        <p
          className="text-[11px] tracking-[0.24em] uppercase mb-3"
          style={{ color: "#C4A05A" }}
        >
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl sm:text-4xl leading-tight text-white">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/70">{subtitle}</p>

        {step === "identifier" ? (
          <form onSubmit={handleIdentifierSubmit} className="mt-6 space-y-3">
            <input
              ref={idInputRef}
              type="text"
              autoComplete="email"
              value={rawInput}
              onChange={(e) => {
                setRawInput(e.target.value);
                if (err) setErr(null);
              }}
              placeholder="Email or phone #"
              className="w-full rounded-lg bg-black/30 px-4 py-3 text-white text-sm outline-none transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.12)" }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#C4A05A";
                e.currentTarget.style.boxShadow =
                  "0 0 0 2px rgba(196,160,90,0.35)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.boxShadow = "none";
              }}
              disabled={sending}
            />
            {err && <p className="text-xs text-red-400">{err}</p>}
            <button
              type="submit"
              disabled={sending}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition disabled:opacity-60"
              style={{ backgroundColor: "#C4A05A", color: "#0F1A2E" }}
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {sendLabel} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              We sent a 6-digit code to{" "}
              <span className="text-white font-medium">{sentToLabel}</span>.
            </p>
            {success ? (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 py-8">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full animate-[clarum-otp-pop_0.4s_ease-out]"
                  style={{
                    backgroundColor: "rgba(196,160,90,0.15)",
                    border: "1px solid #C4A05A",
                  }}
                >
                  <Check className="h-7 w-7" style={{ color: "#C4A05A" }} />
                </div>
                <p className="text-sm text-white/80">
                  {handoffBusy ? "Signing you in…" : "Verified"}
                </p>
              </div>
            ) : (
              <>
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
                          border: `1px solid ${
                            hasErr
                              ? "rgba(248,113,113,0.7)"
                              : "rgba(255,255,255,0.1)"
                          }`,
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#C4A05A";
                          e.currentTarget.style.boxShadow =
                            "0 0 0 2px rgba(196,160,90,0.35)";
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
                    onClick={useDifferent}
                    className="text-white/45 hover:text-white/70 transition-colors"
                  >
                    Use a different email or phone
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes clarum-otp-shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes clarum-otp-pop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );

  if (!isModal) return card;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Verify to continue"
      onKeyDown={(e) => {
        if (e.key === "Escape" && onClose) onClose();
      }}
    >
      {card}
    </div>
  );
}
