import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, FlaskConical, Atom, Shield, Bug, Syringe } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import CoaCard from "@/components/CoaCard";
import island from "@/assets/island.jpg";
import lifestylePour from "@/assets/lifestyle-pour.jpg";
import { peptides } from "@/data/peptides";

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
      {
        property: "og:title",
        content: "CLARUM — Nothing Hidden. Everything Tested.",
      },
      {
        property: "og:description",
        content:
          "Full-panel tested research peptides. Every batch ships with a public Certificate of Analysis.",
      },
    ],
  }),
});

const heroStats = [
  "8 Compounds",
  "5 Tests Per Batch",
  "100% COA Documented",
  "≥99% HPLC Purity",
];

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
    desc: "LC-MS confirms molecular identity down to the atomic level. No substitutions.",
  },
  {
    icon: Shield,
    num: "03",
    title: "Heavy Metals",
    desc: "ICP-MS screens arsenic, lead, mercury, and cadmium. Reported ND or flagged.",
  },
  {
    icon: Bug,
    num: "04",
    title: "Microbial & Yeast",
    desc: "Total aerobic count, yeast, and mold screened to lab-cleanliness standards.",
  },
  {
    icon: Syringe,
    num: "05",
    title: "Endotoxin (LAL)",
    desc: "The test most peptide vendors skip entirely. We run it on every batch.",
  },
];

