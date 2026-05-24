import { useRef, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent, type MotionValue } from "framer-motion";
import { ChevronDown, FlaskConical, Atom, Shield, Bug, Fingerprint, ArrowRight } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import vialHero from "@/assets/products/bpc157-20mg.png";
import { peptides } from "@/data/peptides";
import { vialImageFor } from "@/lib/vialImages";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CLARUM — Batch-Tested Research Peptides | Nothing Hidden. Everything Tested." },
      {
        name: "description",
        content:
          "Research peptides with a 5-panel Certificate of Analysis on every batch: HPLC, mass spec, heavy metals, microbial, endotoxin. For in vitro laboratory research use only.",
      },
      { property: "og:title", content: "CLARUM — Nothing Hidden. Everything Tested." },
      {
        property: "og:description",
        content:
          "Full-panel tested research peptides. Every batch ships with a public Certificate of Analysis.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="bg-[#0a0a0a] text-foreground">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <HeroPin />
        <LabPanelsPin />
        <StatsPin />
        <ShowcasePin />
        <FinalCtaPin />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section 1 — Hero pin                                                */
/* ------------------------------------------------------------------ */

const HERO_WORDS = ["Batch-Tested.", "Lab-Verified.", "Nothing", "Hidden."];

function HeroPin() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const vialScale = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const vialRotate = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const vialY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.15, 0.7, 0.95], [0, 1, 1, 0]);
  const subOpacity = useTransform(scrollYProgress, [0.25, 0.5, 0.9, 1], [0, 1, 1, 0]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.1, 0.3], [1, 1, 0]);

  return (
    <section ref={ref} className="relative" style={{ height: "180vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0a0a]">
        {/* Subtle radial gold glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212,167,69,0.10) 0%, rgba(10,10,10,0) 60%)",
          }}
        />

        {/* Headline */}
        <motion.h1
          style={{ opacity: headlineOpacity }}
          className="absolute inset-x-0 top-[12vh] z-20 mx-auto max-w-[1400px] px-6 text-center font-display text-foreground tracking-[-0.03em] text-[14vw] sm:text-[10vw] lg:text-[8.5vw] leading-[0.95]"
        >
          {HERO_WORDS.map((w, i) => (
            <WordReveal key={w} progress={scrollYProgress} index={i} total={HERO_WORDS.length}>
              {w}
            </WordReveal>
          ))}
        </motion.h1>

        {/* Vial */}
        <motion.div
          style={{ scale: vialScale, rotate: vialRotate, y: vialY }}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <img
            src={vialHero}
            alt="Clarum research peptide vial"
            draggable={false}
            className="h-[70vh] w-auto object-contain select-none"
            style={{ filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.7))" }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          style={{ opacity: subOpacity }}
          className="absolute inset-x-0 bottom-[18vh] z-20 mx-auto max-w-2xl px-6 text-center text-base sm:text-lg text-foreground/70 leading-relaxed"
        >
          Research peptides built for researchers who don't take "trust me" for an answer.
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-2 text-[#D4A745]"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/50">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function WordReveal({
  progress,
  index,
  total,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  children: React.ReactNode;
}) {
  const start = 0.05 + (index / total) * 0.35;
  const end = start + 0.12;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [20, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block mr-[0.25em]">
      {children}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2 — Five lab panels                                         */
/* ------------------------------------------------------------------ */

const PANELS = [
  { icon: FlaskConical, label: "HPLC", angle: -90 },
  { icon: Atom, label: "Mass Spec", angle: -18 },
  { icon: Shield, label: "Endotoxin", angle: 54 },
  { icon: Bug, label: "Sterility", angle: 126 },
  { icon: Fingerprint, label: "Identity", angle: 198 },
];

function LabPanelsPin() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const headlineY = useTransform(scrollYProgress, [0, 0.25], [60, 0]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const vialScale = useTransform(scrollYProgress, [0, 1], [0.55, 0.5]);

  return (
    <section ref={ref} className="relative bg-[#0a0a0a]" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 55%, rgba(212,167,69,0.08), rgba(10,10,10,0) 55%)",
          }}
        />

        <motion.h2
          style={{ y: headlineY, opacity: headlineOpacity }}
          className="absolute inset-x-0 top-[10vh] z-30 text-center font-display tracking-[-0.02em] text-foreground text-4xl sm:text-5xl lg:text-6xl px-6"
        >
          Five lab panels. <span className="text-[#D4A745]">Every batch.</span>
        </motion.h2>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[min(80vw,640px)] aspect-square">
            {/* Orbit ring */}
            <div className="absolute inset-[14%] rounded-full border border-[#D4A745]/15" />
            <div className="absolute inset-[6%] rounded-full border border-[#D4A745]/8" />

            {/* Center vial */}
            <motion.div
              style={{ scale: vialScale }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img
                src={vialHero}
                alt=""
                draggable={false}
                className="h-[55%] w-auto object-contain select-none"
                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.7))" }}
              />
            </motion.div>

            {/* Orbiting icons */}
            {PANELS.map((p, i) => (
              <OrbitIcon
                key={p.label}
                progress={scrollYProgress}
                index={i}
                total={PANELS.length}
                angle={p.angle}
                Icon={p.icon}
                label={p.label}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OrbitIcon({
  progress,
  index,
  total,
  angle,
  Icon,
  label,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  angle: number;
  Icon: typeof FlaskConical;
  label: string;
}) {
  const start = 0.15 + (index / total) * 0.55;
  const end = start + 0.12;

  const rad = (angle * Math.PI) / 180;
  // radius as % of container
  const r = 44;
  const targetX = Math.cos(rad) * r;
  const targetY = Math.sin(rad) * r;

  // come from offscreen toward orbit position
  const fromX = targetX * 3;
  const fromY = targetY * 3;

  const x = useTransform(progress, [start, end], [fromX, targetX]);
  const y = useTransform(progress, [start, end], [fromY, targetY]);
  const opacity = useTransform(progress, [start, start + 0.02, end], [0, 1, 1]);
  const labelOpacity = useTransform(progress, [end - 0.02, end + 0.05], [0, 1]);

  return (
    <motion.div
      style={{
        x: useTransform(x, (v) => `${v}%`),
        y: useTransform(y, (v) => `${v}%`),
        opacity,
      }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3"
    >
      <div className="h-14 w-14 rounded-full border border-[#D4A745]/40 bg-[#0a0a0a]/80 backdrop-blur flex items-center justify-center text-[#D4A745] shadow-[0_0_30px_rgba(212,167,69,0.2)]">
        <Icon className="h-6 w-6" />
      </div>
      <motion.span
        style={{ opacity: labelOpacity }}
        className="text-xs sm:text-sm tracking-[0.15em] uppercase text-foreground/80 whitespace-nowrap"
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Section 3 — Stats counter                                           */
/* ------------------------------------------------------------------ */

const STATS = [
  { target: 86, suffix: "", label: "Compounds" },
  { target: 100, suffix: "%", label: "COAs Public" },
  { target: 0, suffix: "", label: "Failed Batches", static: true },
];

function StatsPin() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={ref} className="relative" style={{ height: "180vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(212,167,69,0.04), rgba(10,10,10,0) 40%, rgba(212,167,69,0.05))",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
            {STATS.map((s, i) => (
              <Counter key={s.label} progress={scrollYProgress} index={i} {...s} />
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link
              to="/coa-library"
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-[#D4A745] transition-colors"
            >
              Browse our COA library — every batch, no login.
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Counter({
  progress,
  index,
  target,
  suffix,
  label,
  static: isStatic,
}: {
  progress: MotionValue<number>;
  index: number;
  target: number;
  suffix: string;
  label: string;
  static?: boolean;
}) {
  const start = 0.1 + index * 0.05;
  const end = 0.6;
  const value = useTransform(progress, [start, end], [0, target]);
  const smooth = useSpring(value, { stiffness: 60, damping: 20, mass: 0.4 });
  const [display, setDisplay] = useState(isStatic ? target : 0);

  useMotionValueEvent(smooth, "change", (v) => {
    if (isStatic) return;
    setDisplay(Math.round(v));
  });

  return (
    <div>
      <div className="font-display text-[#D4A745] text-7xl sm:text-8xl lg:text-9xl tracking-[-0.04em] leading-none">
        {display}
        {suffix}
      </div>
      <div className="mt-4 text-[11px] sm:text-xs tracking-[0.3em] uppercase text-foreground/60">
        {label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section 4 — Product showcase (horizontal scroll)                    */
/* ------------------------------------------------------------------ */

const SHOWCASE_SLUGS = [
  "bpc-157-10mg",
  "sermorelin",
  "nad-500mg",
  "glp-1-s-20mg",
  "wolverine-10mg",
  "klow-blend",
  "ghk-cu-50mg",
  "tb-500-10mg",
];

function ShowcasePin() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const cards = SHOWCASE_SLUGS.map((slug) => peptides.find((p) => p.slug === slug)).filter(
    Boolean,
  ) as typeof peptides;

  // need to translate horizontally enough to reveal all cards
  const x = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "-78%"]);

  return (
    <section ref={ref} className="relative bg-[#0a0a0a]" style={{ height: "260vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        <div className="pt-[10vh] pb-8 px-6 text-center">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-[-0.02em] text-foreground">
            86 compounds. <span className="text-[#D4A745]">One standard.</span>
          </h2>
          <p className="mt-4 text-foreground/60 text-sm sm:text-base">
            Every vial. Every batch. Same five-panel COA.
          </p>
        </div>

        <div className="flex-1 flex items-center overflow-hidden">
          <motion.div style={{ x }} className="flex gap-6 sm:gap-8 pl-[6vw] will-change-transform">
            {cards.map((p) => (
              <ProductCard key={p.slug} peptide={p} />
            ))}
            <div className="flex items-center justify-center min-w-[60vw] sm:min-w-[40vw]">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-[#D4A745] text-[#0a0a0a] hover:bg-[#e8bb5b] h-12 px-8 text-sm"
              >
                <Link to="/shop">
                  View all compounds <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ peptide }: { peptide: (typeof peptides)[number] }) {
  const img = vialImageFor(peptide.name, peptide.slug);
  return (
    <Link
      to="/shop"
      className="group relative block w-[68vw] sm:w-[42vw] lg:w-[28vw] max-w-[420px] aspect-[3/4] rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] overflow-hidden transition-all duration-500 hover:border-[#D4A745]/40 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(212,167,69,0.35)]"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 30%, rgba(212,167,69,0.18), transparent 60%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 bottom-24 flex items-center justify-center p-8">
        <img
          src={img}
          alt={peptide.name}
          draggable={false}
          data-allow-transform
          className="h-full w-auto object-contain select-none transition-transform duration-700 group-hover:scale-105"
          style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.55))" }}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-6 border-t border-white/[0.06]">
        <div className="font-display text-xl text-foreground tracking-tight">{peptide.name}</div>
        <div className="mt-1 text-xs text-foreground/50">{peptide.size}</div>
        <div className="mt-3 text-sm text-[#D4A745]">Starting at ${peptide.price}</div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Section 5 — Final CTA                                               */
/* ------------------------------------------------------------------ */

function FinalCtaPin() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.95]);
  const textOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);

  return (
    <section ref={ref} className="relative" style={{ height: "180vh" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(212,167,69,0.14), rgba(10,10,10,0) 60%)",
          }}
        />

        <motion.div
          style={{ rotate, scale }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <img
            src={vialHero}
            alt=""
            draggable={false}
            className="h-[55vh] w-auto object-contain opacity-90 select-none"
            style={{ filter: "drop-shadow(0 40px 70px rgba(0,0,0,0.8))" }}
          />
        </motion.div>

        <motion.div
          style={{ opacity: textOpacity }}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center"
        >
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-[-0.03em] leading-[0.98] text-foreground">
            Nothing hidden.
            <br />
            <span className="text-[#D4A745]">Everything tested.</span>
          </h2>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <PulseButton to="/shop" primary>
              Shop the Catalog
            </PulseButton>
            <PulseButton to="/coa-library">View COA Library</PulseButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PulseButton({
  to,
  children,
  primary,
}: {
  to: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`relative inline-flex items-center justify-center h-12 px-8 rounded-full text-sm tracking-wide transition-all duration-300 ${
        primary
          ? "bg-[#D4A745] text-[#0a0a0a] hover:bg-[#e8bb5b]"
          : "border border-[#D4A745]/40 text-foreground hover:bg-[#D4A745]/10 hover:border-[#D4A745]/70"
      }`}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: primary
            ? "0 0 0 0 rgba(212,167,69,0.6)"
            : "0 0 0 0 rgba(212,167,69,0.3)",
          animation: "clarum-pulse 2.4s ease-out infinite",
        }}
      />
      <span className="relative">{children}</span>
    </Link>
  );
}
