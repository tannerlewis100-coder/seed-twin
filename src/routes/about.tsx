import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FlaskConical, Atom, Shield, Bug, Syringe } from "lucide-react";
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
          "Why we built Clarum. The vague COAs, the skipped endotoxin tests, and the 5-panel batch reports we publish in response.",
      },
      { property: "og:title", content: "About Clarum — Built on Transparency" },
      {
        property: "og:description",
        content: "Our story, our values, and the 5-panel testing standard behind every batch.",
      },
    ],
  }),
});

const panels = [
  { icon: FlaskConical, title: "HPLC Purity", desc: "≥99% specification" },
  { icon: Atom, title: "Mass Spec (LC-MS)", desc: "Molecular identity" },
  { icon: Shield, title: "Heavy Metals (ICP-MS)", desc: "As, Pb, Hg, Cd" },
  { icon: Bug, title: "Microbial & Yeast", desc: "Aerobic count, mold" },
  { icon: Syringe, title: "Endotoxin (LAL)", desc: "Bacterial endotoxin" },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <section className="relative bg-background border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 gold-line-texture pointer-events-none" />
          <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-brand-gold/[0.04] blur-[120px]" />
          <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-20 text-center">
            <div className="inline-flex items-center gap-2 mb-4 justify-center">
              <span className="h-px w-8 bg-brand-gold/40" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                Our Story
              </span>
              <span className="h-px w-8 bg-brand-gold/40" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.1] mb-5">
              <RevealText text="We saw an industry built on shortcuts." />
            </h1>
            <RevealOnScroll as="p" delay={300} className="text-foreground/55 leading-relaxed text-lg">
              So we started Clarum.
            </RevealOnScroll>
          </div>
        </section>

        <section className="bg-card border-b border-white/5 gold-grid-texture">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 py-16 md:py-24">
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
                We spent years on the other side of the counter, ordering
                peptides and hoping the label matched what was actually in the
                vial. For a while, a handful of vendors made that easy. Reliable.
                Consistent.
              </p>
              <p>
                Then the cracks showed. Vendor after vendor cut the same
                corners: skip identity testing, skip heavy metals, skip
                endotoxin, run an HPLC, call it "third-party tested." Enough to
                look legitimate. Not enough to actually protect the research.
              </p>
              <p>
                It was cheaper. It was faster. Most customers couldn't tell the
                difference, so the market raced to the bottom, competing on
                Instagram ads and influencer codes instead of purity. The COAs
                that did exist were vague, generic, or recycled across batches.
                We saw one COA used for three different lots.
              </p>
            </RevealOnScroll>

            <div className="my-14 h-px bg-gradient-to-r from-transparent via-brand-gold/25 to-transparent" />

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
                "Good enough" wasn't going to cut it, and a single HPLC number
                with a trust-me attitude felt insulting to anyone reading the
                report.
              </p>
              <p>
                Five independent panels per batch: HPLC purity, mass spec
                identity, heavy metals (ICP-MS), microbial, endotoxin (LAL).
                Same lab. Same panel. Costs us roughly $480 per batch. We do it
                anyway.
              </p>
              <p>
                Then we publish the full results. No login. No paywall. Every
                Certificate of Analysis is public, batch-specific, and linked
                via a QR code on the vial. If you want to verify what you're
                buying before you buy it, you can.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        <section className="bg-background border-b border-white/5">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 py-14 md:py-20">
            <div className="text-center mb-12">
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                Methodology
              </span>
              <h2 className="font-display text-3xl lg:text-4xl text-foreground mt-2">
                <RevealText text="The 5-Panel Standard" />
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              {panels.map((c, i) => (
                <RevealOnScroll key={c.title} delay={i * 80} className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full border-2 border-brand-gold/40 flex items-center justify-center group-hover:border-brand-gold transition-colors">
                    <c.icon className="h-6 w-6 text-brand-gold" />
                  </div>
                  <h3 className="font-display text-lg text-foreground mb-1">{c.title}</h3>
                  <p className="text-xs text-foreground/55">{c.desc}</p>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 py-14 md:py-20">
            <div className="text-center mb-8">
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                Values
              </span>
            </div>
            <RevealOnScroll
              as="p"
              className="font-display text-2xl md:text-3xl text-foreground leading-[1.3] text-center"
            >
              We test every batch, publish every COA, and don't pay for
              influencer codes.
            </RevealOnScroll>
            <div className="text-center mt-10">
              <Link
                to="/coa-library"
                className="inline-flex items-center gap-1 rounded-full border border-brand-gold/40 text-brand-gold px-7 py-3.5 text-sm font-medium hover:bg-brand-gold/10 transition-colors"
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
