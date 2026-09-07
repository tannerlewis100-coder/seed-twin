import { describe, it, expect } from "vitest";
import {
  buildSpecRows,
  buildInfoSections,
  initialSectionState,
  COA_INITIALLY_OPEN,
} from "./productInfo";

describe("product detail collapsible sections", () => {
  it("keeps the COA panel collapsed on initial load", () => {
    expect(COA_INITIALLY_OPEN).toBe(false);
  });

  it("starts all three info rows collapsed", () => {
    const state = initialSectionState();
    expect(Object.values(state).every((v) => v === false)).toBe(true);
    expect(Object.keys(state)).toHaveLength(3);
  });

  it("always builds description, specifications and shipping rows", () => {
    const sections = buildInfoSections({
      description: "A research peptide.",
      specs: [],
    });
    expect(sections.map((s) => s.id)).toEqual([
      "description",
      "specifications",
      "shipping",
    ]);
  });

  it("omits absent specification fields and never invents data", () => {
    const rows = buildSpecRows({
      sku: "YPB.211",
      size: "10mg",
      attributes: [
        { name: "Size", value: "10mg" },
        { name: "Form", value: "" },
      ],
      coaBatch: null,
    });
    const labels = rows.map((r) => r.label);
    expect(labels).toContain("SKU");
    expect(labels).toContain("Strength");
    expect(labels).not.toContain("Form");
    expect(labels).not.toContain("Purity");
    expect(labels).not.toContain("Storage");
    expect(labels).not.toContain("Shipping weight");
  });

  it("includes report batch only when a matched certificate exists", () => {
    const without = buildSpecRows({ sku: "X", size: null, attributes: [], coaBatch: null });
    expect(without.map((r) => r.label)).not.toContain("Report batch");
    const withBatch = buildSpecRows({ sku: "X", size: null, attributes: [], coaBatch: "B-42" });
    expect(withBatch.find((r) => r.label === "Report batch")?.value).toBe("B-42");
  });

  it("does not duplicate the Size attribute when strength is already shown", () => {
    const rows = buildSpecRows({
      sku: "X",
      size: "5mg",
      attributes: [{ name: "Size", value: "5mg" }],
      coaBatch: null,
    });
    expect(rows.filter((r) => r.value === "5mg")).toHaveLength(1);
  });
});
