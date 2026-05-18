import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";
import { allPeptides, categories, type Peptide } from "@/data/peptides";
import ProductDetailModal from "@/components/ProductDetailModal";
import Vial360 from "@/components/Vial360";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "Shop Research Peptides — Full Catalog | CLARUM" },
      {
        name: "description",
        content:
          "Browse Clarum's catalog of batch-tested research peptides. Every product ships with a public 5-panel Certificate of Analysis. For in vitro laboratory research use only.",
      },
      { property: "og:title", content: "Shop Research Peptides | CLARUM" },
      {
        property: "og:description",
        content: "Full catalog of analytically tested research peptides with public COAs.",
      },
    ],
  }),
});

const FILTERS = [{ name: "All", slug: "All" }, ...categories];

function ShopPage() {
  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<Peptide[] | null>(null);

  const groups = useMemo(() => {
    let items = allPeptides;
    if (activeCat !== "All") items = items.filter((p) => p.category === activeCat);
    const q = query.trim().toLowerCase();
    if (q) items = items.filter((p) => p.name.toLowerCase().includes(q));
    const map = new Map<string, Peptide[]>();
    for (const p of items) {
      const key = `${p.name}__${p.category}`;
      const arr = map.get(key);
      if (arr) arr.push(p);
      else map.set(key, [p]);
    }
    return Array.from(map.values()).map((variants) =>
      [...variants].sort((a, b) => a.price - b.price),
    );
  }, [activeCat, query]);

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <section className="relative bg-background border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 gold-line-texture pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-4 justify-center">
              <span className="h-px w-8 bg-brand-gold/40" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-brand-gold font-semibold">
                Catalog
              </span>
              <span className="h-px w-8 bg-brand-gold/40" />
            </div>
            <h1 className="font-display text-[40px] sm:text-5xl md:text-6xl text-foreground leading-tight">
              <RevealText text="Research Peptides" />
            </h1>
            <RevealOnScroll as="p" delay={200} className="mt-5 text-foreground/55 max-w-xl mx-auto">
              Every compound below runs the full 5-panel. Tap a card to pull
              up the current batch COA.
            </RevealOnScroll>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-background border-b border-white/5">
          <div className="mx-auto max-w-7xl px-6 pt-10 pb-6">
            <div className="relative max-w-xl mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-gold" />
              <input
                type="text"
                placeholder="Search peptides…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-foreground text-sm placeholder:text-foreground/30 focus:outline-none focus:border-brand-gold/40 transition-colors"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {FILTERS.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setActiveCat(cat.slug)}
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
          <div className="mx-auto max-w-7xl px-6 py-12">
            <p className="text-xs text-foreground/50 mb-6">
              Showing <span className="text-foreground font-semibold">{groups.length}</span>{" "}
              product{groups.length !== 1 ? "s" : ""}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {groups.map((group, i) => {
                const p = group[0];
                const code = p.batch?.split("-").slice(-1)[0]?.replace(/\d+$/, "") || p.name.slice(0, 3).toUpperCase();
                const shortCode = `${code}-${String(i + 1).padStart(2, "0")}`;
                const sizeCount = group.length;
                return (
                  <RevealOnScroll key={p.slug} delay={Math.min(i * 40, 400)}>
                    <button
                      type="button"
                      onClick={() => setActiveGroup(group)}
                      className="group/card relative flex flex-col items-center text-center overflow-hidden rounded-3xl h-[520px] w-full p-6 bg-brand-forest-deep border border-white/5 hover:border-brand-gold/40 transition-all duration-500 hover:-translate-y-1 shadow-xl"
                    >
                      <div className="absolute top-5 left-5 z-10">
                        <span className="text-[10px] uppercase tracking-wider font-bold bg-brand-gold/90 text-brand-forest px-3 py-1.5 rounded-full">
                          {p.badge ?? p.category}
                        </span>
                      </div>
                      {sizeCount > 1 && (
                        <div className="absolute top-5 right-5 z-10">
                          <span className="text-[10px] uppercase tracking-wider font-semibold bg-white/10 text-foreground/80 border border-white/10 px-2.5 py-1 rounded-full">
                            {sizeCount} vial sizes
                          </span>
                        </div>
                      )}

                      <h3 className="relative z-10 mt-14 font-display text-2xl md:text-3xl text-foreground leading-tight max-w-[85%] min-h-[4rem] flex items-center justify-center">
                        {p.name}
                      </h3>

                      <div className="relative z-10 flex-1 flex items-center justify-center w-full mt-2 mb-4">
                        {p.slug.startsWith("ghk-cu") ? (
                          <Vial360 size="lg" hoverGroup="card" />
                        ) : (
                          <div className="relative w-32 h-44 transition-transform duration-700 group-hover/card:scale-105">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 rounded-t-md bg-gradient-to-b from-neutral-700 to-neutral-900 border border-black/40" />
                            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[5.5rem] h-2 bg-black/60 rounded-sm" />
                            <div className="absolute top-7 left-1/2 -translate-x-1/2 w-28 h-36 rounded-b-xl rounded-t-sm bg-gradient-to-b from-neutral-900 via-black to-neutral-950 border border-white/10 shadow-2xl overflow-hidden">
                              <div className="absolute inset-x-3 top-10 h-px bg-brand-gold/30" />
                              <div className="absolute inset-x-0 top-12 text-center">
                                <span className="text-[8px] tracking-[0.2em] text-brand-gold/80 font-semibold">CLARUM</span>
                              </div>
                              <div className="absolute inset-x-4 bottom-6 text-center">
                                <span className="text-[7px] tracking-wider text-white/50 block">{shortCode} · {p.size}</span>
                                <span className="text-[6px] tracking-wider text-white/30 block mt-0.5">RESEARCH USE ONLY</span>
                              </div>
                              <div className="absolute inset-y-0 right-2 w-2 bg-gradient-to-r from-transparent to-white/10" />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="relative z-10 w-full">
                        <div className="mx-auto w-fit rounded-full bg-brand-forest border border-white/10 px-10 py-3 text-foreground text-sm font-medium group-hover/card:bg-brand-gold group-hover/card:text-brand-forest group-hover/card:border-brand-gold transition-colors">
                          View Details
                        </div>
                        <p className="mt-4 text-xs text-foreground/60">
                          {sizeCount > 1 ? "Starting at " : ""}
                          <span className="text-foreground/90 font-semibold">${p.price.toFixed(2)}</span>
                        </p>
                      </div>
                    </button>
                  </RevealOnScroll>
                );
              })}
            </div>
            {groups.length === 0 && (
              <p className="text-center text-foreground/40 py-20">
                No products found matching your filters.
              </p>
            )}
            <p className="mt-12 text-center text-xs text-foreground/40 max-w-2xl mx-auto">
              All products are for in vitro laboratory research only. Not for
              human or veterinary use, clinical application, or food.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <ProductDetailModal
        group={activeGroup}
        open={!!activeGroup}
        onOpenChange={(o) => !o && setActiveGroup(null)}
      />
    </div>
  );
}
