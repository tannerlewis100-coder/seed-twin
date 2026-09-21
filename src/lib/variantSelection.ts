import type { WooProduct } from "@/lib/woo";

/**
 * Shared variant ordering / availability rules used by the product page, the
 * quick-view modal and the related-product quick add. Stock flags come from the
 * backend untouched: we only read them, never derive or override them.
 */

const UNIT_FACTOR: Record<string, number> = {
  g: 1000,
  mg: 1,
  mcg: 0.001,
  "µg": 0.001,
  ug: 0.001,
};

/**
 * Numeric strength for sorting. Blend labels ("5mg/5mg") sum, µg/g normalise to
 * mg so "500mcg" sorts below "1mg". Units we can't compare (ml, iu) keep their
 * raw number and are only compared with their own kind.
 */
export function strengthValue(label?: string | null): number | null {
  if (!label) return null;
  const nums = label.match(/\d+(?:\.\d+)?/g);
  if (!nums) return null;
  const unit = (label.match(/(mcg|µg|ug|mg|iu|ml|g)\b/i)?.[1] ?? "").toLowerCase();
  const sum = nums.reduce((a, b) => a + parseFloat(b), 0);
  return sum * (UNIT_FACTOR[unit] ?? 1);
}

/** Backend truth: a variant is purchasable only when Woo says both flags hold. */
export function isVariantAvailable(v: Pick<WooProduct, "is_in_stock" | "is_purchasable">): boolean {
  return v.is_in_stock !== false && v.is_purchasable !== false;
}

function priceOf(v: WooProduct): number {
  return Number(v.prices?.price ?? 0);
}

/**
 * Natural ascending strength order (5mg, 10mg, 20mg). Variants whose strength
 * can't be parsed keep their relative price order and sort last. IDs, SKUs and
 * prices stay attached to their own variant — only display order changes.
 */
export function sortVariantsByStrength(
  variants: WooProduct[],
  labelFor: (v: WooProduct) => string | null | undefined,
): WooProduct[] {
  return [...variants].sort((a, b) => {
    const sa = strengthValue(labelFor(a));
    const sb = strengthValue(labelFor(b));
    if (sa != null && sb != null && sa !== sb) return sa - sb;
    if (sa != null && sb == null) return -1;
    if (sa == null && sb != null) return 1;
    return priceOf(a) - priceOf(b);
  });
}

/**
 * Initial selection: the cheapest variant the backend says can actually be
 * bought. When nothing is available we return null so the page shows the
 * unavailable state instead of pre-selecting a dead option.
 */
export function pickInitialVariantId(variants: WooProduct[]): number | null {
  const available = variants.filter(isVariantAvailable);
  if (available.length === 0) return null;
  return available.reduce((best, v) => (priceOf(v) < priceOf(best) ? v : best)).id;
}

/** Lowest price among purchasable variants, or null when none can be bought. */
export function lowestAvailablePrice(variants: WooProduct[]): number | null {
  const prices = variants.filter(isVariantAvailable).map(priceOf).filter((n) => n > 0);
  if (prices.length === 0) return null;
  return Math.min(...prices);
}

/** Cheapest purchasable variant, used by quick add so it never adds a dead size. */
export function cheapestAvailableVariant(variants: WooProduct[]): WooProduct | null {
  const id = pickInitialVariantId(variants);
  return variants.find((v) => v.id === id) ?? null;
}
