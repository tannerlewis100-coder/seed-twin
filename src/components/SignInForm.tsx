import { useEffect, useRef, useState, type FormEvent } from "react";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import clarumLogo from "@/assets/clarum-logo.png";
import { couponCode, otpLoginApi, useClarumAuth } from "@/lib/clarum-auth";
import {
  parseIdentifier,
  otpPayload,
  type ParsedIdentifier,
} from "@/lib/otpIdentifier";

const OTP_BASE = "https://admin.clarumpeptides.com/wp-json/clarum/v1/otp";

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-black focus-within:border-brand-gold/60 transition-colors">
    {children}
  </div>
);

export type SignInMode = "signin" | "signup";

export function SignInForm({ mode }: { mode: SignInMode }) {
  const isSignUp = mode === "signup";
  const navigate = useNavigate();
  const { setSession } = useClarumAuth();

  const [step, setStep] = useState<"identifier" | "code">("identifier");
  const [rawInput, setRawInput] = useState("");
  const [identifier, setIdentifier] = useState<ParsedIdentifier | null>(null);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [expired, setExpired] = useState(false);
  const [success, setSuccess] = useState(false);
  const boxRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "code" && !sending && !verifying && !success) {
      setTimeout(() => boxRefs.current[0]?.focus(), 40);
    }
  }, [step, sending, verifying, success]);

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

  async function handleIdentifierSubmit(e: FormEvent) {
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
    setVerifying(true);
    setErr(null);
    setExpired(false);
    try {
      const res = await fetch(`${OTP_BASE}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(otpPayload(identifier, code)),
      });
      const data = (await res.json().catch(() => ({}))) as {
        verified?: boolean;
        token?: string;
        error?: string;
        remaining?: number;
      };
      if (data.verified === true && data.token) {
        setSuccess(true);
        setSigningIn(true);
        try {
          const payload =
            identifier.channel === "email"
              ? { email: identifier.email, token: data.token }
              : { phone: identifier.phone, token: data.token };
          const login = await otpLoginApi(payload);
          await setSession(login.token, login.user ?? null);
          const code10 = couponCode(login.welcome_coupon ?? undefined);
          if (login.is_new && code10) {
            toast.success("Welcome to Clarum", {
              description: `Your 10% code: ${code10}`,
              duration: 9000,
            });
          } else if (login.is_new) {
            toast.success("Account created");
          } else {
            toast.success("Welcome back");
          }
          navigate({ to: "/account" });
        } catch (e) {
          setSuccess(false);
          setErr(e instanceof Error ? e.message : "Sign-in failed.");
        } finally {
          setSigningIn(false);
        }
        return;
      }
      if ((data.error || "").toLowerCase().includes("expired")) {
        setExpired(true);
        setErr("Code expired. Send a new one?");
        setDigits(["", "", "", "", "", ""]);
        return;
      }
      const rem = typeof data.remaining === "number" ? data.remaining : null;
      setErr(
        rem !== null
          ? `Incorrect code — ${rem} ${rem === 1 ? "attempt" : "attempts"} left.`
          : data.error || "Incorrect code.",
      );
      setDigits(["", "", "", "", "", ""]);
      setTimeout(() => boxRefs.current[0]?.focus(), 40);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error.");
    } finally {
      setVerifying(false);
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
    if ((cooldown > 0 && !expired) || sending || verifying || !identifier) return;
    setDigits(["", "", "", "", "", ""]);
    await sendCode(identifier);
  }

  const sentToLabel =
    identifier && identifier.channel != null ? identifier.display : "";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBar />
      <SiteHeader />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
        <img
          src="/signin-bg.png"
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-background/55" />
        <section className="relative w-full max-w-lg p-8 sm:p-10">
          <div className="w-full">
            <Link to="/" className="animate-element inline-flex items-center mb-10">
              <img
                src={clarumLogo}
                alt="Clarum Research Peptides"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <h1 className="animate-element animate-delay-100 font-display text-5xl md:text-6xl leading-[1.05] text-foreground">
              {step === "code"
                ? "Check your inbox."
                : isSignUp
                  ? "Create account."
                  : "Welcome back."}
            </h1>
            <p className="animate-element animate-delay-200 mt-4 text-[15px] text-foreground/60 leading-relaxed">
              {step === "code" ? (
                <>
                  We sent a 6-digit code to{" "}
                  <span className="text-foreground font-medium">{sentToLabel}</span>.
                </>
              ) : (
                "We'll text or email you a one-time code. No password, no hassle."
              )}
            </p>

            {step === "identifier" ? (
              <form onSubmit={handleIdentifierSubmit} className="mt-8 space-y-4">
                <div>
                  <label
                    htmlFor="identifier"
                    className="block text-[13px] text-foreground/60 mb-2"
                  >
                    Email or phone
                  </label>
                  <GlassInputWrapper>
                    <input
                      id="identifier"
                      type="text"
                      autoComplete="email"
                      required
                      value={rawInput}
                      onChange={(e) => {
                        setRawInput(e.target.value);
                        if (err) setErr(null);
                      }}
                      placeholder="Email or phone #"
                      className="w-full bg-transparent text-[15px] px-4 py-3.5 rounded-2xl focus:outline-none placeholder:text-foreground/30"
                    />
                  </GlassInputWrapper>
                </div>

                {err && <p className="text-[13px] text-red-400">{err}</p>}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold text-brand-forest text-[15px] font-medium py-3.5 hover:bg-brand-gold-light transition-colors disabled:opacity-60"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Send my code <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <p className="pt-2 text-center text-[13px] text-foreground/55">
                  {isSignUp ? (
                    <>
                      Already have an account?{" "}
                      <Link
                        to="/sign-in"
                        className="text-brand-gold hover:underline underline-offset-4"
                      >
                        Sign in
                      </Link>
                    </>
                  ) : (
                    <>
                      New to Clarum?{" "}
                      <Link
                        to="/sign-up"
                        className="text-brand-gold hover:underline underline-offset-4"
                      >
                        Create account
                      </Link>
                    </>
                  )}
                </p>
              </form>
            ) : (
              <div className="mt-8 space-y-5">
                {success ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold bg-brand-gold/15">
                      <Check className="h-7 w-7 text-brand-gold" />
                    </div>
                    <p className="text-sm text-foreground/80">
                      {signingIn ? "Signing you in…" : "Verified"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div
                      className="flex justify-center gap-2 sm:gap-2.5"
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
                          disabled={verifying || sending}
                          aria-label={`Digit ${i + 1}`}
                          className={`h-14 w-12 sm:h-16 sm:w-14 rounded-2xl bg-black text-center font-display text-2xl text-foreground outline-none border transition-colors focus:border-brand-gold/60 ${
                            err ? "border-red-500/60" : "border-white/10"
                          }`}
                        />
                      ))}
                    </div>

                    <div className="min-h-[20px] text-center text-[13px]">
                      {sending ? (
                        <span className="inline-flex items-center gap-2 text-foreground/60">
                          <Loader2 className="h-3 w-3 animate-spin" /> Sending code…
                        </span>
                      ) : verifying ? (
                        <span className="inline-flex items-center gap-2 text-foreground/60">
                          <Loader2 className="h-3 w-3 animate-spin" /> Verifying…
                        </span>
                      ) : err ? (
                        <span className="text-red-400">{err}</span>
                      ) : (
                        <span className="text-foreground/40">
                          Code expires in ~10 minutes.
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col items-center gap-3 text-[13px]">
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={
                          (cooldown > 0 && !expired) || sending || verifying
                        }
                        className="font-medium text-brand-gold hover:underline underline-offset-4 disabled:text-foreground/30 disabled:no-underline disabled:cursor-not-allowed"
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
                        onClick={() => {
                          setStep("identifier");
                          setDigits(["", "", "", "", "", ""]);
                          setErr(null);
                          setExpired(false);
                        }}
                        className="text-foreground/50 hover:text-foreground/80 transition-colors"
                      >
                        Use a different email or phone
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
