import { productPrice, type WooProduct } from "@/lib/woo";

/**
 * Featured (static) slugs carry a size suffix (e.g. "nad-500mg") while the
 * WooCommerce parent product uses the base slug ("nad"). This is the same
 * mapping the homepage cards already use for their destination links.
 */
export function wooSlugForFeatured(slug: string): string {
  return slug.replace(/-\d+(?:\.\d+)?(?:mg|mcg|µg|ml|iu|g)$/i, "");
}

export type FeaturedPrice = {
  min: number;
  max: number;
  isRange: boolean;
  symbol: string;
};

/** Resolve live pricing for a featured slug. Returns null when unmatched. */
export function featuredPriceFor(
  products: WooProduct[] | null | undefined,
  slug: string,
): FeaturedPrice | null {
  if (!products || products.length === 0) return null;
  const target = wooSlugForFeatured(slug);
  const match =
    products.find((p) => p.slug === target) ??
    products.find((p) => p.slug === slug) ??
    null;
  if (!match) return null;
  const { min, max } = productPrice(match);
  if (!Number.isFinite(min) || min <= 0) return null;
  return {
    min,
    max,
    isRange: max > min,
    symbol: match.prices?.currency_symbol || "$",
  };
}

export function formatFeaturedPrice(price: FeaturedPrice): string {
  return `${price.symbol}${price.min.toFixed(2)}`;
}
