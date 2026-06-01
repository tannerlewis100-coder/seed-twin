import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Loader2, X } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

import RevealText from "@/components/RevealText";
import RevealOnScroll from "@/components/RevealOnScroll";
import ProductDetailModal from "@/components/ProductDetailModal";

import { variantVialImage } from "@/lib/vialImages";
import { decodeEntities, fetchProducts, firstImage, productPrice, type WooProduct } from "@/lib/woo";

export const Route = createFileRoute("/shop/")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "Shop Research Peptides — Full Catalog | CLARUM" },
      {
        name: "description",
        content:
          "Browse Clarum's catalog of batch-tested research peptides. Every product ships with a public Certificate of Analysis. For in vitro laboratory research use only.",
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
  const [products, setProducts] = useState<WooProduct[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errMsg, setErrMsg] = useState<string>("");

  const [activeCat, setActiveCat] = useState("All");
  const [query, setQuery] = useState("");
  const [activeProduct, setActiveProduct] = useState<WooProduct | null>(null);

  // Sync modal open/close with URL so /shop/<slug> is shareable.
  const openProduct = (p: WooProduct) => {
    setActiveProduct(p);
    if (typeof window !== "undefined" && p.slug) {
      window.history.pushState({ shopModal: p.slug }, "", `/shop/${p.slug}`);
    }
  };
  const closeProduct = (fromPopState = false) => {
    setActiveProduct(null);
    if (!fromPopState && typeof window !== "undefined" && window.location.pathname !== "/shop") {
      window.history.pushState({}, "", "/shop");
    }
  };

  useEffect(() => {
    const onPop = () => {
      // Browser back/forward — close any open quick-view modal.
      setActiveProduct(null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchProducts()
      .then((list) => {
        if (cancelled) return;
        // Hide standalone variations; only show parent / simple products.
        setProducts(list.filter((p) => p.type !== "variation"));
        setStatus("ready");
      })
      .catch((e) => {
        if (cancelled) return;
        setErrMsg(e instanceof Error ? e.message : "Failed to load products");
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, string>(); // slug → name
    for (const p of products) {
      for (const c of p.categories ?? []) {
        if (!map.has(c.slug)) map.set(c.slug, decodeEntities(c.name));
      }
    }
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [products]);

  const filters = useMemo(
    () => [{ name: "All", slug: "All" }, ...categories],
    [categories],
  );

  const visible = useMemo(() => {
    let items = products;
    if (activeCat !== "All") {
      items = items.filter((p) => p.categories?.some((c) => c.slug === activeCat));
    }
    const q = query.trim().toLowerCase();
    if (q) items = items.filter((p) => p.name.toLowerCase().includes(q));
    return items;
  }, [products, activeCat, query]);

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
              Every compound below runs the full analytical panel. Tap a card
              to pull up the current batch COA.
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
              {filters.map((cat) => (
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
            {status === "loading" && (
              <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
                <Loader2 className="h-6 w-6 animate-spin text-brand-gold mb-3" />
                <p className="text-sm">Loading catalog…</p>
              </div>
            )}

            {status === "error" && (
              <div className="text-center py-20">
                <p className="text-foreground/70 text-sm">Couldn't load the catalog right now.</p>
                <p className="text-foreground/40 text-xs mt-2">{errMsg}</p>
              </div>
            )}

            {status === "ready" && (
              <>
                <p className="text-xs text-foreground/50 mb-6">
                  Showing <span className="text-foreground font-semibold">{visible.length}</span>{" "}
                  product{visible.length !== 1 ? "s" : ""}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {visible.map((p, i) => {
                    const price = productPrice(p);
                    const hasRange = price.min !== price.max;
                    const wooImg = firstImage(p);
                    const vial = variantVialImage({
                      name: p.name,
                      slug: p.slug,
                      fallbackSrc: wooImg,
                    });
                    const rawCat = p.categories?.[0]?.name ?? "Research";
                    const cat = decodeEntities(rawCat)
                      .replace(/\s*&.*$/, "")
                      .trim();
                    const displayName = decodeEntities(p.name)
                      .replace(/\s*[—–-]\s.*$/, "")
                      .trim();
                    const sizeCount = p.variations?.length ?? 0;
                    return (
                      <RevealOnScroll key={p.id} delay={Math.min(i * 40, 400)}>
                        <button
                          type="button"
                          onClick={() => openProduct(p)}
                          className="group/card relative flex flex-col items-center text-center overflow-hidden rounded-3xl h-[520px] w-full p-6 bg-brand-forest-deep border border-white/5 hover:border-brand-gold/40 transition-all duration-500 hover:-translate-y-1 shadow-xl"
                        >
                          <div className="absolute top-5 left-5 z-10">
                            <span className="text-[10px] uppercase tracking-wider font-bold bg-brand-gold/90 text-brand-forest px-3 py-1.5 rounded-full">
                              {cat}
                            </span>
                          </div>
                          {sizeCount > 1 && (
                            <div className="absolute top-5 right-5 z-10">
                              <span className="text-[10px] uppercase tracking-wider font-semibold bg-white/10 text-foreground/80 border border-white/10 px-2.5 py-1 rounded-full">
                                {sizeCount} vial sizes
                              </span>
                            </div>
                          )}

                          <h3 className="relative z-10 mt-14 font-display text-xl md:text-2xl text-foreground leading-tight max-w-[85%] min-h-[4rem] flex items-center justify-center break-words hyphens-auto">
                            {displayName}
                          </h3>

                          <div className="relative z-10 flex-1 flex items-center justify-center w-full mt-2 mb-4">
                            <img
                              src={vial}
                              alt={`${p.name} vial`}
                              loading="lazy"
                              draggable={false}
                              className="h-56 w-auto max-w-full object-contain select-none drop-shadow-2xl transition-transform duration-700 group-hover/card:scale-105"
                            />
                          </div>

                          <div className="relative z-10 w-full">
                            <div className="mx-auto w-fit rounded-full bg-brand-forest border border-white/10 px-10 py-3 text-foreground text-sm font-medium group-hover/card:bg-brand-gold group-hover/card:text-brand-forest group-hover/card:border-brand-gold transition-colors">
                              View Details
                            </div>
                            <p className="mt-4 text-xs text-foreground/60">
                              {hasRange ? "From " : ""}
                              <span className="text-foreground/90 font-semibold">
                                ${price.min.toFixed(2)}
                              </span>
                            </p>
                          </div>
                        </button>
                      </RevealOnScroll>
                    );
                  })}
                </div>
                {visible.length === 0 && (
                  <p className="text-center text-foreground/40 py-20">
                    No products found matching your filters.
                  </p>
                )}
              </>
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
        product={activeProduct}
        open={!!activeProduct}
        onOpenChange={(o) => !o && closeProduct()}
      />
    </div>
  );
}
