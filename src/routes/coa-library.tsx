import { createFileRoute } from "@tanstack/react-router";
import { Check, Download } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";
import { peptides, sampleCoa } from "@/data/peptides";

export const Route = createFileRoute("/coa-library")({
  component: CoaLibraryPage,
  head: () => ({
    meta: [
      { title: "COA Library — Public Batch Certificates of Analysis | CLARUM" },
      {
        name: "description",
        content:
          "Browse Clarum's public COA library. Every batch, every test, every result — published openly with no login required.",
      },
      { property: "og:title", content: "COA Library | CLARUM" },
      {
        property: "og:description",
        content:
          "Public batch-specific Certificates of Analysis for every research peptide we sell.",
      },
    ],
  }),
});

function CoaLibraryPage() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <section className="relative bg-background border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 gold-line-texture pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-14 text-center">
            <div className="inline-flex items-center gap-2 mb-4 justify-center">
              <span className="h-px w-8 bg-brand-gold/40" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                Public Records
              </span>
              <span className="h-px w-8 bg-brand-gold/40" />
            </div>
            <h1 className="font-display text-5xl md:text-6xl text-foreground leading-tight">
              <RevealText text="The COA Library" />
            </h1>
            <RevealOnScroll as="p" delay={220} className="mt-5 text-foreground/55 max-w-2xl mx-auto">
              Every batch we ship has a Certificate of Analysis. Every COA lives here, openly —
              no login, no email, no paywall.
            </RevealOnScroll>
          </div>
        </section>

        <section className="bg-card border-b border-white/5">
          <div className="mx-auto max-w-7xl px-6 py-16 space-y-5">
            {peptides.map((p, idx) => {
              const rows = sampleCoa(p);
              return (
                <RevealOnScroll
                  key={p.slug}
                  delay={idx * 70}
                  className="group relative bg-background rounded-3xl border border-white/5 hover:border-brand-gold/25 transition-colors overflow-hidden"
                >
                  <div className="grid lg:grid-cols-[1fr_2fr] gap-0">
                    <div className="p-7 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/70">
                            Batch {p.batch}
                          </span>
                          <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                            ● Pass
                          </span>
                        </div>
                        <h2 className="font-display text-2xl text-foreground">
                          {p.name}{" "}
                          <span className="text-foreground/50 text-lg">({p.size})</span>
                        </h2>
                        <p className="text-xs text-foreground/45 mt-1">{p.category} · ISO/IEC 17025 lab</p>
                      </div>
                      <button
                        type="button"
                        className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-brand-gold/40 text-brand-gold text-xs font-medium px-4 py-2 hover:bg-brand-gold/10 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" /> Download PDF
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
                      {rows.map((row) => (
                        <div key={row.label} className="p-5 flex flex-col gap-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-foreground/45">
                            {row.label}
                          </span>
                          <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
