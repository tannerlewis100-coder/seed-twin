import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import type { WooProduct } from "@/lib/woo";
import {
  __resetStartingPriceCache,
  formatStartingPrice,
  loadStartingPrice,
  peekStartingPrice,
  startingPriceForSimple,
  startingPriceFromVariants,
} from "@/lib/variationPricing";

vi.mock("@/lib/woo", async () => {
  const actual = await vi.importActual<typeof import("@/lib/woo")>("@/lib/woo");
  return { ...actual, fetchVariations: vi.fn() };
});
const { fetchVariations } = await import("@/lib/woo");
const mockFetch = fetchVariations as unknown as ReturnType<typeof vi.fn>;

function v(
  id: number,
  price: string,
  opts: { in_stock?: boolean; purchasable?: boolean } = {},
): WooProduct {
  return {
    id,
    prices: { price, currency_minor_unit: 2, currency_symbol: "$" },
    is_in_stock: opts.in_stock ?? true,
    is_purchasable: opts.purchasable ?? true,
  } as unknown as WooProduct;
}

beforeEach(() => {
  __resetStartingPriceCache();
  mockFetch.mockReset();
});
afterEach(() => __resetStartingPriceCache());

describe("advertised starting price never uses a sold-out size", () => {
  it("mixed stock: skips the cheaper sold-out size", () => {
    const p = startingPriceFromVariants([
      v(1, "4999", { in_stock: false }),
      v(2, "13999"),
    ]);
    expect(p).toMatchObject({ state: "ready", min: 139.99, isRange: false });
    expect(formatStartingPrice(p)).toBe("$139.99");
  });

  it("multiple available sizes advertise the cheapest with a range prefix", () => {
    const p = startingPriceFromVariants([v(1, "4999"), v(2, "13999")]);
    expect(formatStartingPrice(p)).toBe("From $49.99");
  });

  it("all out of stock reads Unavailable", () => {
    const p = startingPriceFromVariants([
      v(1, "4999", { in_stock: false }),
      v(2, "13999", { purchasable: false }),
    ]);
    expect(p.state).toBe("unavailable");
    expect(formatStartingPrice(p)).toBe("Unavailable");
  });

  it("pending/unresolved state shows a neutral label, never a price", () => {
    expect(formatStartingPrice({ state: "unknown" })).toBe("Select size");
  });

  it("a failed variation fetch stays unknown and is not cached", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network"));
    const p = await loadStartingPrice(77);
    expect(p).toEqual({ state: "unknown" });
    expect(formatStartingPrice(p)).toBe("Select size");
    expect(peekStartingPrice(77)).toBeNull();
  });

  it("deduplicates concurrent requests for the same parent and caches the result", async () => {
    mockFetch.mockResolvedValue([v(1, "4999", { in_stock: false }), v(2, "13999")]);
    const [a, b] = await Promise.all([loadStartingPrice(9), loadStartingPrice(9)]);
    expect(a).toEqual(b);
    await loadStartingPrice(9);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(peekStartingPrice(9)).toMatchObject({ min: 139.99 });
  });

  it("simple products use their own price and respect their stock flag", () => {
    expect(startingPriceForSimple(v(1, "8999"))).toMatchObject({ min: 89.99 });
    expect(startingPriceForSimple(v(1, "8999", { in_stock: false })).state).toBe("unavailable");
  });
});
