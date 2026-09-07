import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(p, "utf8");

describe("promotional purity copy", () => {
  it("homepage stats band promotes 99%+ reported purity, not 98%", () => {
    const src = read("src/routes/index.tsx");
    expect(src).toContain('["99%+", "Reported Purity"]');
    expect(src).not.toContain('["≥98%"');
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
    expect(read("src/routes/index.tsx")).toContain("spec NLT 98%");
  });
});
