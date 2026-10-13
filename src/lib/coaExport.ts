import { coaRecords, type CoaRecord } from "@/data/coaLibrary";

export const SITE_ORIGIN = "https://clarumpeptides.com";

export type CoaExportEntry = {
  batch_number: string | null;
  sku: string | null;
  peptide_name: string | null;
  peptide_aliases: string[];
  size_mg: number | null;
  test_date: string | null;
  purity_percent: number | null;
  assay_mg: number | null;
  heavy_metals_ppb: string | null;
  pass: boolean | null;
  lab_name: string | null;
  report_image_urls: string[];
  verification_page_url: string | null;
};

/** Ordered: more specific patterns first. */
const NAME_RULES: { test: RegExp; name: string; aliases: string[] }[] = [
  { test: /wolverine|bpc.*\+.*tb/i, name: "Wolverine Blend", aliases: ["BPC-157 / TB-500 Blend", "BPC-157 + TB-500"] },
  { test: /^2x blend/i, name: "2X Blend CJC-1295 / Ipamorelin", aliases: ["CJC-1295 no DAC + Ipamorelin"] },
  { test: /^4x blend/i, name: "4X Blend", aliases: [] },
  { test: /^8x blend/i, name: "8X Blend", aliases: [] },
  { test: /n-acetyl epitalon/i, name: "N-Acetyl Epitalon Amidate", aliases: ["NA-Epitalon"] },
  { test: /bpc[- ]?157/i, name: "BPC-157", aliases: ["BPC157", "Body Protection Compound 157"] },
  { test: /tb[- ]?500|thymosin beta/i, name: "TB-500", aliases: ["TB500", "Thymosin Beta-4"] },
  { test: /ghk[- ]?cu/i, name: "GHK-Cu", aliases: ["Copper Peptide", "GHKCu"] },
  { test: /epitalon|epithalon/i, name: "Epitalon", aliases: ["Epithalon"] },
  { test: /mots[- ]?c/i, name: "MOTS-c", aliases: ["MOTSc"] },
  { test: /semax/i, name: "Semax", aliases: [] },
  { test: /selank/i, name: "Selank", aliases: [] },
  { test: /nad\+?/i, name: "NAD+", aliases: ["NAD", "Nicotinamide Adenine Dinucleotide"] },
  { test: /glp-?3|retatrutide/i, name: "GLP-3 RT", aliases: ["Retatrutide"] },
  { test: /ss-?37/i, name: "SS-37", aliases: ["SS37"] },
  { test: /ss-?31/i, name: "SS-31", aliases: ["SS31", "Elamipretide"] },
  { test: /cjc-?1295/i, name: "CJC-1295 Without DAC", aliases: ["Mod GRF 1-29"] },
  { test: /igf-?1 ?lr3/i, name: "IGF-1 LR3", aliases: ["IGF1-LR3"] },
  { test: /5-amino-1mq/i, name: "5-Amino-1MQ", aliases: ["5-Amino1MQ"] },
  { test: /aod-?9604/i, name: "AOD-9604", aliases: ["AOD9604"] },
  { test: /reconstitution/i, name: "Bacteriostatic Water", aliases: ["Reconstitution Solution"] },
  { test: /pt-?141/i, name: "PT-141", aliases: ["Bremelanotide"] },
  { test: /melanotan/i, name: "Melanotan-2", aliases: ["MT-2"] },
  { test: /fox0?4/i, name: "FOXO4-DRI", aliases: ["FOX04-DRI"] },
];

function stripSize(name: string): string {
  return name
    .replace(/\(?\s*[\d.,]+\s*(mg|mcg|ml|iu)\s*\)?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizePeptideName(productName: string | null | undefined): {
  name: string | null;
  aliases: string[];
} {
  if (!productName) return { name: null, aliases: [] };
  const rule = NAME_RULES.find((r) => r.test.test(productName));
  if (rule) return { name: rule.name, aliases: [...rule.aliases] };
  return { name: stripSize(productName) || null, aliases: [] };
}

export function parseNumber(value: string | null | undefined): number | null {
  if (!value) return null;
  const m = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}

/** Labelled size in mg from the product name; totals combined blend parts. */
export function sizeMgFromName(productName: string | null | undefined): number | null {
  if (!productName) return null;
  const parts = [...productName.matchAll(/(\d+(?:\.\d+)?)\s*mg(?!\s*\/\s*ml)/gi)].map((m) => Number(m[1]));
  if (parts.length > 0) {
    return /\+|wolverine/i.test(productName) && parts.length > 1
      ? parts.reduce((a, b) => a + b, 0)
      : parts[0];
  }
  const blend = productName.match(/(\d+)\s*\/\s*(\d+)/);
  if (blend && /wolverine/i.test(productName)) return Number(blend[1]) + Number(blend[2]);
  return null;
}

function findAnalyte(record: CoaRecord, pattern: RegExp) {
  return record.analytes.find((a) => pattern.test(a.name)) ?? null;
}

function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}

function passStatus(record: CoaRecord): boolean | null {
  if (record.overallDecision) return record.overallDecision.toLowerCase() === "pass";
  const decided = record.analytes.map((a) => a.passFail).filter((v): v is string => !!v);
  if (decided.length === 0) return null;
  return decided.every((v) => v.toLowerCase() === "pass");
}

export function toExportEntry(record: CoaRecord): CoaExportEntry {
  const { name, aliases } = normalizePeptideName(record.productName);
  const purity = findAnalyte(record, /purity/i);
  const assay = findAnalyte(record, /^quantitative assay|^net content$/i);
  const metals = findAnalyte(record, /heavy metals/i);
  return {
    batch_number: record.batch || null,
    sku: record.sku || null,
    peptide_name: name,
    peptide_aliases: aliases,
    size_mg: sizeMgFromName(record.productName),
    test_date: record.testedAt || null,
    purity_percent: purity?.result && /%/.test(purity.result) ? parseNumber(purity.result) : null,
    assay_mg: assay?.result && /mg/i.test(assay.result) ? parseNumber(assay.result) : null,
    heavy_metals_ppb: metals?.result ? metals.result.replace(/\s+/g, "") : null,
    pass: passStatus(record),
    lab_name: record.lab?.name ?? null,
    report_image_urls: (record.pages ?? []).map(absoluteUrl),
    verification_page_url: record.sku
      ? `${SITE_ORIGIN}/coa-library?q=${encodeURIComponent(record.sku)}`
      : null,
  };
}

export function buildCoaExport(now: Date = new Date()) {
  return {
    updated_at: now.toISOString(),
    coas: coaRecords.map(toExportEntry),
  };
}
