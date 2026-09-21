import { describe, expect, it } from "vitest";
import {
  cheapestAvailableVariant,
  isVariantAvailable,
  lowestAvailablePrice,
  pickInitialVariantId,
  sortVariantsByStrength,
  strengthValue,
} from "@/lib/variantSelection";
import type { WooProduct } from "@/lib/woo";

function v(
  id: number,
  price: string,
  label: string,
  opts: { in_stock?: boolean; purchasable?: boolean } = {},
): WooProduct & { __label: string } {
  return {
    id,
    prices: { price, currency_minor_unit: 2 },
    is_in_stock: opts.in_stock ?? true,
    is_purchasable: opts.purchasable ?? true,
    __label: label,
  } as unknown as WooProduct & { __label: string };
}

const labelFor = (p: WooProduct) => (p as WooProduct & { __label: string }).__label;

describe("strengthValue", () => {
  it("parses simple strengths and sums blends", () => {
    expect(strengthValue("5mg")).toBe(5);
    expect(strengthValue("20mg")).toBe(20);
    expect(strengthValue("5mg/5mg")).toBe(10);
    expect(strengthValue("0.1mg")).toBeCloseTo(0.1);
  });

  it("normalises sub-milligram units", () => {
    expect(strengthValue("500mcg")).toBeCloseTo(0.5);
    expect(strengthValue("1g")).toBe(1000);
  });

  it("returns null when there is no number", () => {
    expect(strengthValue("Variant")).toBeNull();
    expect(strengthValue(null)).toBeNull();
  });
});

describe("sortVariantsByStrength", () => {
  it("orders BPC-157 5 / 20 / 10 naturally ascending", () => {
    const list = [v(1, "6000", "5mg"), v(2, "16000", "20mg"), v(3, "9000", "10mg")];
    expect(sortVariantsByStrength(list, labelFor).map((x) => labelFor(x))).toEqual([
      "5mg",
      "10mg",
      "20mg",
    ]);
  });

  it("keeps each id, sku and price attached to its own variant", () => {
    const list = [v(1, "6000", "5mg"), v(3, "9000", "10mg"), v(2, "16000", "20mg")];
    const sorted = sortVariantsByStrength(list, labelFor);
    expect(sorted.map((x) => [x.id, x.prices.price])).toEqual([
      [1, "6000"],
      [3, "9000"],
      [2, "16000"],
    ]);
  });

  it("sorts unparseable labels last by price", () => {
    const list = [v(1, "9000", "Variant"), v(2, "16000", "20mg"), v(3, "3000", "Other")];
    expect(sortVariantsByStrength(list, labelFor).map((x) => x.id)).toEqual([2, 3, 1]);
  });
});

describe("initial selection", () => {
  it("picks the cheapest in-stock option, not the cheapest overall", () => {
    // Glutathione: 600mg is out of stock, 1500mg is in stock.
    const list = [
      v(283, "6000", "600mg", { in_stock: false }),
      v(259, "11000", "1500mg"),
    ];
    expect(pickInitialVariantId(list)).toBe(259);
    expect(lowestAvailablePrice(list)).toBe(11000);
  });

  it("returns null when zero variants are available", () => {
    const list = [v(1, "6000", "5mg", { in_stock: false }), v(2, "9000", "10mg", { purchasable: false })];
    expect(pickInitialVariantId(list)).toBeNull();
    expect(lowestAvailablePrice(list)).toBeNull();
    expect(cheapestAvailableVariant(list)).toBeNull();
  });

  it("handles a single available variant", () => {
    const list = [v(7, "4200", "10mg")];
    expect(pickInitialVariantId(list)).toBe(7);
    expect(cheapestAvailableVariant(list)?.id).toBe(7);
  });

  it("quick add never returns an unavailable variant", () => {
    const list = [
      v(1, "3000", "5mg", { in_stock: false }),
      v(2, "5000", "10mg"),
      v(3, "9000", "20mg"),
    ];
    const pick = cheapestAvailableVariant(list);
    expect(pick?.id).toBe(2);
    expect(isVariantAvailable(pick!)).toBe(true);
  });
});
