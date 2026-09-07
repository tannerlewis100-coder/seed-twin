import { describe, expect, it } from "vitest";
import {
  featuredPriceFor,
  formatFeaturedPrice,
  wooSlugForFeatured,
} from "@/lib/featuredPricing";
import type { WooProduct } from "@/lib/woo";

function makeProduct(
  slug: string,
  minMinor: string,
  maxMinor?: string,
): WooProduct {
  return {
    slug,
    prices: {
      price: minMinor,
      currency_minor_unit: 2,
      currency_code: "USD",
      currency_symbol: "$",
      ...(maxMinor
        ? { price_range: { min_amount: minMinor, max_amount: maxMinor } }
        : {}),
    },
  } as unknown as WooProduct;
}

// Live Shop catalog values (WooCommerce Store API).
const catalog = [
  makeProduct("glp-3-rt", "15999", "42999"),
  makeProduct("nad", "18999", "22999"),
  makeProduct("mots-c", "10999", "16999"),
  makeProduct("bpc-157", "5999", "7999"),
];

describe("featured pricing shares the Shop WooCommerce source", () => {
  it("maps featured slugs to the WooCommerce parent slug", () => {
    expect(wooSlugForFeatured("glp-3-rt-10mg")).toBe("glp-3-rt");
    expect(wooSlugForFeatured("nad-500mg")).toBe("nad");
    expect(wooSlugForFeatured("mots-c-10mg")).toBe("mots-c");
    expect(wooSlugForFeatured("bpc-157-5mg")).toBe("bpc-157");
  });

  it.each([
    ["glp-3-rt-10mg", "$159.99"],
    ["nad-500mg", "$189.99"],
    ["mots-c-10mg", "$109.99"],
    ["bpc-157-5mg", "$59.99"],
  ])("%s shows the current catalog minimum", (slug: string, expected: string) => {
    const price = featuredPriceFor(catalog, slug);
    expect(price).not.toBeNull();
    expect(formatFeaturedPrice(price!)).toBe(expected);
  });

  it("flags variable products as ranges", () => {
    expect(featuredPriceFor(catalog, "nad-500mg")!.isRange).toBe(true);
  });
});

describe("unavailable pricing data", () => {
  it("returns null while data is loading", () => {
    expect(featuredPriceFor(null, "nad-500mg")).toBeNull();
    expect(featuredPriceFor([], "nad-500mg")).toBeNull();
  });

  it("returns null when the product cannot be matched", () => {
    expect(featuredPriceFor(catalog, "does-not-exist-10mg")).toBeNull();
  });

  it("never invents a zero price", () => {
    const broken = [makeProduct("nad", "0")];
    expect(featuredPriceFor(broken, "nad-500mg")).toBeNull();
  });
});
