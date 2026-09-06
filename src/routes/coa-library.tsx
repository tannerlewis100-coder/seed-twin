import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Search } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";
import { allPeptides, categories } from "@/data/peptides";
import { coaForSlug, formatTestedAt, slugToSku, type CoaStatus } from "@/data/coaLibrary";
import { CoaAttribution, CoaDecisionBadge, CoaResultRow, coaRows } from "@/components/CoaResults";
import { CoaDocument, CoaPendingPanel, CoaUnavailablePanel } from "@/components/CoaViewer";

export const Route = createFileRoute("/coa-library")({
  component: CoaLibraryPage,
  head: () => ({
    meta: [
      { title: "COA Library — Public Batch Certificates of Analysis | CLARUM" },
      {
        name: "description",
        content:
          "Search Clarum's public COA library by product, SKU or batch. Each entry links the original third-party certificate for the current supplied batch.",
      },
      { property: "og:title", content: "COA Library | CLARUM" },
      {
        property: "og:description",
        content:
          "Batch-specific Certificates of Analysis for every research compound we sell — searchable by name, SKU or batch.",
      },
    ],
  }),
});

const FILTERS = [{ name: "All", slug: "All" }, ...categories];

function CoaLibraryPage() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const entries = useMemo(
    () =>
      allPeptides.map((p) => ({
        peptide: p,
        sku: slugToSku[p.slug] ?? null,
        status: coaForSlug(p.slug) as CoaStatus,
      })),
    [],
  );

  const filtered = useMemo(() => {
    let items = entries;
    if (activeCat !== "All") items = items.filter((e) => e.peptide.category === activeCat);
    const q = search.trim().toLowerCase();
    if (q) {
      items = items.filter((e) => {
        const batch = e.status.state === "published" ? e.status.record.batch : "";
        return [e.peptide.name, e.peptide.size, e.sku ?? "", batch]
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
    }
    return items;
  }, [entries, search, activeCat]);

  const publishedCount = entries.filter((e) => e.status.state === "published").length;

  // Auto-expand a card when the URL hash points at it (deep link from a product page).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const expandFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash.startsWith("coa-")) return;
      const slug = hash.slice("coa-".length);
      if (!slug) return;
      setExpandedSlug(slug);
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    expandFromHash();
    window.addEventListener("hashchange", expandFromHash);
    return () => window.removeEventListener("hashchange", expandFromHash);
  }, []);

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
              Independent third-party certificates for the current supplied batches. Each report
              lists its own methods and results — panels differ from report to report. {publishedCount}{" "}
              published certificates, searchable by product, SKU or batch. No login required.
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
                placeholder="Search by product, SKU or batch…"
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
            {filtered.map(({ peptide: p, sku, status }, idx) => {
              const isExpanded = expandedSlug === p.slug;
              const published = status.state === "published";
              const rows = published ? coaRows(status.record) : [];
              return (
                <RevealOnScroll
                  key={p.slug}
                  id={`coa-${p.slug}`}
                  delay={Math.min(idx * 30, 300)}
                  className={`group relative bg-background rounded-3xl border transition-colors overflow-hidden scroll-mt-24 ${
                    published ? "border-white/5 hover:border-brand-gold/25" : "border-white/5 opacity-70"
                  }`}
                >
                  <div className="grid lg:grid-cols-[1fr_2fr] gap-0">
                    <div className="p-6 sm:p-7 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold/70">
                            {published ? `Batch ${status.record.batch}` : "Batch —"}
                          </span>
                          {published ? (
                            <CoaDecisionBadge record={status.record} />
                          ) : (
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-white/5 text-foreground/40 px-3 py-1 rounded-full border border-white/10">
                              {status.state === "pending" ? "Report pending" : "Current report unavailable"}
                            </span>
                          )}
                        </div>
                        <h2 className="font-display text-2xl text-foreground">
                          {p.name}{" "}
                          {p.size && <span className="text-foreground/50 text-lg">({p.size})</span>}
                        </h2>
                        <p className="text-xs text-foreground/45 mt-1">{p.category}</p>
                        <p className="text-[11px] text-foreground/40 mt-2">
                          {sku ? `Supplier SKU ${sku}` : "No supplier SKU match"}
                          {published ? ` · Tested ${formatTestedAt(status.record.testedAt)}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExpandedSlug(isExpanded ? null : p.slug)}
                        className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-brand-gold/40 text-brand-gold text-xs font-medium px-4 py-2 hover:bg-brand-gold/10 transition-colors"
                      >
                        {published ? "View certificate" : "View status"}
                        <ChevronRight
                          className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        />
                      </button>
                    </div>

                    {published ? (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
                        {rows.map((row) => (
                          <CoaResultRow key={row.label} row={row} />
                        ))}
                      </div>
                    ) : (
                      <div className="p-7 flex items-center justify-center">
                        <p className="text-xs text-foreground/40 text-center">
                          {status.state === "pending"
                            ? "The supplier lists this SKU with no published certificate yet."
                            : "No matching current supplier certificate was found for this item."}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Expanded certificate panel */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-white/5">
                      {status.state === "published" ? (
                        <>
                          <CoaDocument
                            record={status.record}
                            productLabel={`${p.name} ${p.size}`.trim()}
                          />
                          <div className="mt-4">
                            <CoaAttribution record={status.record} />
                          </div>
                        </>
                      ) : status.state === "pending" ? (
                        <CoaPendingPanel sku={status.sku} productName={status.productName} />
                      ) : (
                        <CoaUnavailablePanel />
                      )}
                    </div>
                  )}
                </RevealOnScroll>
              );
            })}

            {filtered.length === 0 && (
              <p className="text-center text-foreground/40 py-20">
                No records found for that product, SKU or batch.
              </p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
