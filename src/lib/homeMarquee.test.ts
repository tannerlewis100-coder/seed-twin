import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { MARQUEE_MESSAGES } from "./homeMarquee";

const home = readFileSync("src/routes/index.tsx", "utf8");
const marquee = readFileSync("src/components/HomeMarquee.tsx", "utf8");

describe("homepage section removals", () => {
  it("removes the COA library teaser section", () => {
    expect(home).not.toContain("CoaTeaser");
    expect(home).not.toContain("Every batch.\\nPublic record.");
  });

  it("removes the closing Read the COA CTA", () => {
    expect(home).not.toContain("FinalCta");
    expect(home).not.toContain("Read the COA");
  });

  it("removes the old three-part stats band", () => {
    expect(home).not.toContain("<StatsBand />");
  });

  it("keeps How it's tested, Scan the Vial and Receipts, not claims", () => {
    expect(home).toContain("<HowTested />");
    expect(home).toContain("<ScanTheVial />");
    expect(home).toContain("<QualityCollage />");
    expect(home).toContain("Receipts,\\nnot claims.");
  });

  it("keeps all four original vial photos", () => {
    for (const img of [
      "/quality-semax-v2.png",
      "/quality-ss37-v2.png",
      "/quality-glp1s-v2.png",
      "/quality-trio-v2.png",
    ]) {
      expect(home).toContain(img);
    }
  });
});

describe("homepage marquee", () => {
  it("has the exact three messages", () => {
    expect([...MARQUEE_MESSAGES]).toEqual([
      "Free shipping over $150",
      "Public COA Library",
      "Research Use Only",
    ]);
  });

  it("renders directly below the hero", () => {
    expect(home.indexOf("<Hero />")).toBeLessThan(home.indexOf("<HomeMarquee />"));
    expect(home.indexOf("<HomeMarquee />")).toBeLessThan(
      home.indexOf("<FeaturedProducts />"),
    );
  });

  it("respects reduced motion and offers a pause control", () => {
    expect(marquee).toContain("prefers-reduced-motion: reduce");
    expect(marquee).toContain("Pause highlights ticker");
    expect(marquee).toContain('aria-hidden={hidden ? "true" : undefined}');
  });
});
