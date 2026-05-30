import type React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import heroVials from "@/assets/hero-vials.png";
import {
  ArrowRight,
  Check,
  FlaskConical,
  Atom,
  Shield,
  Bug,
  Beaker,
  FileText,
  QrCode,
  Smartphone,
  Clock,
} from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import CoaCard from "@/components/CoaCard";
import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials";
const qualitySemax = "/quality-semax-v2.png";
const qualitySs37 = "/quality-ss37-v2.png";
const qualityTb500 = "/quality-glp1s-v2.png";
const qualityTrio = "/quality-trio-v2.png";
import { peptides, featuredPeptides } from "@/data/peptides";
import { vialImageFor } from "@/lib/vialImages";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      {
        title: "CLARUM — Batch-Tested Research Peptides | Nothing Hidden. Everything Tested.",
      },
      {
        name: "description",
        content:
          "Research peptides with a Certificate of Analysis on every batch: identity, percent purity, label-claim assay, heavy metals, and microbial/mold. For in vitro laboratory research use only.",
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

/* ---------------- Hero ---------------- */

function Hero() {
  const headlineWhite = "Research peptides,".split(" ");
  const headlineGold = "without the guesswork.".split(" ");
  const allWords = [
    ...headlineWhite.map((w) => ({ word: w, gold: false })),
    ...headlineGold.map((w) => ({ word: w, gold: true })),
  ];

  return (
    <section className="relative bg-black border-b border-white/[0.08]">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 pt-10 sm:pt-20 pb-[60px] min-h-[70vh] sm:min-h-[90vh] flex items-center">
        <div className="w-full grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left column 60% */}
          <div className="order-2 lg:order-1 lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[11px] tracking-[0.22em] uppercase font-medium text-[#D4A93E] mb-6"
            >
              Independently Lab-Tested
            </motion.div>

            <h1 className="font-display text-[40px] sm:text-[52px] lg:text-[64px] leading-[1.05] tracking-[-0.02em] text-white">
              {allWords.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                  className={
                    w.gold
                      ? "inline-block italic text-[#D4A93E] mr-[0.25em]"
                      : "inline-block mr-[0.25em]"
                  }
                >
                  {w.word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: allWords.length * 0.05 + 0.1, duration: 0.5 }}
              className="mt-6 text-[18px] leading-[1.6] text-[#A0A0A0] max-w-[480px]"
            >
              Every batch tested across 5 assays. Every COA published the week it ships.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: allWords.length * 0.05 + 0.2, duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-full bg-[#D4A93E] text-black h-12 px-7 text-[14px] font-medium transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#e0b955]"
              >
                Shop the Catalog
              </Link>
              <Link
                to="/coa-library"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D4A93E] text-[#D4A93E] bg-transparent h-12 px-7 text-[14px] font-medium transition-colors hover:bg-[#D4A93E]/10"
              >
                View COA Library <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: allWords.length * 0.05 + 0.35, duration: 0.6 }}
              className="mt-8 text-[14px] text-[#777]"
            >
              Identity · Purity · Label-Claim Assay · Heavy Metals · Microbial & Yeast/Mold
            </motion.div>
          </div>

          {/* Right column 40% */}
          <div className="order-1 lg:order-2 lg:col-span-2 relative hidden lg:flex justify-center items-center">
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div
                className="w-[420px] h-[420px] rounded-full"
                style={{
                  background: "#D4A93E",
                  opacity: 0.08,
                  filter: "blur(80px)",
                }}
              />
            </div>
            <motion.img
              src={heroVials}
              alt="Clarum research peptide vials"
              className="relative w-full h-auto object-contain"
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Mobile image */}
          <div className="order-1 lg:hidden relative w-full flex justify-center items-center" style={{ height: 260 }}>
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div
                className="w-[240px] h-[240px] rounded-full"
                style={{ background: "#D4A93E", opacity: 0.08, filter: "blur(80px)" }}
              />
            </div>
            <motion.img
              src={heroVials}
              alt="Clarum research peptide vials"
              className="relative max-h-[260px] w-auto object-contain"
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}


