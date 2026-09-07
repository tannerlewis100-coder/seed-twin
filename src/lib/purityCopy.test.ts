import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(p, "utf8");

describe("promotional purity copy", () => {
  it("homepage makes no unqualified 98% or 99% purity promise", () => {
    const src = read("src/routes/index.tsx");
    expect(src).not.toContain('["≥98%"');
    expect(src).not.toContain('stat: "99%+"');
  });

  it("homepage banner drops catalog counts and 100% COA coverage claims", () => {
    const src = read("src/routes/index.tsx");
    expect(src).not.toContain('"70+"');
    expect(src).not.toContain("COA Documented");
    expect(src).not.toContain("Tests Per Batch");
  });

  it("about page stats do not claim 100% of batches tested", () => {
    const src = read("src/routes/about.tsx");
    expect(src).not.toContain("Batches tested");
    expect(src).not.toContain("Panels per batch");
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
    expect(read("src/routes/index.tsx")).toContain("spec NLT 98%");
  });
});
