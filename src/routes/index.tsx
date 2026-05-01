import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  FlaskConical,
  Atom,
  Shield,
  Bug,
  Syringe,
  FileText,
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
import capsuleMacro from "@/assets/capsule-macro.jpg";
import duoJars from "@/assets/duo-jars.jpg";
import heroCapsule from "@/assets/hero-capsule.jpg";
import lifestylePour from "@/assets/lifestyle-pour.jpg";
import { peptides, featuredPeptides } from "@/data/peptides";

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
          "Analytically tested research peptides with full 5-panel independent lab testing — HPLC, mass spec, heavy metals, microbial, and endotoxin. Every batch documented. For in vitro laboratory research use only.",
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
  const featured = peptides[0];
  return (
    <section className="relative bg-background border-b border-white/[0.08]">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-20 lg:pt-28 pb-24 lg:pb-32 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[60vh]">
        <div className="order-2 lg:order-1 lg:col-span-7 max-w-2xl">
          <Badge
            variant="outline"
            className="border-brand-gold/40 text-brand-gold/90 bg-transparent rounded-full px-3 py-1 mb-8 text-[11px] tracking-[0.18em] uppercase font-medium"
          >
            Independently lab-tested
          </Badge>
          <h1 className="font-display text-[44px] md:text-6xl lg:text-[80px] leading-[1.02] text-foreground tracking-[-0.02em]">
            <RevealText text={"Nothing hidden.\nEverything tested."} stagger={55} />
          </h1>
          <RevealOnScroll
            as="p"
            delay={250}
            className="mt-8 text-[15px] lg:text-[17px] text-foreground/60 leading-[1.6] max-w-lg"
          >
            Every batch undergoes 5 independent lab tests — HPLC purity, mass
            spectrometry, heavy metals, microbial, and endotoxin. Full COAs
            published publicly in our library.
          </RevealOnScroll>
          <div className="mt-10 flex flex-wrap items-center gap-4">
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
        <div className="order-1 lg:order-2 lg:col-span-5 flex justify-center lg:justify-end">
          <CoaCard peptide={featured} />
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
  ["≥99%", "HPLC Purity"],
];

function StatsBand() {
  return (
    <section className="bg-brand-forest-deep border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
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
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
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
              Each compound is backed by independent 5-panel lab testing — HPLC,
              mass spec, heavy metals, microbial, and endotoxin. Verify the
              batch before you order.
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
            const code =
              p.batch?.split("-").slice(-1)[0]?.replace(/\d+$/, "") ||
              p.name.slice(0, 3).toUpperCase();
            const shortCode = `${code}-${String(i + 1).padStart(2, "0")}`;
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

                  {/* Code pill */}
                  <div className="relative z-10 mt-10 mb-4">
                    <span className="inline-block text-xs tracking-wider text-foreground/80 border border-white/20 rounded-full px-4 py-1.5">
                      {shortCode}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="relative z-10 font-display text-2xl md:text-3xl text-foreground leading-tight max-w-[80%]">
                    {p.name}
                  </h3>

                  {/* Vial visual */}
                  <div className="relative z-10 flex-1 flex items-center justify-center w-full my-4">
                    <div className="relative w-32 h-44 transition-transform duration-700 group-hover/card:scale-105">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 rounded-t-md bg-gradient-to-b from-neutral-700 to-neutral-900 border border-black/40" />
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[5.5rem] h-2 bg-black/60 rounded-sm" />
                      <div className="absolute top-7 left-1/2 -translate-x-1/2 w-28 h-36 rounded-b-xl rounded-t-sm bg-gradient-to-b from-neutral-900 via-black to-neutral-950 border border-white/10 shadow-2xl overflow-hidden">
                        <div className="absolute inset-x-3 top-10 h-px bg-brand-gold/30" />
                        <div className="absolute inset-x-0 top-12 text-center">
                          <span className="text-[8px] tracking-[0.2em] text-brand-gold/80 font-semibold">
                            CLARUM
                          </span>
                        </div>
                        <div className="absolute inset-x-4 bottom-6 text-center">
                          <span className="text-[7px] tracking-wider text-white/50 block">
                            {shortCode} · {p.size}
                          </span>
                          <span className="text-[6px] tracking-wider text-white/30 block mt-0.5">
                            RESEARCH USE ONLY
                          </span>
                        </div>
                        <div className="absolute inset-y-0 right-2 w-2 bg-gradient-to-r from-transparent to-white/10" />
                      </div>
                    </div>
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
    "Batch-specific COA, not generic certificates",
    "Independent third-party laboratory",
    "QR code on every order links to your batch",
    "Public COA library — verify before you order",
  ];
  return (
    <section className="bg-background border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        {/* Image collage */}
        <div className="lg:col-span-6 grid grid-cols-12 grid-rows-6 gap-4 h-[520px]">
          <RevealOnScroll className="col-span-7 row-span-4 overflow-hidden rounded-2xl border border-white/[0.08]">
            <img
              src={heroCapsule}
              alt="Sealed research vial"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </RevealOnScroll>
          <RevealOnScroll
            delay={120}
            className="col-span-5 row-span-3 overflow-hidden rounded-2xl border border-white/[0.08]"
          >
            <img
              src={capsuleMacro}
              alt="Macro capsule detail"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </RevealOnScroll>
          <RevealOnScroll
            delay={200}
            className="col-span-5 row-span-3 overflow-hidden rounded-2xl border border-white/[0.08]"
          >
            <img
              src={duoJars}
              alt="Vial pair"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </RevealOnScroll>
          <RevealOnScroll
            delay={280}
            className="col-span-7 row-span-2 overflow-hidden rounded-2xl border border-white/[0.08]"
          >
            <img
              src={lifestylePour}
              alt="Lab preparation"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </RevealOnScroll>
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
            We don't just say "third-party tested" — we publish the data. Every
            batch ships with a Certificate of Analysis you can pull up before
            you ever break the seal.
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
    icon: FlaskConical,
    num: "01",
    title: "HPLC Purity",
    desc: "Confirms ≥99% purity. You see the exact percentage, not a range.",
  },
  {
    icon: Atom,
    num: "02",
    title: "Mass Spectrometry",
    desc: "LC-MS confirms molecular identity at the atomic level. No substitutions.",
  },
  {
    icon: Shield,
    num: "03",
    title: "Heavy Metals",
    desc: "ICP-MS screens arsenic, lead, mercury, and cadmium.",
  },
  {
    icon: Bug,
    num: "04",
    title: "Microbial & Yeast",
    desc: "Total aerobic count, yeast, and mold to lab-cleanliness standards.",
  },
  {
    icon: Syringe,
    num: "05",
    title: "Endotoxin (LAL)",
    desc: "The test most peptide vendors skip. We run it on every batch.",
  },
];

