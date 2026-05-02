import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import promoVials from "@/assets/promo-vials.png";
import { toast } from "sonner";

const STORAGE_KEY = "clarum_promo_dismissed";
const DELAY_MS = 4000;

export function PromoPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

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
      await navigator.clipboard.writeText("CLARUM10");
      toast.success("Copied CLARUM10");
    } catch {
      toast.error("Couldn't copy. Code is CLARUM10.");
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
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
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
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-black md:aspect-auto md:min-h-[460px]">
            <img
              src={promoVials}
              alt="Clarum research peptide vials"
              className="h-full w-full object-cover"
            />
            <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-lg">
              First order
            </div>
          </div>

          <div className="flex flex-col justify-center gap-5 p-8 md:p-10">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Welcome
              </p>
              <h2 className="font-display text-4xl leading-tight text-foreground md:text-5xl">
                10% off your first order.
              </h2>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Same vials. Same Eurofins panel out of Lancaster, Pennsylvania. A small
              thank you for trying us first.
            </p>

            <button
              onClick={copyCode}
              className="group w-full rounded-md border-2 border-dashed border-primary/60 bg-primary/5 px-4 py-3.5 text-center font-mono text-lg tracking-[0.3em] text-foreground transition hover:border-primary hover:bg-primary/10"
            >
              CLARUM10
              <span className="ml-2 text-xs tracking-normal text-muted-foreground group-hover:text-foreground">
                (tap to copy)
              </span>
            </button>

            <Link
              to="/promo"
              onClick={close}
              className="block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              See the offer
            </Link>

            <button
              onClick={close}
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              No thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
