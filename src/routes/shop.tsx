import { createFileRoute, Link } from "@tanstack/react-router";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import CoaCard from "@/components/CoaCard";
import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";
import { peptides } from "@/data/peptides";

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

function ShopPage() {
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

        <section className="bg-card border-b border-white/5">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {peptides.map((p) => (
                <Link
                  key={p.slug}
                  to="/coa-library"
                  className="group bg-background rounded-3xl p-6 flex flex-col border border-white/5 hover:border-brand-gold/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-brand-gold/80 font-bold">
                      {p.tag ?? p.category}
                    </span>
                    <span className="text-[10px] text-foreground/40">{p.purity} HPLC</span>
                  </div>
                  <div className="my-6">
                    <CoaCard peptide={p} variant="mini" />
                  </div>
                  <div className="font-display text-2xl text-foreground">
                    {p.name}{" "}
                    <span className="text-foreground/50 text-base">({p.size})</span>
                  </div>
                  <p className="text-xs text-foreground/55 mt-2 leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="text-foreground/80 font-medium">${p.price.toFixed(2)}</span>
                    <span className="rounded-full border border-brand-gold/30 text-brand-gold px-3 py-1 group-hover:bg-brand-gold group-hover:text-brand-forest transition-colors">
                      View COA
                    </span>
                  </div>
                </Link>
              ))}
            </div>
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
