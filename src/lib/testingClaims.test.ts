import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(p, "utf8");

const MARKETING_FILES = [
  "src/routes/index.tsx",
  "src/routes/about.tsx",
  "src/routes/faq.tsx",
  "src/routes/shop.index.tsx",
  "src/routes/shop.$slug.tsx",
  "src/components/SiteHeader.tsx",
  "src/routes/__root.tsx",
];

describe("testing claims align with published COAs", () => {
  it("drops blanket full-panel / same-panel marketing claims", () => {
    for (const f of MARKETING_FILES) {
      const src = read(f);
      expect(src).not.toContain("Full analytical panel on every single batch we ship");
      expect(src).not.toContain("Independent third-party lab. Same panel on every run.");
      expect(src).not.toMatch(/full (analytical )?panel/i);
      expect(src).not.toMatch(/same panel/i);
    }
  });

  it("drops blanket every-batch-tested promises from marketing copy", () => {
    for (const f of MARKETING_FILES) {
      const src = read(f);
      expect(src).not.toMatch(/[Ee]very batch (is |goes |ships |verified|tested|independently)/);
      expect(src).not.toMatch(/on every batch/i);
      expect(src).not.toMatch(/Every batch verified/i);
    }
  });

  it("does not promise confirmed labeled amount or blanket 98% specs in marketing", () => {
    for (const f of MARKETING_FILES) {
      const src = read(f);
      expect(src).not.toMatch(/contains the labeled amount/i);
      expect(src).not.toMatch(/NLT 98%/);
      expect(src).not.toMatch(/NLT 95% of label claim/);
      expect(src).not.toMatch(/NMT 150 ppb/);
      expect(src).not.toMatch(/99%\+/);
    }
  });

  it("uses the approved method-neutral replacements on the homepage", () => {
    const src = read("src/routes/index.tsx");
    expect(src).toContain("Batch-specific results. Publicly available.");
    expect(src).toContain("Independent lab reports. Panels vary by batch.");
    expect(src).toContain("Independent testing. Public batch reports.");
    expect(src).toContain("See each COA for methods and results.");
    expect(src).toContain("Panels vary by batch.");
    expect(src).toContain("Identifies the compound in the submitted sample.");
    expect(src).toContain("Reports purity using the method listed on the COA.");
    expect(src).toContain("Reports measured quantity where available.");
    expect(src).toContain("Results shown where included in the report.");
    expect(src).toContain("Method and results listed on each applicable COA.");
  });

  it("keeps all five educational testing cards and the four vial photos", () => {
    const src = read("src/routes/index.tsx");
    for (const t of ["Identity", "Purity", "Content", "Heavy Metals", "Microbial Screening"]) {
      expect(src).toContain(t);
    }
    for (const img of ["qualitySs37", "qualityTb500", "qualityTrio"]) {
      expect(src).toContain(img);
    }
  });

  it("does not equate PCR screening with culture counts or sterility", () => {
    for (const f of MARKETING_FILES) {
      const src = read(f);
      expect(src).not.toMatch(/sterile|sterility/i);
      expect(src).not.toMatch(/TAMC/);
      expect(src).not.toMatch(/TYMC/);
    }
  });

  it("preserves original COA report data and specifications", () => {
    const coa = read("src/data/coaLibrary.ts");
    expect(coa).toContain("99.85");
    expect(coa).toContain("YPB.213");
    const results = read("src/components/CoaResults.tsx");
    expect(results).toContain("Report available");
  });
});
