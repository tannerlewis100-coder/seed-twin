import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";
import promoVials from "@/assets/promo-vials.png";

export const Route = createFileRoute("/promo")({
  component: PromoPage,
  head: () => ({
    meta: [
      { title: "10% Off Your First Order | CLARUM" },
      {
        name: "description",
        content:
          "Take 10% off your first Clarum order with code CLARUM10. Batch-tested research peptides, every COA public.",
      },
      { property: "og:title", content: "10% Off Your First Order — CLARUM" },
      {
        property: "og:description",
        content: "Code CLARUM10 at checkout. One-time use, first order only.",
      },
      { property: "og:image", content: promoVials },
      { name: "twitter:image", content: promoVials },
    ],
  }),
});

const CODE = "CLARUM10";

function getDeadline() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  d.setHours(23, 59, 59, 0);
  return d;
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return useMemo(() => {
    const ms = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((ms / (1000 * 60)) % 60);
    const secs = Math.floor((ms / 1000) % 60);
    return { days, hours, mins, secs };
  }, [now, target]);
}

function PromoPage() {
  const deadline = useMemo(() => getDeadline(), []);
  const { days, hours, mins, secs } = useCountdown(deadline);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(CODE);
      toast.success(`Copied ${CODE}`);
    } catch {
      toast.error("Couldn't copy. Long-press to select.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <Toaster />
      <main>
        {/* HERO */}
        <section className="relative bg-background border-b border-white/[0.08] overflow-hidden">
          <div className="absolute inset-0 gold-line-texture pointer-events-none" />
          <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-brand-gold/[0.06] blur-[140px] pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-16 lg:pt-24 pb-20 lg:pb-28 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Copy */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="h-px w-8 bg-brand-gold/40" />
                <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                  First-order offer
                </span>
              </div>

              <h1 className="font-display text-[44px] md:text-6xl lg:text-[80px] leading-[1.02] text-foreground tracking-[-0.02em]">
                <RevealText text={"10% off your\nfirst order."} stagger={55} />
              </h1>

              <RevealOnScroll
                as="p"
                delay={250}
                className="mt-7 text-[15px] lg:text-[17px] text-foreground/65 leading-[1.6] max-w-xl"
              >
                One code. One order. Same five-panel COA on every batch. Use it
                on a single vial of BPC-157 or load up the cart. Doesn't matter
                to us.
              </RevealOnScroll>

              {/* Code block */}
              <div className="mt-10 max-w-md">
                <div className="flex items-stretch gap-2 rounded-2xl border border-brand-gold/40 bg-brand-gold/[0.06] p-2">
                  <div className="flex-1 flex flex-col items-center justify-center px-4 py-2">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-brand-gold/80">
                      Code
                    </div>
                    <div className="font-display text-2xl md:text-3xl text-foreground tracking-[0.18em]">
                      {CODE}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-gold text-brand-forest text-sm font-medium px-5 hover:bg-brand-gold-light transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                </div>
                <p className="mt-3 text-xs text-foreground/45">
                  Auto-applies at checkout. One use per researcher.
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-gold text-brand-forest h-12 px-7 text-[14px] font-medium hover:bg-brand-gold-light transition-colors"
                >
                  Shop the Catalog <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/coa-library"
                  className="inline-flex items-center gap-2 rounded-full text-foreground hover:text-brand-gold h-12 px-2 text-[14px] transition-colors"
                >
                  View the COA Library
                </Link>
              </div>
            </div>

            {/* Photo */}
            <div className="lg:col-span-6 order-1 lg:order-2 relative">
              <div className="relative rounded-[28px] overflow-hidden border border-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]">
                <img
                  src={promoVials}
                  alt="Three Clarum research peptide vials: BPC-157, GHK-Cu, and TB500, photographed in warm afternoon light."
                  className="w-full h-auto block"
                  loading="eager"
                />
                {/* Floating discount sticker */}
                <div className="absolute -top-5 -left-5 sm:-top-7 sm:-left-7 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-brand-gold text-brand-forest flex flex-col items-center justify-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.6)] -rotate-12">
                  <div className="font-display text-3xl sm:text-4xl leading-none">10%</div>
                  <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] mt-1 font-semibold">
                    Off
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <div className="mt-6 grid grid-cols-4 gap-3 max-w-md mx-auto lg:mx-0">
                {[
                  { label: "Days", value: days },
                  { label: "Hours", value: hours },
                  { label: "Mins", value: mins },
                  { label: "Secs", value: secs },
                ].map((u) => (
                  <div
                    key={u.label}
                    className="rounded-2xl border border-white/10 bg-brand-forest-deep px-3 py-3 text-center"
                  >
                    <div className="font-display text-2xl text-brand-gold tabular-nums leading-none">
                      {String(u.value).padStart(2, "0")}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-foreground/50 mt-2">
                      {u.label}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-foreground/45 text-center lg:text-left">
                Promo ends{" "}
                {deadline.toLocaleDateString(undefined, { weekday: "long" })} at
                midnight EST.
              </p>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="bg-card border-b border-white/[0.08]">
          <div className="mx-auto max-w-5xl px-6 py-20 lg:py-24">
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  title: "Same panel, every time",
                  desc: "HPLC, mass spec, ICP-MS heavy metals, microbial, and LAL endotoxin. Run at Eurofins in Lancaster, PA.",
                },
                {
                  title: "Public batch COA",
                  desc: "Scan the QR on the vial. The exact lot you received is in the library, not a recycled PDF.",
                },
                {
                  title: "Code stacks with nothing",
                  desc: "We don't run influencer codes, so there's nothing to stack. Just 10% off, one time, on your first order.",
                },
              ].map((b) => (
                <RevealOnScroll key={b.title} className="flex flex-col gap-3">
                  <span className="w-9 h-9 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center">
                    <Check className="h-4 w-4 text-brand-gold" />
                  </span>
                  <h3 className="font-display text-xl text-foreground leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-sm text-foreground/60 leading-[1.6]">{b.desc}</p>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Fine print */}
        <section className="bg-background">
          <div className="mx-auto max-w-3xl px-6 py-16 text-center">
            <h2 className="font-display text-2xl md:text-3xl text-foreground leading-tight">
              <RevealText text="The fine print, kept short." />
            </h2>
            <p className="mt-5 text-sm text-foreground/55 leading-[1.7]">
              Code <span className="text-brand-gold font-semibold">{CODE}</span>{" "}
              takes 10% off your first Clarum order. One use per customer. Not
              valid on bulk research orders over $1,000. Email us instead, we'll
              do better. For in vitro laboratory research use only.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-brand-gold text-brand-forest h-12 px-7 text-[14px] font-medium hover:bg-brand-gold-light transition-colors"
              >
                Use the code <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 text-foreground hover:text-brand-gold hover:border-brand-gold/40 bg-transparent h-12 px-7 text-[14px] transition-colors"
              >
                Bulk inquiry
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
