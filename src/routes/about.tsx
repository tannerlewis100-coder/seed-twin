import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FlaskConical, Atom, Shield, Bug, Beaker } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Clarum — Built on Transparency | CLARUM" },
      {
        name: "description",
        content:
          "Why we built Clarum. The vague COAs, the skipped tests, and the full batch reports we publish in response.",
      },
      { property: "og:title", content: "About Clarum — Built on Transparency" },
      {
        property: "og:description",
        content: "Our story, our values, and the analytical testing standard behind every batch.",
      },
    ],
  }),
});

const panels = [
  { icon: Beaker, title: "Qualitative ID", desc: "UV/Vis λmax match" },
  { icon: FlaskConical, title: "Percent Purity", desc: "NLT 98%" },
  { icon: Atom, title: "Quantitative Assay", desc: "NLT 95% of label claim" },
  { icon: Shield, title: "Heavy Metals", desc: "NMT 150 ppb total" },
  { icon: Bug, title: "Microbial & Mold", desc: "TAMC + TYMC" },
];

const stats = [
  { k: "5", v: "Panels per batch" },
  { k: "100%", v: "Batches tested" },
  { k: "0", v: "Paywalls on COAs" },
  { k: "QR", v: "On every vial" },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        {/* Asymmetric hero */}
        <section className="relative bg-background border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 gold-line-texture pointer-events-none" />
          <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-brand-gold/[0.04] blur-[120px]" />
          <div className="relative mx-auto max-w-7xl px-5 sm:px-6 pt-20 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
              <div className="lg:col-span-8">
                <div className="inline-flex items-center gap-2 mb-5">
                  <span className="h-px w-8 bg-brand-gold/60" />
                  <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                    Our Story
                  </span>
                </div>
                <h1 className="font-display text-[44px] sm:text-5xl lg:text-7xl text-foreground leading-[1.02] tracking-tight">
                  <RevealText text="We saw an industry built on shortcuts." />
                </h1>
                <RevealOnScroll
                  as="p"
                  delay={300}
                  className="mt-6 text-foreground/55 text-lg max-w-xl"
                >
                  So we started Clarum.
                </RevealOnScroll>
              </div>
              <div className="lg:col-span-4 lg:border-l lg:border-brand-gold/15 lg:pl-10">
                <RevealOnScroll as="div" delay={400} className="grid grid-cols-2 gap-y-6 gap-x-4">
                  {stats.map((s) => (
                    <div key={s.v}>
                      <div className="font-display text-3xl text-brand-gold leading-none mb-2">
                        {s.k}
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.2em] text-foreground/50">
                        {s.v}
                      </div>
                    </div>
                  ))}
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Problem / Solution diptych */}
        <section className="bg-card border-b border-white/5 gold-grid-texture">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0">
              <div className="lg:pr-12">
                <div className="inline-flex items-center gap-2 mb-5">
                  <span className="h-px w-8 bg-brand-gold/60" />
                  <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                    The Problem
                  </span>
                </div>
                <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-7 leading-tight">
                  <RevealText text="An industry that stopped caring about the people it served." />
                </h2>
                <RevealOnScroll as="div" delay={200} className="space-y-5 text-foreground/60 leading-[1.8]">
                  <p>
                    We spent years on the other side of the counter, ordering peptides and hoping
                    the label matched what was actually in the vial. For a while, a handful of
                    vendors made that easy. Reliable. Consistent.
                  </p>
                  <p>
                    Then the cracks showed. Vendor after vendor cut the same corners: skip the
                    harder panels, run one quick test, call it "third-party tested." Enough to
                    look legitimate. Not enough to actually protect the research.
                  </p>
                  <p>
                    It was cheaper. It was faster. Most customers couldn't tell the difference, so
                    the market raced to the bottom, competing on Instagram ads and influencer codes
                    instead of purity. The COAs that did exist were vague, generic, or recycled
                    across batches. We saw one COA used for three different lots.
                  </p>
                </RevealOnScroll>
              </div>

              <div className="lg:pl-12 lg:border-l lg:border-brand-gold/20 relative">
                <div className="inline-flex items-center gap-2 mb-5">
                  <span className="h-px w-8 bg-brand-gold/60" />
                  <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                    The Solution
                  </span>
                </div>
                <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-7 leading-tight">
                  <RevealText text="So we sent every batch out for the full panel." />
                </h2>
                <RevealOnScroll as="div" delay={300} className="space-y-5 text-foreground/60 leading-[1.8]">
                  <p>
                    "Good enough" wasn't going to cut it, and a single HPLC number with a trust-me
                    attitude felt insulting to anyone reading the report.
                  </p>
                  <p>
                    Five independent panels per batch: HPLC purity, mass spec identity, heavy
                    metals (ICP-MS), microbial, endotoxin (LAL). Same panel, every time. We do it
                    on every run.
                  </p>
                  <p>
                    Then we publish the full results. No login. No paywall. Every Certificate of
                    Analysis is public, batch-specific, and linked via a QR code on the vial. If
                    you want to verify what you're buying before you buy it, you can.
                  </p>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* 5-Panel standard as a numbered methodology table */}
        <section className="bg-background border-b border-white/5">
          <div className="mx-auto max-w-5xl px-5 sm:px-6 py-16 md:py-24">
            <div className="mb-10">
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                Methodology
              </span>
              <h2 className="font-display text-3xl lg:text-5xl text-foreground mt-2">
                <RevealText text="The 5-Panel Standard" />
              </h2>
            </div>
            <div className="border-t border-white/10">
              {panels.map((c, i) => (
                <RevealOnScroll
                  key={c.title}
                  delay={i * 70}
                  className="group grid grid-cols-12 items-center gap-4 sm:gap-6 py-6 border-b border-white/10 hover:bg-white/[0.015] transition-colors"
                >
                  <div className="col-span-2 sm:col-span-1 font-display text-2xl sm:text-3xl text-brand-gold/70 group-hover:text-brand-gold transition-colors">
                    0{i + 1}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="w-10 h-10 rounded-full border border-brand-gold/40 flex items-center justify-center group-hover:border-brand-gold transition-colors">
                      <c.icon className="h-4 w-4 text-brand-gold" />
                    </div>
                  </div>
                  <div className="col-span-8 sm:col-span-6 font-display text-lg sm:text-xl text-foreground">
                    {c.title}
                  </div>
                  <div className="col-span-12 sm:col-span-4 text-sm text-foreground/55 sm:text-right pl-14 sm:pl-0">
                    {c.desc}
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Pull-quote values band */}
        <section className="bg-card relative overflow-hidden">
          <div className="absolute inset-0 gold-line-texture pointer-events-none opacity-60" />
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-brand-gold/[0.04] blur-[140px]" />
          <div className="relative mx-auto max-w-4xl px-5 sm:px-6 py-20 md:py-28 text-center">
            <div className="font-display text-brand-gold/40 text-7xl leading-none mb-2 select-none">
              &ldquo;
            </div>
            <RevealOnScroll
              as="p"
              className="font-display italic text-3xl md:text-5xl text-foreground leading-[1.2]"
            >
              We test every batch and publish every COA.
            </RevealOnScroll>
            <div className="mt-6 text-[11px] uppercase tracking-[0.3em] text-brand-gold/70">
              — Clarum
            </div>
            <div className="mt-12">
              <Link
                to="/coa-library"
                className="inline-flex items-center gap-2 rounded-full border border-brand-gold/50 text-brand-gold px-8 py-4 text-sm font-medium hover:bg-brand-gold/10 transition-colors"
              >
                View the COA Library <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
