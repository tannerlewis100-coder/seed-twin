import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useCart } from "@/lib/cart";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import { variantVialImage } from "@/lib/vialImages";
import {
  decodeEntities,
  fetchClarumProduct,
  fetchVariations,
  firstImage,
  fromMinor,
  stripHtml,
  type WooProduct,
} from "@/lib/woo";

type Props = {
  product: WooProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ProductDetailModal({ product, open, onOpenChange }: Props) {
  const [variations, setVariations] = useState<WooProduct[]>([]);
  const [sizeById, setSizeById] = useState<Record<number, string>>({});
  const [loadingVars, setLoadingVars] = useState(false);
  const [activeVarId, setActiveVarId] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  const { addItem, loading: cartLoading } = useCart();

  const isVariable = product?.type === "variable" && (product.variations?.length ?? 0) > 0;

  // Fetch variations when a variable product is opened.
  useEffect(() => {
    if (!product || !open || !isVariable) {
      setVariations([]);
      setSizeById({});
      setActiveVarId(null);
      return;
    }
    let cancelled = false;
    setLoadingVars(true);
    Promise.all([fetchVariations(product.id), fetchClarumProduct(product.id)])
      .then(([vars, clarum]) => {
        if (cancelled) return;
        const sorted = [...vars].sort((a, b) => Number(a.prices.price) - Number(b.prices.price));
        setVariations(sorted);
        setActiveVarId(sorted[0]?.id ?? null);
        const map: Record<number, string> = {};
        for (const v of clarum?.variations ?? []) {
          if (v?.id != null && v.size) map[v.id] = v.size;
        }
        setSizeById(map);
      })
      .catch((e) => console.error("Failed to load variations:", e))
      .finally(() => {
        if (!cancelled) setLoadingVars(false);
      });
    return () => {
      cancelled = true;
    };
  }, [product, open, isVariable]);

  useEffect(() => {
    setAdded(false);
  }, [product, activeVarId]);

  const activeVar = useMemo(
    () => variations.find((v) => v.id === activeVarId) ?? null,
    [variations, activeVarId],
  );

  if (!product) return null;

  const display: WooProduct = activeVar ?? product;
  const cat = decodeEntities(product.categories?.[0]?.name) || "Research";
  const price = fromMinor(display.prices.price, display.prices.currency_minor_unit);
  const description =
    stripHtml(product.description) || stripHtml(product.short_description) || "";

  const inStock = display.is_in_stock && display.is_purchasable;

  const onAdd = async () => {
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

  // Collapse blend doses ("5mg-5mg", "5+5mg", "50mg/10mg/10mg/10mg") into a single total.
  const sumBlendDose = (raw: string): string => {
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
    const total = nums.reduce((a, b) => a + b, 0);
    return `${total}${unit}`;
  };

  // Pill label: prefer the Clarum endpoint's literal `size` (e.g. "5mg").
  const labelFor = (v: WooProduct) => {
    const fromClarum = sizeById[v.id];
    if (fromClarum) return sumBlendDose(fromClarum);

    // Fallback: Woo attribute value (skip "any" placeholder).
    const attr = v.attributes?.[0];
    const fromAttr = attr?.value ?? attr?.option;
    if (fromAttr && fromAttr.toLowerCase() !== "any") return sumBlendDose(fromAttr);

    // Last-ditch: pull a dose pattern out of the variation/product name.
    const haystack = `${v.name} ${product.name}`;
    const doseMatch = haystack.match(/(\d+(?:\.\d+)?)\s*(mg|ml|iu|mcg|µg|g)\b/i);
    if (doseMatch) return `${doseMatch[1]}${doseMatch[2].toLowerCase()}`;

    return "Variant";
  };

  const wooImg = firstImage(display) ?? firstImage(product);
  const vial = variantVialImage({
    name: product.name,
    slug: product.slug,
    size: activeVar ? labelFor(activeVar) : undefined,
    fallbackSrc: wooImg,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-brand-forest-deep border-white/10 text-foreground p-0 overflow-hidden">
        <VisuallyHidden.Root>
          <DialogTitle>{decodeEntities(product.name)}</DialogTitle>
          <DialogDescription>
            Product details, available sizes, and add-to-cart for {decodeEntities(product.name)}.
          </DialogDescription>
        </VisuallyHidden.Root>
        <div className="grid md:grid-cols-2">
          {/* Vial */}
          <div className="group/card relative bg-gradient-to-br from-brand-forest to-brand-forest-deep p-10 flex items-center justify-center min-h-[320px] border-b md:border-b-0 md:border-r border-white/5">
            <div className="absolute inset-0 gold-line-texture pointer-events-none opacity-40" />
            <img
              src={vial}
              alt={`${product.name} vial`}
              draggable={false}
              className="h-80 w-auto max-w-full object-contain select-none drop-shadow-2xl"
            />
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
            <span className="text-[10px] uppercase tracking-wider font-bold bg-brand-gold/90 text-brand-forest px-3 py-1 rounded-full">
              {cat}
            </span>
            <h2 className="font-display text-2xl md:text-3xl mt-3 leading-tight">{decodeEntities(product.name)}</h2>
            {display.sku && (
              <p className="text-xs text-foreground/50 mt-2">SKU {display.sku}</p>
            )}

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
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setActiveVarId(v.id)}
                          className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
                            isActive
                              ? "bg-brand-gold/15 border-brand-gold/50 text-brand-gold"
                              : "bg-white/[0.03] border-white/10 text-foreground/60 hover:text-foreground/90 hover:border-white/20"
                          }`}
                        >
                          {labelFor(v)}
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

            <p className="mt-4 text-[11px] text-foreground/40">
              For in vitro laboratory research only. Not for human or veterinary use.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