function HowTested() {
  return (
    <section className="relative bg-background gold-grid-texture border-b border-white/[0.08]">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
        <div className="max-w-3xl mb-16">
          <Badge
            variant="outline"
            className="border-brand-gold/30 text-brand-gold bg-transparent rounded-full px-3 py-1 mb-5 text-[11px] tracking-[0.18em] uppercase font-medium"
          >
            How it's tested
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl lg:text-[56px] leading-[1.05] text-foreground tracking-[-0.02em]">
            <RevealText text={"Five tests. Every batch.\nNo exceptions."} />
          </h2>
          <RevealOnScroll
            as="p"
            delay={250}
            className="mt-6 text-foreground/60 leading-[1.6] max-w-xl"
          >
            Each batch is sent to an independent ISO/IEC 17025 accredited
            laboratory. Here's the full panel we run — every time.
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

/* ---------------- COA Library teaser (4 floating preview cards) ---------------- */

function CoaTeaser() {
  const previewSlugs = ["bpc-157-10mg", "tb-500-10mg", "ghk-cu-50mg", "epitalon-10mg"];
  const previews = previewSlugs
    .map((s) => peptides.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="bg-background border-b border-white/[0.08]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32 grid lg:grid-cols-12 gap-12 items-start">
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
            shipped. No login, no email gate — just data.
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
                    <dt className="text-foreground/45">HPLC Purity</dt>
                    <dd className="text-foreground/90 text-right tabular-nums font-medium">
                      {p.purity}
                    </dd>
                    <dt className="text-foreground/45">Mass Spec ID</dt>
                    <dd className="text-foreground/90 text-right">Confirmed</dd>
                    <dt className="text-foreground/45">Heavy Metals</dt>
                    <dd className="text-foreground/90 text-right">{p.coa.heavyMetals}</dd>
                    <dt className="text-foreground/45">Endotoxin</dt>
                    <dd className="text-foreground/90 text-right">&lt; 1 EU/mg</dd>
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
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-20">
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
      <div className="mx-auto max-w-5xl px-6 py-28 lg:py-32 text-center">
        <h2 className="font-display text-5xl md:text-6xl lg:text-[72px] text-foreground leading-[1.02] tracking-[-0.02em]">
          <RevealText text={"Research deserves\nreal data."} />
        </h2>
        <RevealOnScroll
          as="p"
          delay={250}
          className="mt-7 text-foreground/60 leading-[1.6] max-w-xl mx-auto"
        >
          Verify every batch before you order. Browse the catalog or open the
          COA Library — it's all public.
        </RevealOnScroll>
        <div className="mt-11 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-brand-gold text-brand-forest hover:bg-brand-gold-light h-12 px-8 text-[14px]"
          >
            <Link to="/shop">Shop Catalog</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/20 text-foreground hover:bg-white/5 hover:text-brand-gold bg-transparent h-12 px-8 text-[14px]"
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
        <QualityCollage />
        <HowTested />
        <CoaTeaser />
        <Testimonials />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
