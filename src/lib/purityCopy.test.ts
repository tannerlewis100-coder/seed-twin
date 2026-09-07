import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(p, "utf8");

describe("promotional purity copy", () => {
  it("homepage stats band promotes 99%+ reported purity, not 98%", () => {
    const src = read("src/routes/index.tsx");
    expect(src).toContain('stat: "99%+"');
    expect(src).toContain('label: "Reported Purity"');
    expect(src).not.toContain('["≥98%"');
  });

  it("homepage banner drops catalog counts and 100% COA coverage claims", () => {
    const src = read("src/routes/index.tsx");
    expect(src).not.toContain('"70+"');
    expect(src).not.toContain("COA Documented");
    expect(src).not.toContain("Tests Per Batch");
    expect(src).toContain("/coa-library");
    expect(src).toContain("View current products, sizes and availability.");
    expect(src).toContain("View available COAs and report status.");
  });

  it("about page stats do not claim 100% of batches tested", () => {
    const src = read("src/routes/about.tsx");
    expect(src).not.toContain("Batches tested");
    expect(src).not.toContain("Panels per batch");
  });


  it("homepage carries the qualification next to the promotional claim", () => {
    const src = read("src/routes/index.tsx");
    expect(src).toContain(
      "Across current COAs with published purity results. See individual batch reports; some reports are pending or unavailable.",
    );
  });

  it("does not claim every batch is verified at 99%", () => {
    for (const f of ["src/routes/index.tsx", "src/routes/about.tsx", "src/components/SiteHeader.tsx"]) {
      const src = read(f).toLowerCase();
      expect(src).not.toMatch(/every (batch|product)[^.]{0,40}99%/);
    }
  });

  it("preserves original lab spec thresholds of NLT 98%", () => {
    expect(read("src/routes/about.tsx")).toContain("NLT 98%");
    expect(read("src/components/SiteHeader.tsx")).toContain("NLT 98% per batch.");
    // Homepage educational prose is not a COA record: it must not quote a 98% spec
    expect(read("src/routes/index.tsx")).not.toContain("spec NLT 98%");
    expect(read("src/routes/index.tsx")).toContain(
      "Published purity results are 99% or higher where reported. Testing methods and specifications vary; check the individual batch report.",
    );

  });
});
