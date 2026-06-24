import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import promoVials from "@/assets/promo-vials.png";
import { toast } from "sonner";
import { newsletterApi, couponCode } from "@/lib/clarum-auth";

const STORAGE_KEY = "clarum_promo_dismissed";
const REVEALED_KEY = "clarum_promo_revealed";
const REVEALED_CODE_KEY = "clarum_promo_code";
const DELAY_MS = 30000; // 30s on first visit
const FALLBACK_CODE = "CLARUM10";

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PromoPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [code, setCode] = useState(FALLBACK_CODE);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    if (localStorage.getItem(REVEALED_KEY)) {
      // Already signed up — don't pester them.
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;
    let triggered = false;

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      cleanup();
      setOpen(true);
    };

    const cleanup = () => {
      document.removeEventListener("mouseout", onMouseOut);
      if (timer) clearTimeout(timer);
    };

    const onMouseOut = (e: MouseEvent) => {
      // Exit-intent: cursor leaves through the top of the viewport
      if (e.relatedTarget) return;
      if (e.clientY <= 0) trigger();
    };

    // 30s delay on first visit
    timer = setTimeout(trigger, DELAY_MS);
    document.addEventListener("mouseout", onMouseOut);

    return cleanup;
  }, []);

  const close = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(`Copied ${code}`);
    } catch {
      toast.error(`Couldn't copy. Code is ${code}.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Enter your email.");
      return;
    }
    if (!emailRx.test(trimmedEmail)) {
      toast.error("Enter a valid email.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await newsletterApi(trimmedEmail);
      const revealedCode = couponCode(res.coupon) || FALLBACK_CODE;
      setCode(revealedCode);
      localStorage.setItem(REVEALED_KEY, "1");
      localStorage.setItem(REVEALED_CODE_KEY, revealedCode);
      setRevealed(true);
    } catch (err) {
      // Even on duplicate / soft error, reveal the fallback code.
      const msg = err instanceof Error ? err.message : "";
      if (/already|exists|subscribed/i.test(msg)) {
        localStorage.setItem(REVEALED_KEY, "1");
        setRevealed(true);
      } else {
        toast.error(msg || "Something broke. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };


  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="10 percent off first order"
      aria-describedby="promo-popup-desc"
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
          <div className="relative w-full overflow-hidden bg-black aspect-[4/3] md:aspect-auto md:min-h-[480px]">
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

                <p id="promo-popup-desc" className="text-sm leading-relaxed text-muted-foreground">
                  Enter your email. Get the code and an alert when we drop new
                  batches.
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
                  <button
                    type="submit"
                    disabled={submitting}
                    className="block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                  >
                    {submitting ? "Sending..." : "Reveal my code"}
                  </button>
                  <p className="text-[11px] leading-relaxed text-muted-foreground/80">
                    You can unsubscribe anytime. We never share your email.
                  </p>
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
                  {code}
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
