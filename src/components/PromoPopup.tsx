import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import promoVials from "@/assets/promo-vials.png";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "clarum_promo_dismissed";
const REVEALED_KEY = "clarum_promo_revealed";
const DELAY_MS = 4000;
const PROMO_CODE = "CLARUM10";

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    if (localStorage.getItem(REVEALED_KEY)) {
      // Already signed up before — don't pester them.
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;
    let triggered = false;

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      cleanup();
      timer = setTimeout(() => setOpen(true), DELAY_MS);
    };

    const cleanup = () => {
      window.removeEventListener("click", trigger);
      window.removeEventListener("scroll", trigger);
      window.removeEventListener("keydown", trigger);
      window.removeEventListener("touchstart", trigger);
    };

    window.addEventListener("click", trigger, { once: true });
    window.addEventListener("scroll", trigger, { once: true, passive: true });
    window.addEventListener("keydown", trigger, { once: true });
    window.addEventListener("touchstart", trigger, { once: true, passive: true });

    return () => {
      cleanup();
      if (timer) clearTimeout(timer);
    };
  }, []);

  const close = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      toast.success(`Copied ${PROMO_CODE}`);
    } catch {
      toast.error(`Couldn't copy. Code is ${PROMO_CODE}.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedEmail && !trimmedPhone) {
      toast.error("Enter an email or phone number.");
      return;
    }

    if (trimmedEmail && !emailRx.test(trimmedEmail)) {
      toast.error("Enter a valid email.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase
      .from("promo_signups")
      .insert({
        ...(trimmedEmail ? { email: trimmedEmail } : {}),
        ...(trimmedPhone ? { phone: trimmedPhone } : {}),
        source: "popup",
      } as any);
    setSubmitting(false);

    // Duplicate email is fine. Still reveal the code.
    if (error && error.code !== "23505") {
      toast.error("Something broke. Try again.");
      return;
    }

    localStorage.setItem(REVEALED_KEY, "1");
    setRevealed(true);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="10 percent off first order"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl border border-border bg-card shadow-2xl md:max-w-3xl md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-1.5 text-white transition hover:bg-black/70"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-black md:aspect-auto md:min-h-[480px]">
            <img
              src={promoVials}
              alt="Clarum research peptide vials"
              className="h-full w-full object-cover"
            />
            <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lg">
              First order
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3.5 p-5 md:gap-5 md:p-10">
            {!revealed ? (
              <>
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Welcome
                  </p>
                  <h2 className="font-display text-2xl leading-tight text-foreground md:text-5xl">
                    10% off your first order.
                  </h2>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  Drop your email or phone number. We'll send the code, plus a
                  heads-up when new products drop or a discount goes live. No
                  fluff, no daily blasts.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={submitting}
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={submitting}
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                  >
                    {submitting ? "Sending..." : "Reveal my code"}
                  </button>
                </form>

                <button
                  onClick={close}
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  No thanks
                </button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                    <Check className="h-4 w-4" /> You're in
                  </div>
                  <h2 className="font-display text-2xl leading-tight text-foreground md:text-5xl">
                    Here's your code.
                  </h2>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  Use it at checkout. Good for 10% off your first order.
                </p>

                <button
                  onClick={copyCode}
                  className="group w-full rounded-md border-2 border-dashed border-primary/60 bg-primary/5 px-4 py-3.5 text-center font-mono text-lg tracking-[0.3em] text-foreground transition hover:border-primary hover:bg-primary/10"
                >
                  {PROMO_CODE}
                  <span className="ml-2 text-xs tracking-normal text-muted-foreground group-hover:text-foreground">
                    (tap to copy)
                  </span>
                </button>

                <button
                  onClick={close}
                  className="block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Start shopping
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
