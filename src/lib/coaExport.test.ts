import { describe, expect, it } from "vitest";
import { buildCoaExport } from "./coaExport";

const data = buildCoaExport(new Date("2026-10-13T00:00:00Z"));
const bySku = (sku: string) => data.coas.find((c) => c.sku === sku)!;

describe("COA export", () => {
  it("includes every key on every record", () => {
    const keys = [
      "batch_number", "sku", "peptide_name", "peptide_aliases", "size_mg", "test_date",
      "purity_percent", "assay_mg", "heavy_metals_ppb", "pass", "lab_name",
      "report_image_urls", "verification_page_url",
    ];
    for (const c of data.coas) expect(Object.keys(c).sort()).toEqual([...keys].sort());
  });

  it("uses absolute clarumpeptides.com image URLs", () => {
    expect(bySku("YPB.211").report_image_urls[0]).toBe("https://clarumpeptides.com/coa/2026/ypb-211-p1.jpg");
    for (const c of data.coas)
      for (const u of c.report_image_urls) expect(u.startsWith("https://")).toBe(true);
  });

  it("maps BPC-157 10mg batch exactly", () => {
    const c = bySku("YPB.213");
    expect(c.peptide_name).toBe("BPC-157");
    expect(c.size_mg).toBe(10);
    expect(c.purity_percent).toBe(99.85);
    expect(c.batch_number).toBe("20260105L04BPCS10");
  });
});