function Hero() {
  const featured = peptides[0];
  return (
    <section className="relative bg-background overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 gold-line-texture pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-brand-gold/[0.04] blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-brand-gold/[0.05] blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 mb-7">
            <span className="h-px w-8 bg-brand-gold/60" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
              Batch-Tested Research Peptides
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-foreground">
            Nothing Hidden.
            <br />
            <span className="italic text-gold-gradient">Everything Tested.</span>
          </h1>
          <p className="mt-7 text-base lg:text-lg text-foreground/55 leading-relaxed max-w-xl">
            Full-panel tested peptides — HPLC purity, mass spec identity, heavy metals, microbial,
            and endotoxin. The only research peptide brand that shows you the data.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center rounded-full bg-brand-gold text-brand-forest px-7 py-3.5 text-sm font-medium hover:bg-brand-gold-light transition-colors shadow-[0_0_30px_-5px_oklch(0.82_0.14_85_/_0.4)]"
            >
              Shop the Catalog
            </Link>
            <Link
              to="/coa-library"
              className="inline-flex items-center gap-1 rounded-full border border-brand-gold/40 text-brand-gold px-7 py-3.5 text-sm font-medium hover:bg-brand-gold/10 transition-colors"
            >
              View COA Library <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-2.5">
            {heroStats.map((s) => (
              <span
                key={s}
                className="text-[11px] font-medium text-foreground/50 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm bg-white/[0.02]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="order-1 lg:order-2 flex justify-center">
          <CoaCard peptide={featured} />
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const featured = peptides.slice(0, 3);
  return (
    <section className="bg-card border-b border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-brand-gold/40" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
              Catalog
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-foreground">
            Featured Compounds
          </h2>
          <p className="mt-4 text-foreground/55 max-w-md">
            High-purity research peptides, analytically tested. Every product ships with a
            batch-specific COA.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p) => (
            <Link
              key={p.slug}
              to="/shop"
              className="group bg-background rounded-3xl p-6 flex flex-col border border-white/5 hover:border-brand-gold/30 hover:-translate-y-1 transition-all duration-300"
            >
              {p.tag && (
                <span className="text-[10px] uppercase tracking-wider font-bold text-brand-gold/80">
                  {p.tag}
                </span>
              )}
              <div className="my-6">
                <CoaCard peptide={p} variant="mini" />
              </div>
              <div className="font-display text-2xl text-foreground">
                {p.name} <span className="text-foreground/50 text-base">({p.size})</span>
              </div>
              <div className="text-sm text-foreground/55 mt-1">{p.category}</div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-foreground/70">${p.price.toFixed(2)}</span>
                <span className="rounded-full border border-brand-gold/30 text-brand-gold px-3 py-1 group-hover:bg-brand-gold group-hover:text-brand-forest transition-colors">
                  View COA
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1 rounded-full border border-brand-gold/40 text-brand-gold px-7 py-3.5 text-sm font-medium hover:bg-brand-gold/10 transition-colors"
          >
            View Full Catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Testing() {
  return (
    <section className="relative bg-background gold-grid-texture overflow-hidden border-b border-white/5">
      <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] rounded-full bg-brand-gold/[0.03] blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-brand-gold/40" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
              Quality & Transparency
            </span>
            <span className="h-px w-8 bg-brand-gold/40" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-foreground">
            We Test What Others <span className="italic text-brand-gold">Skip</span>
          </h2>
          <p className="mt-4 text-foreground/55">
            Every batch undergoes 5 independent lab tests. Full COAs published publicly — no login
            required.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
          {testingPanels.map((card) => (
            <div key={card.title} className="group relative">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-brand-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="relative bg-card border border-white/5 rounded-2xl p-6 text-center h-full transition-all duration-300 group-hover:border-brand-gold/30 group-hover:-translate-y-1">
                <span className="text-[10px] font-bold text-brand-gold/40 tracking-widest">
                  {card.num}
                </span>
                <div className="w-14 h-14 mx-auto my-4 rounded-full border border-brand-gold/30 flex items-center justify-center group-hover:border-brand-gold transition-colors">
                  <card.icon className="h-6 w-6 text-brand-gold/80 group-hover:text-brand-gold transition-colors" />
                </div>
                <h3 className="font-display text-lg text-foreground mb-2">{card.title}</h3>
                <p className="text-[11px] text-foreground/50 leading-relaxed">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoaBand() {
  const samplePeptide = peptides.find((p) => p.slug === "ghk-cu-50mg") ?? peptides[0];
  const checks = [
    "Batch-specific COA, not generic certificates",
    "Independent third-party laboratory",
    "Full 5-panel results, published publicly",
    "Heavy metals and endotoxin — tests most vendors skip",
    "QR code on every order links to your batch's COA",
  ];
  return (
    <section className="relative bg-card overflow-hidden border-b border-white/5">
      <img
        src={lifestylePour}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.07] mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/60" />
      <div className="relative mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="h-px w-8 bg-brand-gold/60" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
              The COA Library
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
            Every Batch Has a COA.
            <br />
            <span className="italic text-brand-gold">No Exceptions.</span>
          </h2>
          <p className="mt-6 text-foreground/55 max-w-lg">
            We don't just claim "third-party tested." We publish the actual data — batch-specific
            Certificates of Analysis with full 5-panel results — publicly available, no login
            required.
          </p>
          <ul className="mt-8 space-y-3.5">
            {checks.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-emerald-400" />
                </span>
                <span className="text-sm text-foreground/75 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/coa-library"
            className="inline-flex items-center mt-10 rounded-full bg-brand-gold text-brand-forest px-7 py-3.5 text-sm font-medium hover:bg-brand-gold-light transition-colors"
          >
            View the COA Library
          </Link>
        </div>
        <div className="flex justify-center">
          <CoaCard peptide={samplePeptide} showLink={false} />
        </div>
      </div>
    </section>
  );
}

function LabStandards() {
  return (
    <section className="relative bg-brand-forest-deep overflow-hidden border-b border-white/5">
      <img
        src={island}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-forest-deep via-brand-forest-deep/85 to-brand-forest-deep/70" />
      <div className="relative mx-auto max-w-7xl px-6 py-28 text-center">
        <div className="inline-flex items-center gap-2 mb-5 justify-center">
          <span className="h-px w-8 bg-brand-gold/60" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
            Lab Standards
          </span>
          <span className="h-px w-8 bg-brand-gold/60" />
        </div>
        <h2 className="font-display text-5xl md:text-6xl text-foreground mb-5">
          ISO/IEC 17025 Tested
        </h2>
        <p className="max-w-xl mx-auto text-foreground/65 leading-relaxed">
          Every Clarum batch is sent to an accredited, independent laboratory. Identity, purity,
          contaminants, and endotoxin — the full picture, not just a number.
        </p>
        <Link
          to="/about"
          className="inline-flex items-center gap-1 mt-9 rounded-full bg-brand-gold text-brand-forest px-7 py-3.5 text-sm font-medium hover:bg-brand-gold-light transition-colors"
        >
          Read our story <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-5xl px-6 py-28 text-center">
        <h2 className="font-display text-5xl md:text-6xl text-foreground leading-[1.05]">
          Research deserves <span className="italic text-brand-gold">real data.</span>
        </h2>
        <p className="mt-6 text-foreground/60 max-w-xl mx-auto">
          Verify every batch before you order. Browse the catalog or open the COA Library.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/shop"
            className="inline-flex items-center rounded-full bg-brand-gold text-brand-forest px-8 py-4 text-base font-medium hover:bg-brand-gold-light transition-colors"
          >
            Shop the Catalog
          </Link>
          <Link
            to="/coa-library"
            className="inline-flex items-center rounded-full border border-brand-gold/40 text-brand-gold px-8 py-4 text-base font-medium hover:bg-brand-gold/10 transition-colors"
          >
            Open the COA Library
          </Link>
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
        <FeaturedProducts />
        <Testing />
        <CoaBand />
        <LabStandards />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
