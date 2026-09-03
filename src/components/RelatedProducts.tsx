import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { variantVialImage } from "@/lib/vialImages";
import {
  decodeEntities,
  fetchProducts,
  fetchVariations,
  firstImage,
  productPrice,
  type WooProduct,
} from "@/lib/woo";

function strengthOf(p: WooProduct): string | null {
  const m = `${p.name} ${p.slug}`.match(/(\d+(?:\.\d+)?)\s*(mg|ml|iu|mcg|µg|ug|g)\b/i);
  if (!m) return null;
  return `${m[1]}${m[2].toLowerCase().replace("ug", "mcg")}`;
}

function baseName(p: WooProduct) {
  return decodeEntities(p.name).replace(/\s*[—–-]\s.*$/, "").trim();
}

export default function RelatedProducts({ product }: { product: WooProduct }) {
  const [all, setAll] = useState<WooProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchProducts()
      .then((list) => !cancelled && setAll(list.filter((p) => p.type !== "variation")))
      .catch(() => undefined)
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const category = product.categories?.[0] ?? null;

  const related = useMemo(() => {
    const pool = all.filter((p) => p.id !== product.id && p.is_purchasable !== false);
    const sameCat = category
      ? pool.filter((p) => p.categories?.some((c) => c.slug === category.slug))
      : [];
    const picks = sameCat.slice(0, 4);
    if (picks.length < 4) {
      for (const p of pool) {
        if (picks.length >= 4) break;
        if (!picks.some((x) => x.id === p.id)) picks.push(p);
      }
    }
    return picks;
  }, [all, product.id, category]);

  if (!loading && related.length === 0) return null;

  const catName = category ? decodeEntities(category.name).replace(/\s*&.*$/, "").trim() : null;

  return (
    <section className="mt-20">
      <h2 className="font-display text-3xl md:text-4xl text-foreground text-left">
        Related Research Compounds
      </h2>

      {loading ? (
        <div className="flex items-center gap-2 text-foreground/50 text-sm py-16">
          <Loader2 className="h-4 w-4 animate-spin text-brand-gold" /> Loading…
        </div>
      ) : (
        <div className="mt-8 -mx-6 px-6 flex gap-5 overflow-x-auto snap-x snap-mandatory sm:mx-0 sm:px-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <RelatedCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {category && catName && (
        <div className="mt-8">
          <Link
            to="/shop"
            search={{ category: category.slug }}
            className="text-sm text-brand-gold hover:underline"
          >
            More {catName} →
          </Link>
        </div>
      )}
    </section>
  );
}

function RelatedCard({ product }: { product: WooProduct }) {
  const { addItem, openCart } = useCart();
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);

  const price = productPrice(product);
  const cat = decodeEntities(product.categories?.[0]?.name ?? "Research")
    .replace(/\s*&.*$/, "")
    .trim();
  const strength = strengthOf(product);
  const vial = variantVialImage({
    name: product.name,
    slug: product.slug,
    fallbackSrc: firstImage(product),
  });

  const onAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      if (product.type === "variable" && (product.variations?.length ?? 0) > 0) {
        const vars = await fetchVariations(product.id);
        const cheapest = [...vars].sort(
          (a, b) => Number(a.prices.price) - Number(b.prices.price),
        )[0];
        if (cheapest) {
          await addItem({
            id: cheapest.id,
            quantity: 1,
            variation: (cheapest.attributes ?? []).map((a) => ({
              attribute: a.name,
              value: a.value ?? a.option ?? "",
            })),
          });
        }
      } else {
        await addItem({ id: product.id, quantity: 1 });
      }
      setAdded(true);
      openCart();
      window.setTimeout(() => setAdded(false), 1500);
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  };

  return (
    <Link
      to="/shop/$slug"
      params={{ slug: product.slug }}
      className="group/card snap-start shrink-0 w-[78%] sm:w-auto flex flex-col rounded-3xl overflow-hidden bg-brand-forest-deep border border-white/5 hover:border-brand-gold/40 transition-all duration-500 hover:-translate-y-1 shadow-xl"
    >
      <div className="relative bg-[#0a0a0a] flex items-center justify-center p-6 h-56">
        <span className="absolute top-4 left-4 z-10 text-[10px] uppercase tracking-wider font-bold bg-brand-gold/90 text-brand-forest px-2.5 py-1 rounded-full">
          ≥99% Purity
        </span>
        <img
          src={vial}
          alt={`${product.name} vial`}
          loading="lazy"
          draggable={false}
          className="h-full w-auto max-w-full object-contain select-none drop-shadow-2xl transition-transform duration-700 group-hover/card:scale-105"
        />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-brand-gold">{cat}</p>
        <h3 className="mt-2 font-display text-lg text-foreground leading-tight">
          {baseName(product)}
          {strength ? ` – ${strength}` : ""}
        </h3>

        <div className="mt-auto pt-5 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-foreground/90">
            {price.min !== price.max ? "From " : ""}${price.min.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={onAdd}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-forest border border-white/10 px-4 py-2 text-xs font-medium text-foreground hover:bg-brand-gold hover:text-brand-forest hover:border-brand-gold transition-colors disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : added ? (
              <Check className="h-3.5 w-3.5" />
            ) : null}
            {added ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}
