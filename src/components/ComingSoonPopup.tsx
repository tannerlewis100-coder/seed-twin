import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "clarum_coming_soon_dismissed";

export function ComingSoonPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 600);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Coming soon"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-border bg-card p-8 text-center shadow-2xl md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          className="absolute right-3 top-3 rounded-full bg-black/40 p-1.5 text-white transition hover:bg-black/70"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Heads up
        </p>
        <h2 className="mt-3 font-display text-4xl leading-tight text-foreground md:text-5xl">
          Coming soon.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          We're putting the finishing touches on the shop. Orders open shortly. Check back in a few days.
        </p>

        <button
          onClick={close}
          className="mt-6 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
