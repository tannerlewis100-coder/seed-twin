import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import clarumLogo from "@/assets/clarum-logo.png";
import { loginApi, signupApi, couponCode, useClarumAuth } from "@/lib/clarum-auth";

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-black focus-within:border-brand-gold/60 transition-colors">
    {children}
  </div>
);

export type SignInMode = "signin" | "signup";

export function SignInForm({ mode }: { mode: SignInMode }) {
  const isSignUp = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [optIn, setOptIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setSession } = useClarumAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (isSignUp) {
        const res = await signupApi({
          email: email.trim(),
          password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          marketing_opt_in: optIn,
        });
        await setSession(res.token, res.user);
        const code = couponCode(res.welcome_coupon);
        if (code) {
          toast.success("Welcome to Clarum", {
            description: `Use code ${code} for 10% off your first order.`,
            duration: 8000,
          });
        } else {
          toast.success("Account created");
        }
        navigate({ to: "/account" });
      } else {
        const res = await loginApi({ username: email.trim(), password });
        await setSession(res.token);
        toast.success("Welcome back");
        navigate({ to: "/account" });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBar />
      <SiteHeader />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
        <img src="/signin-bg.png" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/55" />
        <section className="relative w-full max-w-lg p-8 sm:p-10">
          <div className="w-full">
            <Link to="/" className="animate-element inline-flex items-center mb-10">
              <img src={clarumLogo} alt="Clarum Research Peptides" className="h-10 w-auto object-contain" />
            </Link>

            <h1 className="animate-element animate-delay-100 font-display text-5xl md:text-6xl leading-[1.05] text-foreground">
              {isSignUp ? "Create account." : "Welcome back."}
            </h1>
            <p className="animate-element animate-delay-200 mt-4 text-[15px] text-foreground/60 leading-relaxed">
              {isSignUp
                ? "One account. COA library, batch records, order history. 10% off your first order."
                : "Pick up where you left off. Orders, batches, the whole library."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="first_name" className="block text-[13px] text-foreground/60 mb-2">First name</label>
                    <GlassInputWrapper>
                      <input
                        id="first_name"
                        type="text"
                        required
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-transparent text-[15px] px-4 py-3.5 rounded-2xl focus:outline-none placeholder:text-foreground/30"
                      />
                    </GlassInputWrapper>
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-[13px] text-foreground/60 mb-2">Last name</label>
                    <GlassInputWrapper>
                      <input
                        id="last_name"
                        type="text"
                        required
                        autoComplete="family-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-transparent text-[15px] px-4 py-3.5 rounded-2xl focus:outline-none placeholder:text-foreground/30"
                      />
                    </GlassInputWrapper>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-[13px] text-foreground/60 mb-2">
                  {isSignUp ? "Email address" : "Email or username"}
                </label>
                <GlassInputWrapper>
                  <input
                    id="email"
                    type={isSignUp ? "email" : "text"}
                    required
                    autoComplete={isSignUp ? "email" : "username"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-transparent text-[15px] px-4 py-3.5 rounded-2xl focus:outline-none placeholder:text-foreground/30"
                  />
                </GlassInputWrapper>
              </div>

              <div>
                <label htmlFor="password" className="block text-[13px] text-foreground/60 mb-2">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={isSignUp ? 8 : undefined}
                      autoComplete={isSignUp ? "new-password" : "current-password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isSignUp ? "At least 8 characters" : "Enter your password"}
                      className="w-full bg-transparent text-[15px] px-4 py-3.5 pr-12 rounded-2xl focus:outline-none placeholder:text-foreground/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-foreground/50 hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              {isSignUp && (
                <label className="flex items-start gap-2.5 text-[13px] text-foreground/70 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={optIn}
                    onChange={(e) => setOptIn(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 accent-brand-gold"
                  />
                  <span>
                    Email me batch drops, new compounds, and the occasional discount. No daily spam.
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold text-brand-forest text-[15px] font-medium py-3.5 hover:bg-brand-gold-light transition-colors disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSignUp ? "Create account" : "Sign in"}
              </button>
            </form>

            <p className="mt-8 text-center text-[14px] text-foreground/55">
              {isSignUp ? (
                <>Already have an account?{" "}
                  <Link to="/sign-in" className="text-brand-gold hover:underline underline-offset-4">Sign in</Link>
                </>
              ) : (
                <>New to Clarum?{" "}
                  <Link to="/sign-up" className="text-brand-gold hover:underline underline-offset-4">Create account</Link>
                </>
              )}
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
