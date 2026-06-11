import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronRight, ExternalLink, Search, Shield, X, ZoomIn } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";
import { allPeptides, categories, hasCoa, sampleCoa } from "@/data/peptides";
import { getCoa } from "@/data/coa";

export const Route = createFileRoute("/coa-library")({
  component: CoaLibraryPage,
  head: () => ({
    meta: [
      { title: "COA Library — Public Batch Certificates of Analysis | CLARUM" },
      {
        name: "description",
        content:
          "Browse Clarum's public COA library. Every batch, every test, every result, published openly with no login required.",
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

const FILTERS = [{ name: "All", slug: "All" }, ...categories];

function CoaLibraryPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ src: string; name: string; coaUrl?: string } | null>(
    null,
  );

  const filtered = useMemo(() => {
    let items = allPeptides.filter((p) => !!getCoa(p.slug) && hasCoa(p));
    if (activeCat !== "All") items = items.filter((p) => p.category === activeCat);
    const q = search.trim().toLowerCase();
    if (q) items = items.filter((p) => p.name.toLowerCase().includes(q));
    return items;
  }, [search, activeCat]);

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
            <h1 className="font-display text-[40px] sm:text-5xl md:text-6xl text-foreground leading-tight">
              <RevealText text="The COA Library" />
            </h1>
            <RevealOnScroll as="p" delay={220} className="mt-5 text-foreground/55 max-w-2xl mx-auto">
              Every batch we ship has a Certificate of Analysis. They all live
              here. No login, no email, no paywall.
            </RevealOnScroll>
          </div>
        </section>

        {/* Search + filters */}
        <section className="bg-background border-b border-white/5">
          <div className="mx-auto max-w-7xl px-6 pt-10 pb-6">
            <div className="relative max-w-xl mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gold" />
              <input
                type="text"
                placeholder="Search by product name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-brand-gold/40 transition-colors"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {FILTERS.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setActiveCat(cat.slug);
                    setExpandedSlug(null);
                  }}
                  className={`text-[11px] font-semibold uppercase tracking-wider px-4 py-2 rounded-full border transition-all ${
                    activeCat === cat.slug
                      ? "bg-brand-gold/15 border-brand-gold/40 text-brand-gold"
                      : "bg-white/[0.03] border-white/[0.06] text-foreground/45 hover:text-foreground/70 hover:border-white/15"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card border-b border-white/5">
          <div className="mx-auto max-w-7xl px-6 py-12 space-y-5">
            {filtered.map((p, idx) => {
              const rows = sampleCoa(p);
              const available = hasCoa(p);
              const isExpanded = expandedSlug === p.slug;
              return (
                <RevealOnScroll
                  key={p.slug}
                  delay={Math.min(idx * 40, 400)}
                  className={`group relative bg-background rounded-3xl border transition-colors overflow-hidden ${
                    available
                      ? "border-white/5 hover:border-brand-gold/25"
                      : "border-white/5 opacity-60"
                  }`}
                >
                  <div className="grid lg:grid-cols-[1fr_2fr] gap-0">
                    <div className="p-7 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/70">
                            {available ? `Batch ${p.batch}` : "Batch pending"}
                          </span>
                          {available ? (
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                              ● Pass
                            </span>
                          ) : (
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-white/5 text-foreground/40 px-3 py-1 rounded-full border border-white/10">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <h2 className="font-display text-2xl text-foreground">
                          {p.name}{" "}
                          {p.size && (
                            <span className="text-foreground/50 text-lg">({p.size})</span>
                          )}
                        </h2>
                        <p className="text-xs text-foreground/45 mt-1">
                          {p.category}
                        </p>
                        <p className="text-[11px] text-foreground/40 mt-2">{p.coa.form}</p>
                      </div>
                      {available && (
                        <button
                          type="button"
                          onClick={() => setExpandedSlug(isExpanded ? null : p.slug)}
                          className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-brand-gold/40 text-brand-gold text-xs font-medium px-4 py-2 hover:bg-brand-gold/10 transition-colors"
                        >
                          View Certificate
                          <ChevronRight
                            className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                          />
                        </button>
                      )}
                    </div>
                    {available ? (
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
                    ) : (
                      <div className="p-7 flex items-center justify-center">
                        <p className="text-xs text-foreground/40 text-center">
                          Testing results will be published once this batch is released.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Expanded COA panel */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? "max-h-[1400px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-white/5">
                      {p.coaImage ? (
                        <div
                          className="relative rounded-2xl bg-white overflow-hidden border border-white/10 cursor-zoom-in group/img"
                          style={{ maxHeight: 800 }}
                          onClick={() =>
                            setLightbox({ src: p.coaImage!, name: p.name, coaUrl: p.coaUrl })
                          }
                        >
                          <img
                            src={p.coaImage}
                            alt={`Certificate of Analysis for ${p.name}`}
                            loading="lazy"
                            className="w-full h-auto"
                          />
                          <div className="absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
                            <span className="opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/70 text-white text-xs font-medium px-4 py-2 rounded-lg backdrop-blur-sm flex items-center gap-1.5">
                              <ZoomIn className="h-3.5 w-3.5" />
                              Click to enlarge
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col items-center justify-center gap-4 py-12 px-6">
                          <Shield className="h-10 w-10 text-brand-gold/60" />
                          <div className="text-center">
                            <p className="text-foreground/55 text-sm mb-1">
                              Full lab report available externally
                            </p>
                            <p className="text-foreground/35 text-xs">
                              View the original certificate of analysis
                            </p>
                          </div>
                        </div>
                      )}

                      {p.coaUrl && (
                        <div className="mt-4 flex">
                          <a
                            href={p.coaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 text-brand-gold text-xs font-medium px-4 py-2 hover:bg-brand-gold/10 transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Open Full Report
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </RevealOnScroll>
              );
            })}

            {filtered.length === 0 && (
              <p className="text-center text-foreground/40 py-20">
                No products found matching your search.
              </p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col"
          onClick={() => setLightbox(null)}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <span className="text-foreground text-sm font-medium">
              {lightbox.name} — Certificate of Analysis
            </span>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="p-2 rounded-full hover:bg-white/10 text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-6 flex items-start justify-center">
            <img
              src={lightbox.src}
              alt={`COA for ${lightbox.name}`}
              className="max-w-full h-auto rounded-xl bg-white"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
