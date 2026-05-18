import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { COMING_SOON_SLUGS, type Peptide } from "@/data/peptides";
import { useCart } from "@/lib/cart";
import { Check, ShoppingCart } from "lucide-react";
import Vial360 from "@/components/Vial360";

type Props = {
  group: Peptide[] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ProductDetailModal({ group, open, onOpenChange }: Props) {
  const variants = useMemo(
    () => (group ? [...group].sort((a, b) => a.price - b.price) : []),
    [group],
  );
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (variants.length) setActiveSlug(variants[0].slug);
    setAdded(false);
  }, [variants]);

  if (!group || !variants.length) return null;
  const active = variants.find((v) => v.slug === activeSlug) ?? variants[0];
  const comingSoon = COMING_SOON_SLUGS.has(active.slug);
  const code = active.batch?.split("-").slice(-1)[0]?.replace(/\d+$/, "") || active.name.slice(0, 3).toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-brand-forest-deep border-white/10 text-foreground p-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Vial */}
          <div className="relative bg-gradient-to-br from-brand-forest to-brand-forest-deep p-10 flex items-center justify-center min-h-[320px] border-b md:border-b-0 md:border-r border-white/5">
            <div className="absolute inset-0 gold-line-texture pointer-events-none opacity-40" />
            <Vial360 size="lg" />
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
            <span className="text-[10px] uppercase tracking-wider font-bold bg-brand-gold/90 text-brand-forest px-3 py-1 rounded-full">
              {active.category}
            </span>
            <h2 className="font-display text-2xl md:text-3xl mt-3 leading-tight">{active.name}</h2>
            <p className="text-xs text-foreground/50 mt-2">
              Batch {active.batch} · HPLC {active.purity}
            </p>

            <p className="text-sm text-foreground/70 mt-4 leading-relaxed">
              {active.description}
            </p>

            {variants.length > 1 && (
              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-wider text-foreground/50 font-semibold mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const isActive = v.slug === active.slug;
                    return (
                      <button
                        key={v.slug}
                        type="button"
                        onClick={() => setActiveSlug(v.slug)}
                        className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
                          isActive
                            ? "bg-brand-gold/15 border-brand-gold/50 text-brand-gold"
                            : "bg-white/[0.03] border-white/10 text-foreground/60 hover:text-foreground/90 hover:border-white/20"
                        }`}
                      >
                        {v.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-3xl font-display text-foreground">${active.price.toFixed(2)}</span>
              <span className="text-xs text-foreground/40">USD</span>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              {comingSoon ? (
                <button
                  type="button"
                  disabled
                  className="flex-1 rounded-full bg-white/5 border border-white/10 text-foreground/40 px-6 py-3 text-sm font-medium cursor-not-allowed"
                >
                  Coming soon
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    addItem({
                      slug: active.slug,
                      name: `${active.name} ${active.size}`,
                      size: active.size,
                      price: active.price,
                    });
                    setAdded(true);
                    window.setTimeout(() => setAdded(false), 1500);
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold text-brand-forest px-6 py-3 text-sm font-semibold hover:bg-brand-gold/90 transition-colors"
                >
                  {added ? (
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
