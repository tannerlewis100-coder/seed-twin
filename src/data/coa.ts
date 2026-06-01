export type CoaEntry = {
  purity: string;
  assay: string;
  heavy_metals: string;
  microbial: string;
  batch: string;
  test_date: string;
};

export const coaData = {
  lab: "Analytical Formulations, Inc.",
  manufacturer: "YPB Labs",
  instrument: "Jenway 6715 UV/Vis Spectrophotometer",
  products: {
    "2x-blend-cjc-ipa": { purity: "Pass", assay: "CJC-1295 5.55 mg / Ipamorelin 4.78 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "YPB.238", test_date: "2026-01-03" },
    "4x-blend-mic": { purity: "Pass", assay: "Choline 53.05 / Carnitine 52.28 / Methionine 15.50 / Dexpanthenol 5.12 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "20251222L06120S10", test_date: "2026-02-27" },
    "5-amino-1mq-50mg": { purity: "98.7%", assay: "54.21 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "YPB.247", test_date: "2025-12-28" },
    "8x-blend-lipo": { purity: "Pass", assay: "Choline 56.59 / Inositol 53.11 / Methionine 27.05 / B6 27.79 / Carnitine 21.94 / Arginine 20.95 / B5 5.43 / B12 1.15 mg", heavy_metals: "<150 ppb", microbial: "0 CFU", batch: "20251228L06216S10", test_date: "2026-02-27" },
    "ace-031": { purity: "99.7%", assay: "1.03 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "YPB.249", test_date: "2026-01-03" },
    "aod-9604": { purity: "99.2%", assay: "5.66 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "20260110L02AODS40", test_date: "2026-02-27" },
    "b12": { purity: "99.0%", assay: "10.15 mg", heavy_metals: "<150 ppb", microbial: "0 CFU", batch: "20251225L06B12S10", test_date: "2026-02-27" },
    "bpc-157": { purity: "99.9%", assay: "11.76 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "20251208L03BCCS10", test_date: "2026-03-21" },
    "cagrilintide": { purity: "99.9%", assay: "10.69 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "YPB.241", test_date: "2026-01-03" },
    "cjc-1295-with-dac": { purity: "99.1%", assay: "4.96 mg", heavy_metals: "<20 ppb", microbial: "0 CFU", batch: "YPB.220", test_date: "2026-01-14" },
    "cjc-1295-without-dac": { purity: "99.9%", assay: "10.16 mg", heavy_metals: "<20 ppb", microbial: "0 CFU", batch: "YPB.219", test_date: "2026-01-14" },
    "dsip": { purity: "98.8%", assay: "5.39 mg", heavy_metals: "0 ppb", microbial: "<100 CFU", batch: "YPB.252", test_date: "2025-12-28" },
    "epitalon": { purity: "99.3%", assay: "12.45 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "20251205L04ETZS50", test_date: "2026-03-21" },
    "foxo4-dri": { purity: "99.5%", assay: "10.30 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "20251220L05F4S10", test_date: "2026-02-27" },
    "gdf-8": { purity: "99.1%", assay: "1.05 mg", heavy_metals: "<20 ppb", microbial: "0 CFU", batch: "YPB.233", test_date: "2026-01-14" },
    "ghk-cu": { purity: "99.1%", assay: "51.63 mg", heavy_metals: "<150 ppb", microbial: "0 CFU", batch: "YPB.221", test_date: "2026-01-14" },
    "ghrp-6": { purity: "98.5%", assay: "5.86 mg", heavy_metals: "0 ppb", microbial: "<100 CFU", batch: "YPB.257", test_date: "2025-12-28" },
    "glow-blend": { purity: "Pass", assay: "GHK-Cu 50.62 / BPC-157 11.10 / TB-500 10.92 mg", heavy_metals: "<150 ppb", microbial: "0 CFU", batch: "YPB.218", test_date: "2026-01-14" },
    "glutathione": { purity: "99.8%", assay: "1798.7 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "25112501", test_date: "2026-02-27" },
    "hexarelin": { purity: "99.4%", assay: "5.29 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "20251226L04GHSS05", test_date: "2026-02-27" },
    "kisspeptin": { purity: "99.1%", assay: "10.19 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "YPB.266", test_date: "2026-01-03" },
    "klow-blend": { purity: "Pass", assay: "GHK-Cu 54.10 / BPC-157 9.87 / TB-500 10.03 / KPV 9.94 mg", heavy_metals: "<15 ppb", microbial: "<100 CFU", batch: "YPB.264", test_date: "2025-12-28" },
    "kpv": { purity: "99.5%", assay: "10.39 mg", heavy_metals: "<20 ppb", microbial: "0 CFU", batch: "20260108L06KPVS10", test_date: "2026-02-27" },
    "ll-37": { purity: "99.6%", assay: "5.14 mg", heavy_metals: "0 ppb", microbial: "<100 CFU", batch: "YPB.244", test_date: "2025-12-28" },
    "mazdutide": { purity: "99.6%", assay: "105.19 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "20260112L02MDTS01", test_date: "2026-02-27" },
    "melanotan-2": { purity: "99.7%", assay: "11.28 mg", heavy_metals: "<20 ppb", microbial: "0 CFU", batch: "20260102L03MT2S10", test_date: "2026-02-27" },
    "mots-c": { purity: "99.7%", assay: "10.35 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "20260103L01MTSS10", test_date: "2026-02-27" },
    "nad-plus": { purity: "99.5%", assay: "1062.2 mg", heavy_metals: "<20 ppb", microbial: "0 CFU", batch: "YPB.224", test_date: "2026-01-14" },
    "selank": { purity: "99.6%", assay: "10.01 mg", heavy_metals: "<20 ppb", microbial: "0 CFU", batch: "YPB.228", test_date: "2026-01-14" },
    "semax": { purity: "99.9%", assay: "10.35 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "20251219L04XA2S10", test_date: "2026-03-21" },
    "sermorelin": { purity: "99.5%", assay: "10.20 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "20251226L01SM0S2", test_date: "2026-02-27" },
    "slu-pp-332": { purity: "99.1%", assay: "5.19 mg", heavy_metals: "0 ppb", microbial: "<100 CFU", batch: "YPB.243", test_date: "2025-12-28" },
    "ss-31": { purity: "99.3%", assay: "10.27 mg", heavy_metals: "<20 ppb", microbial: "0 CFU", batch: "YPB.245", test_date: "2026-01-14" },
    "tb-500": { purity: "99.8%", assay: "10.16 mg", heavy_metals: "<20 ppb", microbial: "0 CFU", batch: "20251216L02TB9S10", test_date: "2026-03-21" },
    "thymosin-alpha-1": { purity: "99.7%", assay: "10.06 mg", heavy_metals: "<20 ppb", microbial: "0 CFU", batch: "YPB.231", test_date: "2026-01-14" },
    "wolverine-blend": { purity: "Pass", assay: "BPC-157 11.65 / TB-500 11.09 mg", heavy_metals: "<10 ppb", microbial: "0 CFU", batch: "20260107L04BB0S20", test_date: "2026-02-27" },
  } as Record<string, CoaEntry>,
};

// Alias map for slugs that differ in the product catalog
const aliases: Record<string, string> = {
  "ghk-copper": "ghk-cu",
  "ll37": "ll-37",
  "cjc-1295-dac": "cjc-1295-with-dac",
  "cjc-1295-no-dac": "cjc-1295-without-dac",
  "cjc-dac": "cjc-1295-with-dac",
  "cjc-no-dac": "cjc-1295-without-dac",
  "mt-2": "melanotan-2",
  "mt2": "melanotan-2",
  "5-amino-1mq": "5-amino-1mq-50mg",
  "amino-1mq": "5-amino-1mq-50mg",
  "ta-1": "thymosin-alpha-1",
  "tb500": "tb-500",
  "motsc": "mots-c",
  "nad": "nad-plus",
  "nad+": "nad-plus",
  "vitamin-b12": "b12",
  "2x-cjc-ipa": "2x-blend-cjc-ipa",
  "4x-mic": "4x-blend-mic",
  "8x-lipo": "8x-blend-lipo",
  "wolverine": "wolverine-blend",
  "glow": "glow-blend",
  "klow": "klow-blend",
};

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function getCoa(slug: string): CoaEntry | null {
  if (!slug) return null;
  const direct = coaData.products[slug];
  if (direct) return direct;
  const aliased = aliases[slug];
  if (aliased && coaData.products[aliased]) return coaData.products[aliased];
  const norm = normalize(slug);
  for (const [k, v] of Object.entries(coaData.products)) {
    if (normalize(k) === norm) return v;
  }
  for (const [k, v] of Object.entries(aliases)) {
    if (normalize(k) === norm && coaData.products[v]) return coaData.products[v];
  }
  // try stripping common dose suffix
  const stripped = slug.replace(/-\d+(?:\.\d+)?(?:mg|mcg|iu|ml)$/i, "");
  if (stripped !== slug) return getCoa(stripped);
  return null;
}
