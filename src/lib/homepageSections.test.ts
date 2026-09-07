import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const src = () => readFileSync("src/routes/index.tsx", "utf8");

describe("homepage structure after simplification", () => {
  it("removes the stats/trust band, how it's tested, quality collage and final CTA", () => {
    const s = src();
    for (const gone of [
      "function StatsBand",
      "trustFacts",
      "function HowTested",
      "testingPanels",
      "function FinalCta",
      "function CoaTeaser",
      "function ScanTheVial",
    ]) {
      expect(s).not.toContain(gone);
    }
  });

  it("renders hero, featured products, one combined report section, then footer", () => {
    const s = src();
    const order = ["<Hero />", "<FeaturedProducts />", "<QualityCollage />", "<BatchReports />", "<SiteFooter />"];
    let last = -1;
    for (const token of order) {
      const at = s.indexOf(token);
      expect(at, token).toBeGreaterThan(last);
      last = at;
    }
  });

  it("combined section has one heading, one sentence and one COA library link", () => {
    const s = src();
    expect(s).toContain("Your batch.\\nYour report.");
    expect(s).toContain("Browse available certificates by product or batch.");
    expect(s).toContain("Open COA Library");
  });

  it("keeps the BPC-157 10mg sample report card and live featured pricing", () => {
    const s = src();
    expect(s).toContain("bpc-157-10mg");
    expect(s).toContain("CoaCard");
    expect(s).toContain("featuredPriceFor");
    expect(s).toContain("formatFeaturedPrice");
  });

  it("restores the quality vial photo section with all four original photos", () => {
    const s = src();
    for (const img of [
      "/quality-ss37-v2.png",
      "/quality-semax-v2.png",
      "/quality-glp1s-v2.png",
      "/quality-trio-v2.png",
    ]) {
      expect(s).toContain(img);
    }
    expect(s).toContain("Receipts,\\nnot claims.");
    expect(s).toContain("Explore available batch reports in our public COA library.");
    expect(s).toContain("View COA Library");
  });
});
