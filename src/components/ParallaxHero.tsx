import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import vialImg from "@/assets/parallax-vial.png";

export function ParallaxHero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("lenis"),
        ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const trigger = rootRef.current?.querySelector("[data-parallax-layers]");
      const ctx = gsap.context(() => {
        if (!trigger) return;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger,
            start: "0% 0%",
            end: "100% 0%",
            scrub: 0,
          },
        });
        const layers = [
          { layer: "1", yPercent: 70 },
          { layer: "2", yPercent: 55 },
          { layer: "3", yPercent: 40 },
          { layer: "4", yPercent: 10 },
        ];
        layers.forEach((l, idx) => {
          tl.to(
            trigger.querySelectorAll(`[data-parallax-layer="${l.layer}"]`),
            { yPercent: l.yPercent, ease: "none" },
            idx === 0 ? undefined : "<",
          );
        });
      }, rootRef);

      const lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);
      const tickerCb = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerCb);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tickerCb);
        lenis.destroy();
        ctx.revert();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section ref={rootRef} className="parallax">
      <div className="parallax__header">
        <div className="parallax__visuals">
          <div className="parallax__layers" data-parallax-layers>
            {/* Layer 1: dark grid background */}
            <div className="parallax__layer parallax__bg" data-parallax-layer="1" />

            {/* Layer 2: powder cloud (CSS radial gradient) */}
            <div className="parallax__layer parallax__powder" data-parallax-layer="2" />

            {/* Layer 3: headline */}
            <div
              className="parallax__layer-title"
              data-parallax-layer="3"
            >
              <div className="parallax__eyebrow">RESEARCH-GRADE PEPTIDES</div>
              <h1 className="parallax__title">
                Nothing hidden.
                <br />
                Everything tested.
              </h1>
              <p className="parallax__sub">
                Independent 5-panel COA on every batch.
              </p>
              <div className="parallax__cta">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-brand-gold text-brand-forest hover:bg-brand-gold-light h-12 px-7 text-[14px]"
                >
                  <Link to="/shop">Shop the Catalog</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="rounded-full text-foreground hover:text-brand-gold hover:bg-transparent h-12 px-2 text-[14px]"
                >
                  <Link to="/coa-library">
                    View COA Library <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Layer 4: vial (foreground) */}
            <img
              src={vialImg}
              alt="Amber research peptide vial with gold cap"
              className="parallax__layer parallax__vial"
              data-parallax-layer="4"
              width={768}
              height={1024}
            />
          </div>
          <div className="parallax__fade" />
        </div>
      </div>
    </section>
  );
}

export default ParallaxHero;
