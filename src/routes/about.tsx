import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FlaskConical, Atom, Shield, Bug, Syringe } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Clarum — Built on Transparency | CLARUM" },
      {
        name: "description",
        content:
          "Why we built Clarum: an industry built on shortcuts, vague claims, and unverifiable purity. We publish every COA, test every batch, and hide nothing.",
      },
      { property: "og:title", content: "About Clarum — Built on Transparency" },
      {
        property: "og:description",
        content: "Our story, our values, and the 5-panel testing standard behind every batch.",
      },
    ],
  }),
});

const values = [
  { title: "Transparency First", desc: "Every COA published. Every batch documented. Nothing behind a login." },
  { title: "Science Over Marketing", desc: "We let the data speak. No influencer hype, no miracle claims." },
  { title: "Beyond Purity", desc: "Most vendors stop at HPLC. We run 5 independent tests per batch." },
  { title: "Built for Researchers", desc: "By people who understand what's at stake when quality fails." },
];

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
              We Saw an Industry Built on{" "}
              <span className="italic text-gold-gradient">Shortcuts</span>
            </h1>
            <p className="text-foreground/55 leading-relaxed text-lg">
              So we built the company we wished existed.
            </p>
          </div>
        </section>

        <section className="bg-card border-b border-white/5 gold-grid-texture">
          <div className="mx-auto max-w-3xl px-6 py-24">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-px w-8 bg-brand-gold/60" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                The Problem
              </span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-7 leading-tight">
              An industry that stopped caring about the people it served.
            </h2>
            <div className="space-y-5 text-foreground/60 leading-[1.8]">
              <p>
                We spent years as researchers on the other side of the counter — ordering peptides
                and hoping the label matched what was actually in the vial. For a while, a handful
                of vendors made that trust easy. Reliable. Consistent.
              </p>
              <p>
                Then the cracks started showing. Vendor after vendor cut the same corners: skip
                identity testing, skip heavy metals, skip endotoxin — just run an HPLC and call it
                "third-party tested." Enough to look legitimate, but not enough to actually protect
                the research.
              </p>
              <p>
                It was cheaper. It was faster. Most customers couldn't tell the difference. The
                market raced to the bottom — competing on price, marketing, and influencer deals
                instead of quality. The COAs that did exist were vague, generic, or recycled across
                batches.
              </p>
            </div>

            <div className="my-14 h-px bg-gradient-to-r from-transparent via-brand-gold/25 to-transparent" />

            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-px w-8 bg-brand-gold/60" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                The Solution
              </span>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-7 leading-tight">
              We didn't build Clarum to fill a gap.{" "}
              <span className="italic text-brand-gold">We built it to fix one.</span>
            </h2>
            <div className="space-y-5 text-foreground/60 leading-[1.8]">
              <p>
                We refused to accept that "good enough" was the standard. We didn't want to be
                another vendor selling vials with a purity number and a trust-me attitude.
              </p>
              <p>
                So we did something the industry considers extreme: we test every single batch
                across five independent panels — HPLC purity, mass spec identity, heavy metals,
                microbial, and endotoxin.{" "}
                <strong className="text-foreground">
                  Every batch. Every product. Every time.
                </strong>
              </p>
              <p>
                Then we publish the full results. No logins. No paywalls. Every Certificate of
                Analysis is publicly available, batch-specific, and linked via QR code on every
                order. If you want to verify what you're buying before you buy it — you can.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-background border-b border-white/5">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="text-center mb-12">
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                Methodology
              </span>
              <h2 className="font-display text-3xl lg:text-4xl text-foreground mt-2">
                The 5-Panel Standard
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              {panels.map((c) => (
                <div key={c.title} className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full border-2 border-brand-gold/40 flex items-center justify-center group-hover:border-brand-gold transition-colors">
                    <c.icon className="h-6 w-6 text-brand-gold" />
                  </div>
                  <h3 className="font-display text-lg text-foreground mb-1">{c.title}</h3>
                  <p className="text-xs text-foreground/55">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <div className="text-center mb-10">
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                Values
              </span>
              <h2 className="font-display text-3xl lg:text-4xl text-foreground mt-2">
                What We Stand For
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="bg-background rounded-2xl border border-white/5 p-6 hover:border-brand-gold/25 transition-colors"
                >
                  <h3 className="font-display text-xl text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-foreground/55">{v.desc}</p>
                </div>
              ))}
            </div>
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
