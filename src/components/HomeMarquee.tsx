import { useEffect, useState } from "react";
import { MARQUEE_MESSAGES, MARQUEE_REPEATS } from "@/lib/homeMarquee";

function Group({ hidden }: { hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={hidden ? "true" : undefined}
    >
      {MARQUEE_MESSAGES.map((m) => (
        <span key={m} className="flex items-center">
          <span className="px-10 sm:px-14 text-[11px] sm:text-[12px] uppercase tracking-[0.22em] text-brand-gold whitespace-nowrap">
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
        tabIndex={0}
        role="group"
        aria-label="Store highlights ticker. Focus or hover to pause scrolling."
        className="relative flex items-center h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-inset"
        onMouseEnter={() => animate && setPaused(true)}
        onMouseLeave={() => animate && setPaused(false)}
        onFocus={() => animate && setPaused(true)}
        onBlur={() => animate && setPaused(false)}
      >
        {animate ? (
          <div
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
      </div>
    </section>
  );
}
