import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Shield } from "lucide-react";
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
            <h1 className="font-display text-[40px] sm:text-5xl md:text-6xl text-foreground leading-tight">
              <RevealText text="Research Peptides" />
            </h1>
            <RevealOnScroll as="p" delay={200} className="mt-5 text-foreground/55 max-w-xl mx-auto">
              Every compound below runs the full 5-panel at Eurofins in
              Lancaster, PA. Tap a card to pull up the current batch COA.
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => {
                const shortDesc =
                  p.description.length > 180
                    ? p.description.slice(0, 180).replace(/\s+\S*$/, "") + "…"
                    : p.description;
                return (
                  <RevealOnScroll key={p.slug} delay={Math.min(i * 30, 300)}>
                    <Link
                      to="/shop/$slug"
                      params={{ slug: p.slug }}
                      className="group/card relative flex flex-col h-full rounded-3xl bg-brand-forest-deep border border-white/5 hover:border-brand-gold/40 transition-all duration-500 hover:-translate-y-1 shadow-xl overflow-hidden"
                    >
                      {/* Visual header */}
                      <div className="relative h-48 bg-gradient-to-b from-black/40 to-brand-forest-deep flex items-center justify-center border-b border-white/5">
                        <div className="absolute top-4 left-4 z-10">
                          <span className="text-[10px] uppercase tracking-wider font-bold bg-brand-gold/90 text-brand-forest px-2.5 py-1 rounded-full">
                            {p.badge ?? p.category}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                          <span className="text-[10px] uppercase tracking-wider text-foreground/60 border border-white/15 rounded-full px-2.5 py-1">
                            {p.purity}
                          </span>
                        </div>
                        <div className="relative w-20 h-32 transition-transform duration-700 group-hover/card:scale-110">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 rounded-t-md bg-gradient-to-b from-neutral-700 to-neutral-900 border border-black/40" />
                          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-14 h-1.5 bg-black/60 rounded-sm" />
                          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-26 h-[6.5rem] rounded-b-xl rounded-t-sm bg-gradient-to-b from-neutral-900 via-black to-neutral-950 border border-white/10 shadow-2xl overflow-hidden">
                            <div className="absolute inset-x-2 top-7 h-px bg-brand-gold/30" />
                            <div className="absolute inset-x-0 top-8 text-center">
                              <span className="text-[7px] tracking-[0.2em] text-brand-gold/80 font-semibold">CLARUM</span>
                            </div>
                            <div className="absolute inset-x-1 bottom-3 text-center">
                              <span className="text-[6px] tracking-wider text-white/50 block">{p.size}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="flex flex-col flex-1 p-5">
                        <div className="text-[10px] uppercase tracking-wider text-brand-gold/80 font-semibold mb-1.5">
                          {p.category}
                        </div>
                        <h3 className="font-display text-xl text-foreground leading-tight">
                          {p.name}
                        </h3>
                        <div className="text-xs text-foreground/50 mt-0.5">
                          {p.size} · Batch {p.batch}
                        </div>

                        <p className="mt-3 text-sm text-foreground/65 leading-relaxed line-clamp-4">
                          {shortDesc}
                        </p>

                        {/* Spec row */}
                        <div className="mt-4 flex items-center gap-2 text-[10px] text-foreground/55">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/10 px-2 py-1">
                            <Shield className="h-2.5 w-2.5 text-brand-gold" /> Eurofins tested
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/10 px-2 py-1">
                            {p.coa.identity}
                          </span>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-5 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-foreground/40">
                              From
                            </div>
                            <div className="font-display text-2xl text-foreground">
                              ${p.price.toFixed(2)}
                            </div>
                          </div>
                          <div className="rounded-full bg-brand-forest border border-white/10 px-5 py-2.5 text-foreground text-xs font-semibold group-hover/card:bg-brand-gold group-hover/card:text-brand-forest group-hover/card:border-brand-gold transition-colors">
                            View Product →
                          </div>
                        </div>
                      </div>
                    </Link>
                  </RevealOnScroll>
                );
              })}
            </div>
            {filtered.length === 0 && (
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
    </div>
  );
}
