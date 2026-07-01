import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import clarumLogo from "@/assets/clarum-logo.png";
import { couponCode, otpLoginApi, useClarumAuth } from "@/lib/clarum-auth";
import { ClarumOtpDialog, type ClarumOtpResult } from "@/components/ClarumOtpDialog";

export type SignInMode = "signin" | "signup";

export function SignInForm({ mode }: { mode: SignInMode }) {
  const isSignUp = mode === "signup";
  const navigate = useNavigate();
  const { setSession } = useClarumAuth();
  const [handoffError, setHandoffError] = useState<string | null>(null);

  async function handleVerified(result: ClarumOtpResult) {
    setHandoffError(null);
    try {
      const payload =
        result.channel === "email"
          ? { email: result.identifier, token: result.token }
          : { phone: result.identifier, token: result.token };
      const res = await otpLoginApi(payload);
      await setSession(res.token, res.user ?? null);
      const code = couponCode(res.welcome_coupon);
      if (res.is_new && code) {
        toast.success("Welcome to Clarum", {
          description: `Your 10% code: ${code}`,
          duration: 9000,
        });
      } else if (res.is_new) {
        toast.success("Account created");
      } else {
        toast.success("Welcome back");
      }
      navigate({ to: "/account" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign-in failed.";
      setHandoffError(msg);
      throw err;
    }
  }

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
        <div className="absolute inset-0 bg-background/70" />
        <section className="relative w-full max-w-lg">
          <Link to="/" className="mb-6 inline-flex items-center justify-center w-full">
            <img
              src={clarumLogo}
              alt="Clarum Research Peptides"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <ClarumOtpDialog
            mode="inline"
            showLogo={false}
            eyebrow={isSignUp ? "Create your account" : "Sign in"}
            title="Sign in or sign up"
            subtitle="We'll text or email you a one-time code. No password, no hassle."
            sendLabel="Send my code"
            onVerified={handleVerified}
          />

          {handoffError && (
            <p className="mt-4 text-center text-sm text-red-400">{handoffError}</p>
          )}

          <p className="mt-8 text-center text-[13px] text-foreground/55">
            One account, same code every visit. COA library, batch records, order
            history, 10% off your first order.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
