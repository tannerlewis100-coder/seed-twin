import { useEffect, useState } from "react";
import { FlaskConical } from "lucide-react";

export function ComingSoonPopup() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-background/95 p-4 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Coming soon"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/3 translate-y-1/3 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border/80 bg-card/90 px-6 py-10 text-center shadow-2xl backdrop-blur-md md:px-12 md:py-14">
        {/* corner accents */}
        <div className="pointer-events-none absolute left-0 top-0 h-12 w-12 border-l border-t border-primary/40" />
        <div className="pointer-events-none absolute right-0 top-0 h-12 w-12 border-r border-t border-primary/40" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-12 w-12 border-b border-l border-primary/40" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-12 w-12 border-b border-r border-primary/40" />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
          <FlaskConical className="h-6 w-6 text-primary" />
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Launching soon
          </span>
        </div>

        <h2 className="mt-5 font-display text-5xl leading-[1.05] text-foreground md:text-6xl">
          Coming soon.
        </h2>

        <div className="mt-8 flex items-center justify-center gap-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <span className="font-display text-lg text-foreground">5</span>
            <span>panel test</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center gap-1">
            <span className="font-display text-lg text-foreground">99%+</span>
            <span>purity</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center gap-1">
            <span className="font-display text-lg text-foreground">Every</span>
            <span>batch</span>
          </div>
        </div>
      </div>
    </div>
  );
}
