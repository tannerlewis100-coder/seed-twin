import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { MARQUEE_MESSAGES, MARQUEE_REPEATS } from "@/lib/homeMarquee";

function Group({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={hidden ? "true" : undefined}
    >
      {MARQUEE_MESSAGES.map((m) => (
        <span key={m} className="flex items-center">
          <span className="px-6 text-[11px] sm:text-[12px] uppercase tracking-[0.22em] text-foreground/70 whitespace-nowrap">
            {m}
          </span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-brand-gold/50" />
        </span>
      ))}
    </div>
  );
}

export default function HomeMarquee() {
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const animate = !reduced;

  return (
    <section
      aria-label="Store highlights"
      data-testid="home-marquee"
      className="relative bg-brand-forest-deep border-b border-white/[0.08] overflow-hidden"
    >
      <div
        className="relative flex items-center h-[52px]"
        onMouseEnter={() => animate && setPaused(true)}
        onMouseLeave={() => animate && setPaused(false)}
        onFocusCapture={() => animate && setPaused(true)}
        onBlurCapture={() => animate && setPaused(false)}
      >
        {animate ? (
          <div
            ref={ref}
            className="flex w-max marquee-track"
            style={{ animationPlayState: paused ? "paused" : "running" }}
          >
            {Array.from({ length: MARQUEE_REPEATS * 2 }).map((_, i) => (
              <Group key={i} hidden={i > 0} />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center w-full py-2">
            <Group />
          </div>
        )}

        {animate && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play highlights ticker" : "Pause highlights ticker"}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border border-white/15 bg-background/80 backdrop-blur flex items-center justify-center text-brand-gold hover:border-brand-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </section>
  );
}
