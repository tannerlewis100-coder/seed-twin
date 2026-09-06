import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Check, Loader2, ShoppingCart, ArrowLeft, FileText } from "lucide-react";
import { AnnouncementBar, SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import RelatedProducts from "@/components/RelatedProducts";
import { useCart } from "@/lib/cart";
import { FreeShippingProgress } from "@/components/FreeShippingProgress";
import { variantVialImage } from "@/lib/vialImages";
import {
  decodeEntities,
  fetchClarumProduct,
  fetchProductBySlug,
  fetchVariations,
  firstImage,
  fromMinor,
  getVariationSize,
  stripHtml,
  type WooProduct,
} from "@/lib/woo";

const LEGACY_SLUG_REDIRECTS: Record<string, string> = {
  wolverine: "bpc-157-tb-500-blend",
  "wolverine-blend": "bpc-157-tb-500-blend",
  "wolverine-5mg": "bpc-157-tb-500-blend",
  "wolverine-10mg": "bpc-157-tb-500-blend",
};

export const Route = createFileRoute("/shop/$slug")({
  beforeLoad: ({ params }) => {
    const target = LEGACY_SLUG_REDIRECTS[params.slug.toLowerCase()];
    if (target) {
      throw redirect({ to: "/shop/$slug", params: { slug: target }, statusCode: 301 });
    }
  },
  component: ProductPage,
  head: ({ params }) => ({
    meta: [
      { title: `${humanize(params.slug)} — Research Peptide | CLARUM` },
      {
        name: "description",
        content: `Buy ${humanize(params.slug)} — analytically tested research peptide. Ships with a public Certificate of Analysis. For in vitro laboratory research only.`,
      },
      { property: "og:title", content: `${humanize(params.slug)} | CLARUM` },
      {
        property: "og:description",
        content: `${humanize(params.slug)} research peptide with full third-party lab COA.`,
      },
    ],
    links: [{ rel: "canonical", href: `/shop/${params.slug}` }],
  }),
});

// Format a product slug for SEO metadata without auto-title-casing or
// stripping hyphens (peptide names like BPC-157, GHK-Cu, GLP-3 are
// hyphenated and all-caps). The component itself renders the exact name
// from WooCommerce once loaded; this is only the prerender fallback.
function humanize(slug: string) {
  return slug.toUpperCase();
}

// Same blend-dose collapsing used in the modal.
function sumBlendDose(raw: string): string {
  const parts = raw.split(/[-+/]/).map((s) => s.trim()).filter(Boolean);
  if (parts.length < 2) return raw;
  const nums: number[] = [];
  let unit: string | null = null;
  for (const part of parts) {
    const m = part.match(/^(\d+(?:\.\d+)?)\s*([a-zµ]+)?$/i);
    if (!m) return raw;
    nums.push(parseFloat(m[1]));
    if (m[2]) {
      if (unit && unit !== m[2].toLowerCase()) return raw;
      unit = m[2].toLowerCase();
    }
  }
  if (!unit) return raw;
  return `${nums.reduce((a, b) => a + b, 0)}${unit}`;
}

import { allPeptides, type Peptide } from "@/data/peptides";
import { coaForSlug, slugToSku, type CoaStatus } from "@/data/coaLibrary";
import { CoaAttribution, CoaDecisionBadge, CoaResultRow, coaRows } from "@/components/CoaResults";
import { CoaDocument, CoaPendingPanel, CoaUnavailablePanel } from "@/components/CoaViewer";

/** Find the peptide entry matching the product base slug + selected size. */
function findPeptide(baseSlug: string, size?: string): Peptide | null {
  if (!baseSlug) return null;
  const sizeKey = (size ?? "").toLowerCase().replace(/\s+/g, "");
  if (sizeKey) {
    const exact = allPeptides.find((p) => p.slug === `${baseSlug}-${sizeKey}`);
    if (exact) return exact;
  }
  // Single-size product
  const direct = allPeptides.find((p) => p.slug === baseSlug);
  if (direct) return direct;
  // First match by base slug prefix
  return (
    allPeptides.find((p) =>
      p.slug.startsWith(`${baseSlug}-`) || p.slug === baseSlug,
    ) ?? null
  );
}

/**
 * Resolve the certificate for this product + selected strength by exact supplier
 * SKU. Never approximate: unmatched items report as unavailable.
 */
function resolveCoa(
  productSlug: string,
  variantSize?: string,
): { status: CoaStatus; deepLinkSlug: string | null; sku: string | null } {
  const sizeKey = (variantSize ?? "").toLowerCase().replace(/\s+/g, "");
  const candidates = [
    sizeKey ? `${productSlug}-${sizeKey}` : null,
    productSlug,
    findPeptide(productSlug, variantSize)?.slug ?? null,
  ].filter((s): s is string => Boolean(s));

  for (const slug of candidates) {
    const status = coaForSlug(slug);
    if (status.state !== "unavailable") {
      return { status, deepLinkSlug: slug, sku: slugToSku[slug] ?? null };
    }
  }
  return { status: { state: "unavailable" }, deepLinkSlug: candidates[0] ?? null, sku: null };
}


function ProductPage() {
  const { slug } = Route.useParams();
  const [product, setProduct] = useState<WooProduct | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "not-found">("loading");
  const [variations, setVariations] = useState<WooProduct[]>([]);
  const [sizeById, setSizeById] = useState<Record<number, string>>({});
  const [loadingVars, setLoadingVars] = useState(false);
  const [activeVarId, setActiveVarId] = useState<number | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem, loading: cartLoading, subtotal: cartSubtotal } = useCart();

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchProductBySlug(slug)
      .then((p) => {
        if (cancelled) return;
        if (!p) {
          setStatus("not-found");
          return;
        }
        setProduct(p);
        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const isVariable = product?.type === "variable" && (product.variations?.length ?? 0) > 0;

  useEffect(() => {
    if (!product || !isVariable) return;
    let cancelled = false;
    setLoadingVars(true);
    Promise.all([fetchVariations(product.id), fetchClarumProduct(product.id)])
      .then(([vars, clarum]) => {
        if (cancelled) return;
        const map: Record<number, string> = {};
        for (const v of clarum?.variations ?? []) {
          if (v?.id != null && v.size) map[v.id] = v.size;
        }
        const filtered =
          product.slug === "bpc-157-tb-500-blend"
            ? vars.filter((v) => {
                const size = (map[v.id] ?? getVariationSize(v) ?? "")
                  .replace(/\s+/g, "")
                  .replace(/-/g, "/")
                  .toLowerCase();
                return size !== "20mg/20mg" && size !== "40mg";
              })
            : vars;
        const sorted = [...filtered].sort((a, b) => Number(a.prices.price) - Number(b.prices.price));
        setVariations(sorted);
        setActiveVarId(sorted[0]?.id ?? null);
        setSizeById(map);
      })
      .catch((e) => console.error("Failed to load variations:", e))
      .finally(() => !cancelled && setLoadingVars(false));
    return () => {
      cancelled = true;
    };
  }, [product, isVariable]);

  const activeVar = useMemo(
    () => variations.find((v) => v.id === activeVarId) ?? null,
    [variations, activeVarId],
  );

  // Warm the browser cache for every variant vial so size swaps are instant.
  useEffect(() => {
    if (!product || variations.length === 0) return;
    for (const v of variations) {
      const size = sizeById[v.id] ?? getVariationSize(v);
      const url = variantVialImage({
        name: product.name,
        slug: product.slug,
        size: size ?? undefined,
        fallbackSrc: firstImage(v) ?? firstImage(product),
      });
      if (url) {
        const img = new Image();
        img.src = url;
      }
    }
  }, [product, variations, sizeById]);


  const labelFor = (v: WooProduct) => {
    const fromClarum = sizeById[v.id];
    if (fromClarum) return sumBlendDose(fromClarum);
    const fromAttr = getVariationSize(v);
    if (fromAttr && fromAttr.toLowerCase() !== "any") return sumBlendDose(fromAttr);
    const haystack = `${v.name} ${product?.name ?? ""}`;
    const doseMatch = haystack.match(/(\d+(?:\.\d+)?)\s*(mg|ml|iu|mcg|µg|g)\b/i);
    if (doseMatch) return `${doseMatch[1]}${doseMatch[2].toLowerCase()}`;
    return "Variant";
  };

  const onAdd = async () => {
    if (!product) return;
    if (isVariable && activeVar) {
      const variation = (activeVar.attributes ?? []).map((a) => ({
        attribute: a.name,
        value: a.value ?? a.option ?? "",
      }));
      await addItem({ id: activeVar.id, quantity: 1, variation });
    } else {
      await addItem({ id: product.id, quantity: 1 });
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-foreground/50 hover:text-brand-gold transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to catalog
        </Link>

        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-32 text-foreground/50">
            <Loader2 className="h-6 w-6 animate-spin text-brand-gold mb-3" />
            <p className="text-sm">Loading product…</p>
          </div>
        )}

        {status === "not-found" && (
          <div className="text-center py-32">
            <h1 className="font-display text-3xl mb-2">Product not found</h1>
            <p className="text-foreground/50 text-sm">
              We couldn't find a product at this URL.{" "}
              <Link to="/shop" className="text-brand-gold underline">
                Browse the catalog
              </Link>
              .
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center py-32">
            <p className="text-foreground/70 text-sm">Couldn't load this product.</p>
          </div>
        )}

        {status === "ready" && product && (
          <ProductBody
            product={product}
            display={activeVar ?? product}
            isVariable={!!isVariable}
            variations={variations}
            loadingVars={loadingVars}
            activeVarId={activeVarId}
            setActiveVarId={setActiveVarId}
            labelFor={labelFor}
            currentVariantSize={
              activeVar ? sizeById[activeVar.id] ?? getVariationSize(activeVar) : undefined
            }
            onAdd={onAdd}
            cartLoading={cartLoading}
            added={added}
            activeVar={activeVar}
          />
        )}

        {status === "ready" && product && <RelatedProducts product={product} />}
      </main>
      <SiteFooter />
    </div>
  );
}

function ProductBody({
  product,
  display,
  isVariable,
  variations,
  loadingVars,
  activeVarId,
  setActiveVarId,
  labelFor,
  currentVariantSize,
  onAdd,
  cartLoading,
  added,
  activeVar,
}: {
  product: WooProduct;
  display: WooProduct;
  isVariable: boolean;
  variations: WooProduct[];
  loadingVars: boolean;
  activeVarId: number | null;
  setActiveVarId: (id: number) => void;
  labelFor: (v: WooProduct) => string;
  currentVariantSize?: string;
  onAdd: () => Promise<void>;
  cartLoading: boolean;
  added: boolean;
  activeVar: WooProduct | null;
}) {
  const { subtotal: cartSubtotal } = useCart();
  const cat = decodeEntities(product.categories?.[0]?.name) || "Research";

  const wooImg = firstImage(display) ?? firstImage(product);
  const vial = variantVialImage({
    name: product.name,
    slug: product.slug,
    size: currentVariantSize,
    fallbackSrc: wooImg,
  });
  const price = fromMinor(display.prices.price, display.prices.currency_minor_unit);
  const description =
    stripHtml(product.description) || stripHtml(product.short_description) || "";
  const inStock = display.is_in_stock && display.is_purchasable;
  const batch = display.sku || product.sku;

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 rounded-3xl overflow-hidden bg-brand-forest-deep border border-white/10">
        <div className="relative bg-gradient-to-br from-brand-forest to-brand-forest-deep p-10 flex items-center justify-center min-h-[420px]">
          <div className="absolute inset-0 gold-line-texture pointer-events-none opacity-40" />
          <img
            src={vial}
            alt={`${product.name} vial`}
            draggable={false}
            className="relative h-96 w-auto max-w-full object-contain select-none"
          />
        </div>

        <div className="p-8">
          <span className="text-[10px] uppercase tracking-wider font-bold bg-brand-gold/90 text-brand-forest px-3 py-1 rounded-full">
            {cat}
          </span>
          <h1 className="font-display text-3xl md:text-4xl mt-3 leading-tight">
            {decodeEntities(product.name)}
          </h1>
          {batch && <p className="text-xs text-foreground/50 mt-2">SKU {batch}</p>}

          {description && (
            <p className="text-sm text-foreground/70 mt-4 leading-relaxed">{description}</p>
          )}

          {isVariable && (
            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-wider text-foreground/50 font-semibold mb-2">
                {product.variations[0]?.attributes?.[0]?.name ?? "Size"}
              </p>
              {loadingVars ? (
                <div className="flex items-center gap-2 text-foreground/50 text-xs">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading options…
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {variations.map((v) => {
                    const isActive = v.id === activeVarId;
                    const variantOut = !(v.is_in_stock && v.is_purchasable);
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setActiveVarId(v.id)}
                        aria-label={`${labelFor(v)}${variantOut ? " (out of stock)" : ""}`}
                        className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all inline-flex items-center gap-1.5 ${
                          isActive
                            ? variantOut
                              ? "bg-white/[0.04] border-white/15 text-foreground/45"
                              : "bg-brand-gold/15 border-brand-gold/50 text-brand-gold"
                            : variantOut
                              ? "bg-white/[0.02] border-white/5 text-foreground/35 hover:text-foreground/50"
                              : "bg-white/[0.03] border-white/10 text-foreground/60 hover:text-foreground/90 hover:border-white/20"
                        }`}
                      >
                        <span className={variantOut ? "line-through" : ""}>{labelFor(v)}</span>
                        {variantOut && (
                          <span className="text-[9px] uppercase tracking-wider font-bold text-foreground/40">
                            Out
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-3xl font-display text-foreground">${price.toFixed(2)}</span>
            <span className="text-xs text-foreground/40">{display.prices.currency_code}</span>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            {!inStock ? (
              <button
                type="button"
                disabled
                className="flex-1 rounded-full bg-white/5 border border-white/10 text-foreground/40 px-6 py-3 text-sm font-medium cursor-not-allowed"
              >
                Out of stock
              </button>
            ) : (
              <button
                type="button"
                onClick={onAdd}
                disabled={cartLoading || (isVariable && !activeVar)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold text-brand-forest px-6 py-3 text-sm font-semibold hover:bg-brand-gold/90 transition-colors disabled:opacity-60"
              >
                {cartLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Adding…
                  </>
                ) : added ? (
                  <>
                    <Check className="h-4 w-4" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                  </>
                )}
              </button>
            )}
          </div>

          <FreeShippingProgress
            className="mt-4"
            subtotal={cartSubtotal > 0 ? cartSubtotal : price}
          />

          <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-brand-gold/90">
            <span aria-hidden>🎁</span>
            <span>Every order ships with a free 3ml BAC water.</span>
          </p>


          <p className="mt-4 text-[11px] text-foreground/40">
            For in vitro laboratory research only. Not for human or veterinary use.
          </p>
        </div>
      </div>

      {/* Certificate of Analysis — driven by the current supplier record */}
      {(() => {
        const { status, deepLinkSlug, sku } = resolveCoa(product.slug, currentVariantSize);
        const coaLibraryHref = deepLinkSlug
          ? `/coa-library#coa-${deepLinkSlug}`
          : "/coa-library";
        // JSON-LD Product schema for this product detail page
        const ld = {
          "@context": "https://schema.org",
          "@type": "Product",
          name: decodeEntities(product.name),
          image: wooImg ? [wooImg] : undefined,
          description:
            stripHtml(product.description) || stripHtml(product.short_description) || undefined,
          sku: display.sku || product.sku || undefined,
          brand: { "@type": "Brand", name: "Clarum Peptides" },
          offers: {
            "@type": "Offer",
            price: price.toFixed(2),
            priceCurrency: display.prices.currency_code || "USD",
            availability: inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `https://clarumpeptides.com/shop/${product.slug}`,
          },
        };
        const rows = status.state === "published" ? coaRows(status.record) : [];
        return (
          <section className="mt-10 rounded-3xl border border-brand-gold/15 bg-card p-6 sm:p-8">
            <script
              type="application/ld+json"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
            />
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gold font-semibold mb-1">
                  Certificate of Analysis
                </p>
                <h2 className="font-display text-2xl">Independent third-party batch report</h2>
                {sku && (
                  <p className="text-[11px] text-foreground/40 mt-1">Supplier SKU {sku}</p>
                )}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {status.state === "published" && <CoaDecisionBadge record={status.record} />}
                <a
                  href={coaLibraryHref}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-brand-gold hover:text-brand-gold-light transition-colors"
                >
                  <FileText className="h-4 w-4" /> Open in COA Library
                </a>
              </div>
            </div>

            {status.state === "published" ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {rows.map((row) => (
                    <div
                      key={row.label}
                      className="rounded-2xl border border-white/5 bg-black/30"
                    >
                      <CoaResultRow row={row} />
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <CoaDocument
                    record={status.record}
                    productLabel={decodeEntities(product.name)}
                  />
                </div>

                <div className="mt-4">
                  <CoaAttribution record={status.record} />
                </div>
              </>
            ) : status.state === "pending" ? (
              <CoaPendingPanel sku={status.sku} productName={status.productName} />
            ) : (
              <CoaUnavailablePanel />
            )}
          </section>
        );
      })()}

    </>
  );
}
