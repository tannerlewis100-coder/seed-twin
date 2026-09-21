import { describe, expect, it } from "vitest";
import {
  coaForProductSku,
  normalizeSku,
  resolveCoaForProduct,
  skuForSlugSize,
} from "@/data/coaLibrary";
import { cartLineImage, productImageForSku, variantVialImage, DEFAULT_VIAL } from "@/lib/vialImages";

describe("COA resolution by exact supplier SKU", () => {
  it("resolves the BPC-157/TB-500 blend 10mg/10mg to YPB.217, never YPB.216", () => {
    const r = resolveCoaForProduct({
      sku: "YPB.217",
      slug: "bpc-157-tb-500-blend",
      size: "10mg-10mg",
    });
    expect(r.sku).toBe("YPB.217");
    expect(r.status.state).toBe("published");
    if (r.status.state === "published") {
      expect(r.status.record.sku).toBe("YPB.217");
      expect(r.status.record.sku).not.toBe("YPB.216");
    }
  });

  it("resolves the 5mg/5mg blend variant to YPB.216", () => {
    const r = resolveCoaForProduct({ sku: "ypb 217", slug: "bpc-157-tb-500-blend" });
    expect(r.sku).toBe("YPB.217");
    const five = resolveCoaForProduct({ sku: "YPB.216", slug: "bpc-157-tb-500-blend" });
    expect(five.sku).toBe("YPB.216");
  });

  it("marks BPC-157 5mg (YPB.212) pending and 10mg (YPB.213) published", () => {
    expect(coaForProductSku("YPB.212").state).toBe("pending");
    const ten = coaForProductSku("YPB.213");
    expect(ten.state).toBe("published");
    if (ten.state === "published") expect(ten.record.sku).toBe("YPB.213");
  });

  it("never falls back to a different size when the SKU is unknown", () => {
    expect(resolveCoaForProduct({ sku: "YPB.999", slug: "bpc-157-tb-500-blend" }).status.state).toBe(
      "unavailable",
    );
    expect(resolveCoaForProduct({ sku: "YPB.209", slug: "glp-3-rt", size: "10mg" }).status.state).toBe(
      "unavailable",
    );
    expect(resolveCoaForProduct({ sku: "YPB.201", slug: "glp-1-s", size: "20mg" }).status.state).toBe(
      "unavailable",
    );
  });

  it("slug+strength aliases agree with the exact SKU", () => {
    const cases: Array<[string, string | undefined, string]> = [
      ["reconstitution-water", "10ml", "YPB.226"],
      ["reconstitution-water", "3ml", "YPB.225"],
      ["4x-blend-mic", "120mg", "YPB.268"],
      ["8x-blend-lipotropic", "196mg", "YPB.267"],
      ["klow-blend-ghk-cu-kpv-bpc-157-tb-500", undefined, "YPB.264"],
      ["glow-blend-ghk-cu-bpc-157-tb-500", undefined, "YPB.218"],
      ["2x-blend-cjc-ipamorelin", undefined, "YPB.238"],
      ["5-amino-1mq", "50mg", "YPB.247"],
      ["kpv-lysine-proline-valine", undefined, "YPB.265"],
      ["thymosin-alpha-1", undefined, "YPB.231"],
      ["melanotan-2", undefined, "YPB.270"],
      ["n-acetyl-epitalon-amidate", undefined, "YPB.232"],
      ["hexarelin-acetate", undefined, "YPB.261"],
      ["cjc-1295-without-dac", undefined, "YPB.219"],
      ["bpc-157-tb-500-blend", "10mg-10mg", "YPB.217"],
    ];
    for (const [slug, size, sku] of cases) {
      expect(skuForSlugSize(slug, size), `${slug} ${size ?? ""}`).toBe(sku);
      const r = resolveCoaForProduct({ slug, size });
      expect(r.sku, `${slug} ${size ?? ""}`).toBe(sku);
      expect(r.status.state).not.toBe("unavailable");
    }
  });

  it("normalizes SKU formatting", () => {
    expect(normalizeSku(" ypb.217 ")).toBe("YPB.217");
    expect(normalizeSku("ypb217")).toBe("YPB.217");
    expect(normalizeSku("")).toBeNull();
  });
});

describe("strength-specific vial imagery", () => {
  it("maps BPC-157 strengths to their own labelled photos", () => {
    const five = productImageForSku("YPB.212");
    const ten = productImageForSku("YPB.213");
    const twenty = productImageForSku("YPB.237");
    expect(five).toBeTruthy();
    expect(new Set([five, ten, twenty]).size).toBe(3);
    expect(twenty).toContain("bpc157-20mg");
  });

  it("maps IGF-1 LR3 0.1mg and 1mg to distinct photos", () => {
    expect(productImageForSku("YPB.285")).toContain("igf1lr3-0-1mg");
    expect(productImageForSku("YPB.262")).toContain("igf1lr3-1mg");
  });

  it("keeps blends off the plain BPC-157 photo", () => {
    for (const sku of ["YPB.216", "YPB.217", "YPB.264", "YPB.218"]) {
      expect(productImageForSku(sku)).not.toContain("bpc157-5mg");
      expect(productImageForSku(sku)).not.toContain("bpc157-20mg.png");
    }
    expect(productImageForSku("YPB.216")).toContain("bpc157-tb500-5mg");
    expect(productImageForSku("YPB.264")).toContain("klow-blend");
    expect(productImageForSku("YPB.218")).toContain("glow-blend");
  });

  it("does not confuse CJC with DAC and without DAC", () => {
    expect(productImageForSku("YPB.220")).toContain("cjc-with-dac");
    expect(productImageForSku("YPB.219")).toContain("cjc-no-dac");
  });

  it("falls back safely when no SKU asset exists", () => {
    expect(variantVialImage({ sku: "YPB.999", fallbackSrc: "https://cdn/x.png" })).toBe(
      "https://cdn/x.png",
    );
    expect(variantVialImage({ sku: "YPB.999" })).toBe(DEFAULT_VIAL);
  });

  it("prefers the strength-specific asset over the inherited parent image", () => {
    const url = variantVialImage({
      sku: "YPB.237",
      slug: "bpc-157",
      size: "20mg",
      fallbackSrc: "https://cdn/bpc157-5mg.png",
    });
    expect(url).toContain("bpc157-20mg");
  });
});

describe("cart line images resolve by the variation's own SKU", () => {
  it("shows the 50mg photo for 5-Amino-1MQ 50mg even when the store returns the 5mg parent image", () => {
    const url = cartLineImage({
      sku: "YPB.247",
      name: "5-Amino-1MQ",
      size: "50mg",
      fallbackSrc: "https://admin.clarumpeptides.com/wp-content/uploads/2026/06/5amino1mq-5mg.png",
    });
    expect(url).toContain("5amino1mq-50mg");
    expect(url).not.toContain("5amino1mq-5mg");
  });

  it("shows the 20mg photo for BPC-157 20mg in the cart", () => {
    const url = cartLineImage({
      sku: "YPB.237",
      name: "BPC-157",
      size: "20mg",
      fallbackSrc: "https://admin.clarumpeptides.com/wp-content/uploads/2026/06/bpc157-5mg.png",
    });
    expect(url).toContain("bpc157-20mg");
  });

  it("falls back to the neutral vial, never a different strength, when no asset matches", () => {
    const url = cartLineImage({
      sku: "YPB.999",
      name: "Unknown Compound",
      size: "50mg",
      fallbackSrc: "https://cdn/unknown-5mg.png",
    });
    expect(url).toBe(DEFAULT_VIAL);
  });
});
