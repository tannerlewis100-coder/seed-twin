import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";
import { allPeptides, categories } from "@/data/peptides";

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

  const filtered = useMemo(() => {
    let items = allPeptides;
    if (activeCat !== "All") items = items.filter((p) => p.category === activeCat);
    const q = query.trim().toLowerCase();
    if (q) items = items.filter((p) => p.name.toLowerCase().includes(q));
    return items;
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
            <h1 className="font-display text-5xl md:text-6xl text-foreground leading-tight">
              <RevealText text="Research Peptides" />
            </h1>
            <RevealOnScroll as="p" delay={200} className="mt-5 text-foreground/55 max-w-xl mx-auto">
              Every compound below is batch-tested across HPLC, mass spec, heavy metals, microbial,
              and endotoxin panels. Tap any card to view its current COA.
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
              Showing <span className="text-foreground font-semibold">{filtered.length}</span>{" "}
              product{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((p, i) => (
                <RevealOnScroll key={p.slug} delay={Math.min(i * 40, 400)}>
                  <Link
                    to="/coa-library"
                    className="group/card relative cursor-pointer overflow-hidden rounded-3xl h-96 w-full flex flex-col justify-between p-5 border border-white/5 hover:border-brand-gold/40 transition-all duration-500 hover:-translate-y-1 shadow-xl"
                  >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-forest-deep via-background to-black transition-transform duration-700 group-hover/card:scale-110" />
                    <div className="absolute inset-0 gold-line-texture opacity-30 pointer-events-none" />

                    {/* Dark hover overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover/card:bg-black/70 transition-colors duration-500" />

                    {/* Top meta row */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-brand-gold font-bold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-brand-gold/20">
                        {p.badge ?? p.category}
                      </span>
                      <span className="text-[10px] text-white/70 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {p.purity} HPLC
                      </span>
                    </div>

                    {/* Bottom content */}
                    <div className="relative z-10">
                      <h3 className="text-xl font-semibold tracking-tight text-foreground leading-snug">
                        {p.name}
                        {p.size && (
                          <span className="text-foreground/60 text-sm font-normal"> ({p.size})</span>
                        )}
                      </h3>
                      <p className="font-normal text-sm text-gray-100/90 my-3 leading-relaxed line-clamp-2 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between text-sm pt-2">
                        <span className="text-white font-semibold">${p.price.toFixed(2)}</span>
                        <span className="rounded-full border border-brand-gold/40 text-brand-gold px-3 py-1 text-xs group-hover/card:bg-brand-gold group-hover/card:text-brand-forest transition-colors">
                          View COA
                        </span>
                      </div>
                    </div>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-foreground/40 py-20">
                No products found matching your filters.
              </p>
            )}
            <p className="mt-12 text-center text-xs text-foreground/40 max-w-2xl mx-auto">
              All products listed are intended strictly for in vitro laboratory research. Not for
              human or veterinary use, clinical application, or food.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
