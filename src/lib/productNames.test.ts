import { describe, expect, it } from "vitest";
import { displayProductName } from "@/lib/productNames";
import { buildSpecRows, descriptionOverrideFor, B12_DESCRIPTION } from "@/lib/productInfo";

describe("display product names", () => {
  it("shows the blend as Wolverine Blend everywhere", () => {
    expect(displayProductName("BPC-157 / TB-500 Blend", "bpc-157-tb-500-blend")).toBe(
      "Wolverine Blend — BPC-157 / TB-500",
    );
    expect(displayProductName("Wolverine Blend")).toContain("Wolverine Blend");
  });

  it("leaves other products, including KLOW and GLOW, untouched", () => {
    expect(displayProductName("BPC-157", "bpc-157")).toBe("BPC-157");
    expect(displayProductName("KLOW Blend", "klow-blend")).toBe("KLOW Blend");
    expect(displayProductName("GLOW Blend", "glow-blend")).toBe("GLOW Blend");
    expect(displayProductName("")).toBe("");
  });
});

describe("B12 verified specs", () => {
  it("publishes volume and form from the supplier catalogue and report", () => {
    const rows = buildSpecRows({
      sku: "YPB.251",
      size: "1ml",
      attributes: [{ name: "Size", value: "1ml" }],
      coaBatch: "YPB.251",
    });
    const labels = rows.map((r) => r.label);
    expect(labels).toContain("Volume");
    expect(rows.find((r) => r.label === "Volume")?.value).toBe("10 mL");
    expect(rows.find((r) => r.label === "Form")?.value).toBe("Liquid solution");
    expect(rows.some((r) => /1ml/i.test(r.value))).toBe(false);
  });

  it("uses the approved B12 description and no powder wording", () => {
    const d = descriptionOverrideFor("YPB.251");
    expect(d).toBe(B12_DESCRIPTION);
    expect(d).not.toMatch(/powder|lyophilized|reconstitution/i);
    expect(descriptionOverrideFor("YPB.237")).toBeNull();
  });

  it("still suppresses disputed 4X and 8X attributes", () => {
    const rows = buildSpecRows({ sku: "YPB.268", size: "120mg", coaBatch: "YPB.268" });
    expect(rows.some((r) => /120mg/i.test(r.value))).toBe(false);
  });
});