/* ---------------- Stats band ---------------- */

const heroStats = [
  ["70+", "Compounds"],
  ["5", "Tests Per Batch"],
  ["100%", "COA Documented"],
  ["≥98%", "Percent Purity"],
];

function StatsBand() {
  return (
    <section className="bg-brand-forest-deep border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {heroStats.map(([num, label], i) => (
          <RevealOnScroll key={label} delay={i * 80} className="text-center md:text-left">
            <div className="font-display text-3xl md:text-4xl text-brand-gold tracking-[-0.02em]">
              {num}
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-foreground/55 mt-1.5">
              {label}
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Featured products (4-up shadcn Card grid) ---------------- */

function FeaturedProducts() {
  const featured = featuredPeptides.slice(0, 4);

  return (
    <section className="bg-background border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-10 mb-16 items-end">
          <div className="lg:col-span-7">
            <Badge
              variant="outline"
              className="border-brand-gold/30 text-brand-gold bg-transparent rounded-full px-3 py-1 mb-5 text-[11px] tracking-[0.18em] uppercase font-medium"
            >
              The Catalog
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] leading-[1.05] text-foreground tracking-[-0.02em]">
              <RevealText text={"Verified purity\nstarts in the vial."} />
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-3">
            <RevealOnScroll
              as="p"
              delay={120}
              className="text-foreground/60 leading-[1.6] max-w-md"
            >
              Every batch runs the full panel: identity, percent purity,
              quantitative label-claim assay, heavy metals, and microbial &
              yeast/mold. Pull the batch report before checkout — or
              after. We don't mind.
            </RevealOnScroll>
            <Button
              asChild
              variant="link"
              className="mt-3 px-0 text-brand-gold hover:text-brand-gold-light"
            >
              <Link to="/shop">
                Shop all compounds <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p, i) => {
            const vial = vialImageFor(p.name, p.slug);
            return (
              <RevealOnScroll key={p.slug} delay={i * 80}>
                <Link
                  to="/shop"
                  className="group/card relative flex flex-col items-center text-center overflow-hidden rounded-3xl h-[520px] w-full p-6 bg-brand-forest-deep border border-white/5 hover:border-brand-gold/40 transition-all duration-500 hover:-translate-y-1 shadow-xl"
                >
                  {/* Top-left badge */}
                  <div className="absolute top-5 left-5 z-10">
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-brand-gold/90 text-brand-forest px-3 py-1.5 rounded-full">
                      {p.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="relative z-10 mt-16 font-display text-2xl md:text-3xl text-foreground leading-tight max-w-[85%] min-h-[4rem] flex items-center justify-center">
                    {p.name}
                  </h3>

                  {/* Vial visual */}
                  <div className="relative z-10 flex-1 flex items-center justify-center w-full my-4">
                    <img
                      src={vial}
                      alt={`${p.name} vial`}
                      loading="lazy"
                      draggable={false}
                      className="h-56 w-auto max-w-full object-contain select-none transition-transform duration-700 group-hover/card:scale-105 drop-shadow-2xl"
                    />
                  </div>

                  {/* Shop Now button */}
                  <div className="relative z-10 w-full">
                    <div className="mx-auto w-fit rounded-full bg-brand-forest border border-white/10 px-10 py-3 text-foreground text-sm font-medium group-hover/card:bg-brand-gold group-hover/card:text-brand-forest group-hover/card:border-brand-gold transition-colors">
                      Shop Now
                    </div>
                    <p className="mt-4 text-xs text-foreground/60">
                      Starting at{" "}
                      <span className="text-foreground/90 font-semibold">
                        ${p.price.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Quality & Transparency (image collage + checkmarks) ---------------- */

function QualityCollage() {
  const checks = [
    "Batch-specific COA, not a generic certificate recycled across runs",
    "Full analytical panel on every single batch we ship",
    "Independent third-party lab. Same panel on every run.",
    "Public COA library. No login. No email gate.",
  ];
  return (
    <section className="bg-background border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-16 md:py-24 lg:py-32 grid lg:grid-cols-12 gap-10 lg:gap-20 items-center">
        {/* Image collage */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.08]">
            <img
              src={qualitySs37}
              alt="SS-31 vial"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.08]">
            <img
              src={qualitySemax}
              width={1440}
              height={1920}
              alt="SEMAX vial"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.08]">
            <img
              src={qualityTb500}
              width={1536}
              height={1920}
              alt="GLP1-S vial"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.08]">
            <img
              src={qualityTrio}
              width={1920}
              height={1280}
              alt="BPC-157, SELANK, and GHK-CU vials"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Copy + checkmarks */}
        <div className="lg:col-span-6">
          <Badge
            variant="outline"
            className="border-brand-gold/30 text-brand-gold bg-transparent rounded-full px-3 py-1 mb-5 text-[11px] tracking-[0.18em] uppercase font-medium"
          >
            Quality &amp; Transparency
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[52px] leading-[1.05] text-foreground tracking-[-0.02em]">
            <RevealText text={"Receipts,\nnot claims."} />
          </h2>
          <RevealOnScroll
            as="p"
            delay={250}
            className="mt-6 text-foreground/60 leading-[1.6] max-w-lg"
          >
            "Third-party tested" is the phrase every vendor uses. Almost none of
            them publish the actual numbers. We do. Every batch ships with a
            Certificate of Analysis you can pull up before you break the seal.
          </RevealOnScroll>
          <ul className="mt-8 space-y-4">
            {checks.map((item, i) => (
              <RevealOnScroll
                as="li"
                key={item}
                delay={i * 60}
                className="flex items-start gap-3"
              >
                <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-brand-gold" />
                </span>
                <span className="text-[15px] text-foreground/80 leading-[1.55]">
                  {item}
                </span>
              </RevealOnScroll>
            ))}
          </ul>
          <Button
            asChild
            size="lg"
            className="mt-10 rounded-full bg-brand-gold text-brand-forest hover:bg-brand-gold-light h-12 px-7 text-[14px]"
          >
            <Link to="/coa-library">View the COA Library</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- How it's tested (full-bleed grid background) ---------------- */

const testingPanels = [
  {
    icon: Beaker,
    num: "01",
    title: "Qualitative ID",
    desc: "Confirms molecular identity by UV/Vis λmax match against a characteristic reference standard.",
  },
  {
    icon: FlaskConical,
    num: "02",
    title: "Percent Purity",
    desc: "Correlation-coefficient purity, spec NLT 98%. You see the exact percentage, not a range.",
  },
  {
    icon: Atom,
    num: "03",
    title: "Quantitative Assay",
    desc: "Beer-Lambert assay confirms the vial actually contains the labeled amount — NLT 95% of label claim.",
  },
  {
    icon: Shield,
    num: "04",
    title: "Heavy Metals",
    desc: "Total heavy metals, spec NMT 150 ppb/vial: Pb, Cd, Hg, Ni, Fe, Co.",
  },
  {
    icon: Bug,
    num: "05",
    title: "Microbial & Mold",
    desc: "TAMC (aerobic, NMT 1,000 CFU) and TYMC (yeast & mold, NMT 100 CFU).",
  },
];

function HowTested() {
  return (
    <section className="relative bg-background gold-grid-texture border-b border-white/[0.08]">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl mb-16">
          <Badge
            variant="outline"
            className="border-brand-gold/30 text-brand-gold bg-transparent rounded-full px-3 py-1 mb-5 text-[11px] tracking-[0.18em] uppercase font-medium"
          >
            How it's tested
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] leading-[1.05] text-foreground tracking-[-0.02em]">
            <RevealText text={"Five tests on every\nsingle batch."} />
          </h2>
          <RevealOnScroll
            as="p"
            delay={250}
            className="mt-6 text-foreground/60 leading-[1.6] max-w-xl"
          >
            Every batch runs the full analytical panel before it ships. Below
            is the full panel. Same five, every time.
          </RevealOnScroll>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {testingPanels.map((card, i) => (
            <RevealOnScroll key={card.title} delay={i * 70}>
              <Card className="h-full bg-zinc-950 border-white/10 rounded-2xl shadow-none hover:border-brand-gold/30 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="text-[10px] font-semibold text-brand-gold/60 tracking-[0.2em]">
                    {card.num}
                  </div>
                  <div className="mt-5 mb-5 w-11 h-11 rounded-full border border-brand-gold/30 flex items-center justify-center">
                    <card.icon className="h-5 w-5 text-brand-gold" />
                  </div>
                  <h3 className="font-display text-[19px] text-foreground leading-tight tracking-[-0.01em]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-foreground/55 leading-[1.55]">
                    {card.desc}
                  </p>
                </CardContent>
              </Card>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Scan the Vial (QR → batch COA) ---------------- */

function ScanTheVial() {
  const points = [
    {
      icon: QrCode,
      text: "Batch-specific. Tied to the lot in your hand, not the product line.",
    },
    {
      icon: Smartphone,
      text: "No login, no email gate. The link is public the second you scan.",
    },
    {
      icon: Clock,
      text: "Four seconds from cap to COA.",
    },
  ];
  return (
    <section className="relative bg-background border-b border-white/[0.08] overflow-hidden">
      <div className="absolute inset-0 gold-line-texture pointer-events-none opacity-60" />
      <div className="absolute -top-32 right-1/4 w-[520px] h-[420px] rounded-full bg-brand-gold/[0.05] blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-16 md:py-24 lg:py-32 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-7">
          <Badge
            variant="outline"
            className="border-brand-gold/30 text-brand-gold bg-transparent rounded-full px-3 py-1 mb-5 text-[11px] tracking-[0.22em] uppercase font-medium"
          >
            Scan the Vial
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] leading-[1.05] text-foreground tracking-[-0.02em]">
            <RevealText
              text={"Your batch. On your phone.\nBefore you break the seal."}
            />
          </h2>
          <RevealOnScroll
            as="p"
            delay={200}
            className="mt-6 text-foreground/60 leading-[1.7] max-w-2xl"
          >
            Every vial ships with a QR code. Scan it and you're looking at
            the exact certificate of analysis for the batch your peptide came
            from — not a generic doc, not a recycled report, the actual
            numbers for your actual vial.
          </RevealOnScroll>
          <ul className="mt-10 grid sm:grid-cols-3 gap-6 max-w-3xl">
            {points.map((p, i) => (
              <RevealOnScroll
                as="li"
                key={p.text}
                delay={i * 80}
                className="flex flex-col gap-3"
              >
                <span className="w-10 h-10 rounded-full border border-brand-gold/30 bg-brand-gold/[0.06] flex items-center justify-center">
                  <p.icon className="h-4 w-4 text-brand-gold" />
                </span>
                <span className="text-[14px] text-foreground/75 leading-[1.55]">
                  {p.text}
                </span>
              </RevealOnScroll>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <RevealOnScroll delay={120}>
            {(() => {
              const bpc = peptides.find((p) => p.slug === "bpc-157-10mg");
              return bpc ? <CoaCard peptide={bpc} /> : null;
            })()}
          </RevealOnScroll>
        </div>

      </div>
    </section>
  );
}

/* ---------------- COA Library teaser (4 floating preview cards) ---------------- */

function CoaTeaser() {
  const previewSlugs = ["bpc-157-10mg", "tb-500-10mg", "ghk-cu-50mg", "epitalon-10mg"];
  const previews = previewSlugs
    .map((s) => peptides.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="bg-background border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-16 md:py-24 lg:py-32 grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <Badge
            variant="outline"
            className="border-brand-gold/30 text-brand-gold bg-transparent rounded-full px-3 py-1 mb-5 text-[11px] tracking-[0.18em] uppercase font-medium"
          >
            COA Library
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] leading-[1.05] text-foreground tracking-[-0.02em]">
            <RevealText text={"Every batch.\nPublic record."} />
          </h2>
          <RevealOnScroll
            as="p"
            delay={250}
            className="mt-6 text-foreground/60 leading-[1.6] max-w-md"
          >
            Browse the certificate of analysis for every batch we've ever
            shipped. No login. No email gate. Just data.
          </RevealOnScroll>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="mt-8 rounded-full border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold-light bg-transparent h-12 px-7 text-[14px]"
          >
            <Link to="/coa-library">
              Open COA Library <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {previews.map((p, i) => (
            <RevealOnScroll
              key={p.slug}
              delay={i * 100}
              className={i % 2 === 1 ? "sm:translate-y-10" : ""}
            >
              <Card className="bg-zinc-950 border-white/10 rounded-2xl shadow-none hover:border-brand-gold/30 transition-colors duration-300">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[11px] text-foreground/50 uppercase tracking-[0.18em]">
                      <FileText className="h-3.5 w-3.5" /> COA · {p.batch}
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] uppercase tracking-wider font-semibold">
                      Pass
                    </Badge>
                  </div>
                  <div className="font-display text-[20px] text-foreground tracking-[-0.01em]">
                    {p.name}
                  </div>
                  <div className="text-[13px] text-foreground/50 mb-4">{p.size}</div>
                  <Separator className="bg-white/[0.08] mb-4" />
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[12px]">
                    <dt className="text-foreground/45">Percent Purity</dt>
                    <dd className="text-foreground/90 text-right tabular-nums font-medium">
                      {p.purity}
                    </dd>
                    <dt className="text-foreground/45">Identity (λmax)</dt>
                    <dd className="text-foreground/90 text-right">Match</dd>
                    <dt className="text-foreground/45">Heavy Metals</dt>
                    <dd className="text-foreground/90 text-right">{p.coa.heavyMetals}</dd>
                    <dt className="text-foreground/45">Microbial</dt>
                    <dd className="text-foreground/90 text-right">Pass</dd>
                  </dl>
                </CardContent>
              </Card>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials (Stagger) ---------------- */

function Testimonials() {
  return (
    <section className="bg-background border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-12 md:py-16 lg:py-20">
        <div className="max-w-2xl mb-10">
          <Badge
            variant="outline"
            className="border-brand-gold/30 text-brand-gold bg-transparent rounded-full px-3 py-1 mb-5 text-[11px] tracking-[0.18em] uppercase font-medium"
          >
            Researcher voices
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl text-foreground leading-[1.05] tracking-[-0.02em]">
            <RevealText text={"Trusted by people\nwho read the data."} />
          </h2>
        </div>
        <RevealOnScroll>
          <StaggerTestimonials />
        </RevealOnScroll>
      </div>
    </section>
  );
}

/* ---------------- CTA banner ---------------- */

function FinalCta() {
  return (
    <section className="bg-brand-forest-deep">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 py-20 md:py-24 lg:py-32 text-center">
        <h2 className="font-display text-[40px] sm:text-5xl md:text-6xl lg:text-[72px] text-foreground leading-[1.05] lg:leading-[1.02] tracking-[-0.02em]">
          <RevealText text={"Read the COA\nbefore you buy."} />
        </h2>
        <RevealOnScroll
          as="p"
          delay={250}
          className="mt-6 sm:mt-7 text-foreground/60 leading-[1.6] max-w-xl mx-auto"
        >
          Every batch we've shipped since launch is up in the library. Open it,
          search a batch number, and check the numbers yourself.
        </RevealOnScroll>
        <div className="mt-9 sm:mt-11 flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-brand-gold text-brand-forest hover:bg-brand-gold-light h-12 px-8 text-[14px] w-full sm:w-auto"
          >
            <Link to="/shop">Shop Catalog</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/20 text-foreground hover:bg-white/5 hover:text-brand-gold bg-transparent h-12 px-8 text-[14px] w-full sm:w-auto"
          >
            <Link to="/coa-library">Open COA Library</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <Hero />
        <StatsBand />
        <FeaturedProducts />
        <HowTested />
        <ScanTheVial />
        <QualityCollage />
        <CoaTeaser />
        <Testimonials />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
