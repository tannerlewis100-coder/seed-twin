import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"/>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"/>
  </svg>
);

const AppleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16.365 1.43c0 1.14-.42 2.22-1.26 3.06-.84.84-2.04 1.5-3.18 1.41-.12-1.14.42-2.34 1.2-3.12.84-.9 2.22-1.5 3.24-1.35zM20.43 17.13c-.57 1.32-.84 1.92-1.59 3.09-1.05 1.62-2.52 3.63-4.35 3.66-1.62.03-2.04-1.05-4.23-1.02-2.19.03-2.67 1.05-4.29 1.02-1.83-.03-3.21-1.86-4.26-3.48C-.96 16.83-1.26 11.4 1.05 8.49c1.65-2.07 4.23-3.27 6.66-3.27 2.46 0 4.02 1.35 6.06 1.35 1.98 0 3.18-1.35 6.06-1.35 2.16 0 4.44 1.17 6.06 3.21-5.34 2.91-4.47 10.5-1.74 12.39-.66 1.47-.93 2.04-1.71 3.31z"/>
  </svg>
);

interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

const testimonials: Testimonial[] = [
  { avatarSrc: "https://i.pravatar.cc/64?img=12", name: "Dr. Sarah Chen", handle: "@biopep_lab", text: "First vendor I've seen publishing raw HPLC traces per batch. Not a summary. The actual chromatogram." },
  { avatarSrc: "https://i.pravatar.cc/64?img=33", name: "Marcus K.", handle: "@longevitynerd", text: "COA up before checkout. This should be the floor, not the ceiling." },
  { avatarSrc: "https://i.pravatar.cc/64?img=45", name: "Bryne Research", handle: "@brynelabs", text: "Re-ran their TB-500 in-house. Numbers matched within 0.3%." },
];

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] focus-within:border-brand-gold/60 focus-within:bg-white/[0.06] transition-colors">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial; delay: string }) => (
  <div
    className={`animate-testimonial ${delay} rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-4 max-w-[280px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]`}
  >
    <div className="flex items-center gap-3 mb-2">
      <img src={testimonial.avatarSrc} alt="" className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15" />
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-foreground leading-tight truncate">{testimonial.name}</div>
        <div className="text-[11px] text-foreground/50 leading-tight">{testimonial.handle}</div>
      </div>
    </div>
    <p className="text-[13px] text-foreground/80 leading-snug">{testimonial.text}</p>
  </div>
);

export type SignInMode = "signin" | "signup";

export function SignInForm({ mode }: { mode: SignInMode }) {
  const isSignUp = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [appleSubmitting, setAppleSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Check your email", { description: "We sent you a confirmation link to finish signing up." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/" });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    if (googleSubmitting) return;
    setGoogleSubmitting(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error instanceof Error ? result.error.message : "Google sign-in failed");
        setGoogleSubmitting(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      setGoogleSubmitting(false);
    }
  };

  const handleApple = async () => {
    if (appleSubmitting) return;
    setAppleSubmitting(true);
    try {
      const result = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error instanceof Error ? result.error.message : "Apple sign-in failed");
        setAppleSubmitting(false);
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Apple sign-in failed");
      setAppleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex">
      {/* LEFT: form */}
      <section className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          {/* Brand */}
          <Link to="/" className="animate-element inline-flex items-center gap-1.5 font-display text-[26px] tracking-tight text-foreground mb-10">
            clarum
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold translate-y-1.5" />
          </Link>

          <h1 className="animate-element animate-delay-100 font-display text-5xl md:text-6xl leading-[1.05] text-foreground">
            {isSignUp ? "Create account." : "Welcome back."}
          </h1>
          <p className="animate-element animate-delay-200 mt-4 text-[15px] text-foreground/60 leading-relaxed">
            {isSignUp
              ? "One account. COA library, batch records, order history."
              : "Pick up where you left off. Orders, batches, the whole library."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="animate-element animate-delay-300">
              <label htmlFor="email" className="block text-[13px] text-foreground/60 mb-2">Email Address</label>
              <GlassInputWrapper>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@lab.com"
                  className="w-full bg-transparent text-[15px] px-4 py-3.5 rounded-2xl focus:outline-none placeholder:text-foreground/30"
                />
              </GlassInputWrapper>
            </div>

            <div className="animate-element animate-delay-400">
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

            {!isSignUp && (
              <div className="animate-element animate-delay-500 flex items-center justify-between text-[13px]">
                <label className="flex items-center gap-2 text-foreground/70 cursor-pointer">
                  <input type="checkbox" className="custom-checkbox" defaultChecked />
                  Keep me signed in
                </label>
                <button type="button" className="text-brand-gold hover:underline underline-offset-4">
                  Reset password
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="animate-element animate-delay-600 w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold text-brand-forest text-[15px] font-medium py-3.5 hover:bg-brand-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="animate-element animate-delay-700 my-6 flex items-center gap-4 text-[12px] text-foreground/40 uppercase tracking-[0.18em]">
            <span className="h-px flex-1 bg-white/10" />
            Or continue with
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleSubmitting}
            className="animate-element animate-delay-800 w-full inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-foreground text-[15px] py-3.5 transition-colors disabled:opacity-60"
          >
            {googleSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>

          <p className="animate-element animate-delay-900 mt-8 text-center text-[14px] text-foreground/55">
            {isSignUp ? (
              <>Already have an account?{" "}
                <Link to="/sign-in" className="text-brand-gold hover:underline underline-offset-4">Sign In</Link>
              </>
            ) : (
              <>New to Clarum?{" "}
                <Link to="/sign-up" className="text-brand-gold hover:underline underline-offset-4">Create Account</Link>
              </>
            )}
          </p>
        </div>
      </section>

      {/* RIGHT: hero + testimonials */}
      <aside className="hidden lg:block relative flex-1 overflow-hidden bg-brand-forest-deep">
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />

        <div className="absolute bottom-8 right-8 flex flex-col gap-3 items-end">
          <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
          <TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" />
          <TestimonialCard testimonial={testimonials[2]} delay="animate-delay-1400" />
        </div>
      </aside>
    </div>
  );
}
