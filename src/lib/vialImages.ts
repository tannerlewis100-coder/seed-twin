// Neutral placeholder: Clarum vial with a blank label (no product name or
// strength). Used while variation data is pending or unknown.
import vialDefault from "@/assets/vial/clarum-vial-neutral.png";
import { skuForSlugSize } from "@/data/coaLibrary";

export const DEFAULT_VIAL = vialDefault;

/**
 * Single consistent vial set: one template, one label font, supplied finished
 * by the owner. Every product surface resolves through this map — we never
 * use backend product photography for vials any more.
 */
const CONSISTENT_MODULES = import.meta.glob("../assets/products/consistent/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const IMAGE_BY_FILE: Record<string, string> = Object.fromEntries(
  Object.entries(CONSISTENT_MODULES).map(([path, url]) => [
    path.split("/").pop()!.toLowerCase(),
    url,
  ]),
);

/** Resolve a supplied label filename (.png in labels.json) to the bundled .webp. */
function img(file: string): string | null {
  const webp = file.toLowerCase().replace(/\.png$/, ".webp");
  return IMAGE_BY_FILE[webp] ?? null;
}

/**
 * Name/slug heuristics, used only where no supplier code is available (static
 * homepage data). Values are label filenames from the supplied package; a
 * filename with no bundled image falls through to the neutral vial.
 */
const RULES: Array<[RegExp, string]> = [
  [/recon-water-10ml|reconstitution\s*water.*10ml|bac\s*water.*10ml|bacteriostatic.*10ml|sterile\s*water.*10ml/i, "bac-water-10ml.png"],
  [/recon-water-3ml|reconstitution\s*water|bac\s*water|bacteriostatic|sterile\s*water|recon-water/i, "bac-water-3ml.png"],
  [/5-?amino-?1mq.*50mg|5amino1mq.*50mg|5a1mq.*50mg/i, "5amino1mq-50mg.png"],
  [/5-?amino-?1mq|5a1mq/i, "5amino1mq-5mg.png"],
  [/\bb-?12\b|cyanocobalamin|methylcobalamin/i, "b12-10ml.png"],
  [/aod-?9604/i, "aod9604-5mg.png"],
  [/\baicar\b/i, "aicar-50mg.png"],
  [/ace-?031/i, "ace031-1mg.png"],
  [/ara-?290/i, "ara290-10mg.png"],
  [/glp-?1\s*s.*30mg/i, "glp1-s-30mg.png"],
  [/glp-?1\s*s.*20mg/i, "glp1-s-20mg.png"],
  [/glp-?1\s*s/i, "glp1-s-10mg.png"],
  [/glp-?2.*60mg/i, "glp2-tz-60mg.png"],
  [/glp-?2.*50mg/i, "glp2-tz-50mg.png"],
  [/glp-?2.*40mg/i, "glp2-tz-40mg.png"],
  [/glp-?2.*30mg/i, "glp2-tz-30mg.png"],
  [/glp-?2.*20mg/i, "glp2-tz-20mg.png"],
  [/glp-?2/i, "glp2-tz-10mg.png"],
  [/glp-?3.*60mg/i, "glp3-rt-60mg.png"],
  [/glp-?3.*50mg/i, "glp3-rt-50mg.png"],
  [/glp-?3.*40mg/i, "glp3-rt-40mg.png"],
  [/glp-?3.*30mg/i, "glp3-rt-30mg.png"],
  [/glp-?3.*20mg/i, "glp3-rt-20mg.png"],
  [/glp-?3/i, "glp3-rt-10mg.png"],
  [/pinealon/i, "pinealon-20mg.png"],
  [/\bvip-?10\b|\bvip\b/i, "vip10-10mg.png"],
  [/mazdutide/i, "mazdutide-100mg.png"],
  [/foxo-?4/i, "foxo4-10mg.png"],
  [/glutathione.*1500mg/i, "glutathione-1500mg.png"],
  [/glutathione/i, "glutathione-600mg.png"],
  [/survodutide/i, "survodutide-10mg.png"],
  [/cjc.*with\s*dac|cjc-?dac|cjc\s*\+\s*dac/i, "cjc-with-dac-5mg.png"],
  [/cjc.*without\s*dac|cjc.*no\s*dac|cjc-?nodac/i, "cjc-no-dac-10mg.png"],
  [/blend\s*cjc\/ipamorelin|cjc.*ipa|ipamorelin.*cjc|2x-cjc-ipa/i, "cjc-ipa-blend.png"],
  [/\bipamorelin\b/i, "ipamorelin-10mg.png"],
  [/tesamorelin.*20mg/i, "tesamorelin-20mg.png"],
  [/tesamorelin/i, "tesamorelin-10mg.png"],
  [/sermorelin/i, "sermorelin-10mg.png"],
  [/kisspeptin/i, "kisspeptin-10mg.png"],
  [/hexarelin/i, "hexarelin-5mg.png"],
  [/\bhcg\b|chorionic\s+gonadotropin/i, "hcg-10000iu.png"],
  [/pnc-?27/i, "pnc27-10mg.png"],
  [/ss-?31.*50mg/i, "ss31-50mg.png"],
  [/ss-?31/i, "ss31-10mg.png"],
  [/ghrp-?6.*10mg/i, "ghrp6-10mg.png"],
  [/ghrp-?6/i, "ghrp6-5mg.png"],
  [/\bhmg\b/i, "hmg-75iu.png"],
  [/thymosin\s*alpha\s*1|\bta1\b|\bta-?1\b/i, "ta1-10mg.png"],
  [/thymalin/i, "thymalin-10mg.png"],
  [/dsip.*15mg/i, "dsip-15mg.png"],
  [/dsip/i, "dsip-5mg.png"],
  [/snap-?8/i, "snap8-10mg.png"],
  [/(?:bpc-?157.*tb-?500|wolverine).*(?:20mg|10mg\s*\/\s*10mg)/i, "bpc157-tb500-20mg.png"],
  [/bpc-?157.*tb-?500|wolverine/i, "bpc157-tb500-5mg.png"],
  [/glow/i, "glow-blend.png"],
  [/\bklow\b/i, "klow-blend.png"],
  [/ghk-?cu.*100mg|ghk-cu-100mg/i, "ghkcu-100mg.png"],
  [/ghk-?cu|\bghk\b/i, "ghkcu-50mg.png"],
  [/mots-?c.*40mg/i, "motsc-40mg.png"],
  [/mots-?c|\bmots\b/i, "motsc-10mg.png"],
  [/tb-?500.*10mg/i, "tb500-10mg.png"],
  [/tb-?500|thymosin\s*beta/i, "tb500-5mg.png"],
  [/selank/i, "selank-10mg.png"],
  [/semax/i, "semax-10mg.png"],
  [/melanotan/i, "melanotan2-10mg.png"],
  [/slu-?pp-?332|slupp332/i, "slu-pp-332-5mg.png"],
  [/gdf-?8|myostatin/i, "gdf8-1mg.png"],
  [/ll-?37/i, "ll37-5mg.png"],
  [/\bkpv\b|lysine[-\s]*proline[-\s]*valine/i, "kpv-10mg.png"],
  [/igf-?des|igf\s*des/i, "igfdes-0-1mg.png"],
  [/igf-?1\s*lr3.*0\.?1mg|igf-?1-?lr3-?0/i, "igf1lr3-0-1mg.png"],
  [/igf-?1\s*lr3|igf-1-lr3/i, "igf1lr3-1mg.png"],
  [/n[-\s]*acetyl[-\s]*epitalon|na[-\s]*epitalon/i, "na-epitalon-5mg.png"],
  [/epitalon.*50mg|epithalon.*50mg/i, "epitalon-50mg.png"],
  [/epitalon|epithalon/i, "epitalon-10mg.png"],
  [/nad\+.*500mg/i, "nad-500mg.png"],
  [/nad\+/i, "nad-1000mg.png"],
  [/pt-?141/i, "pt141-10mg.png"],
  [/bpc-?157.*20mg/i, "bpc157-20mg.png"],
  [/bpc-?157.*10mg/i, "bpc157-10mg.png"],
  [/bpc-?157/i, "bpc157-5mg.png"],
  [/cagrilintide|\bcagri\b/i, "cagrilintide-10mg.png"],
  [/8x|lipotropic/i, "blend-8x.png"],
  [/4x|mic|stack|blend/i, "blend-4x.png"],
];

export function vialImageFor(name: string, slug?: string): string {
  const haystack = `${name} ${slug ?? ""}`;
  for (const [re, file] of RULES) {
    if (re.test(haystack)) return img(file) ?? vialDefault;
  }
  return vialDefault;
}

const FORCED_OVERRIDE_MAP: Array<[RegExp, string]> = [
  [/\bklow\b/i, "klow-blend.png"],
  [/\bglow\b/i, "glow-blend.png"],
  [/\bkpv\b|lysine[-\s]*proline[-\s]*valine/i, "kpv-10mg.png"],
  [/n[-\s]*acetyl[-\s]*epitalon|na[-\s]*epitalon/i, "na-epitalon-5mg.png"],
];

export function forcedVialImage(name: string, slug?: string): string | null {
  const haystack = `${name} ${slug ?? ""}`;
  for (const [re, file] of FORCED_OVERRIDE_MAP) {
    if (re.test(haystack)) return img(file);
  }
  return null;
}

/**
 * Exact supplier SKU -> label filename, taken verbatim from the supplied
 * package manifest (labels.json). Never inferred from product names.
 */
const SKU_IMAGE_FILES: Record<string, string> = {
  "YPB.209": "glp3-rt-10mg.png",
  "YPB.210": "glp3-rt-20mg.png",
  "YPB.234": "glp3-rt-30mg.png",
  "YPB.235": "glp3-rt-40mg.png",
  "YPB.236": "glp3-rt-50mg.png",
  "YPB.287": "glp3-rt-60mg.png",
  "YPB.203": "glp2-tz-10mg.png",
  "YPB.204": "glp2-tz-20mg.png",
  "YPB.205": "glp2-tz-30mg.png",
  "YPB.206": "glp2-tz-40mg.png",
  "YPB.207": "glp2-tz-50mg.png",
  "YPB.208": "glp2-tz-60mg.png",
  "YPB.200": "glp1-s-10mg.png",
  "YPB.201": "glp1-s-20mg.png",
  "YPB.202": "glp1-s-30mg.png",
  "YPB.225": "bac-water-3ml.png",
  "YPB.226": "bac-water-10ml.png",
  "YPB.251": "b12-10ml.png",
  "YPB.268": "blend-4x.png",
  "YPB.267": "blend-8x.png",
  "YPB.264": "klow-blend.png",
  "YPB.218": "glow-blend.png",
  "YPB.238": "cjc-ipa-blend.png",
  "YPB.216": "bpc157-tb500-5mg.png",
  "YPB.217": "bpc157-tb500-20mg.png",
  "YPB.266": "kisspeptin-10mg.png",
  "YPB.274": "pt141-10mg.png",
  "YPB.283": "glutathione-600mg.png",
  "YPB.259": "glutathione-1500mg.png",
  "YPB.223": "nad-500mg.png",
  "YPB.224": "nad-1000mg.png",
  "YPB.243": "slu-pp-332-5mg.png",
  "YPB.278": "survodutide-10mg.png",
  "YPB.269": "mazdutide-100mg.png",
  "YPB.241": "cagrilintide-10mg.png",
  "YPB.250": "aicar-50mg.png",
  "YPB.248": "aod9604-5mg.png",
  "YPB.242": "5amino1mq-5mg.png",
  "YPB.247": "5amino1mq-50mg.png",
  "YPB.281": "vip10-10mg.png",
  "YPB.265": "kpv-10mg.png",
  "YPB.231": "ta1-10mg.png",
  "YPB.280": "thymalin-10mg.png",
  "YPB.275": "pnc27-10mg.png",
  "YPB.270": "melanotan2-10mg.png",
  "YPB.272": "snap8-10mg.png",
  "YPB.221": "ghkcu-50mg.png",
  "YPB.222": "ghkcu-100mg.png",
  "YPB.252": "dsip-5mg.png",
  "YPB.230": "dsip-15mg.png",
  "YPB.228": "selank-10mg.png",
  "YPB.229": "semax-10mg.png",
  "YPB.273": "pinealon-20mg.png",
  "YPB.255": "foxo4-10mg.png",
  "YPB.245": "ss31-10mg.png",
  "YPB.246": "ss31-50mg.png",
  "YPB.227": "motsc-10mg.png",
  "YPB.271": "motsc-40mg.png",
  "YPB.253": "epitalon-10mg.png",
  "YPB.254": "epitalon-50mg.png",
  "YPB.232": "na-epitalon-5mg.png",
  "YPB.249": "ace031-1mg.png",
  "YPB.233": "gdf8-1mg.png",
  "YPB.286": "igfdes-0-1mg.png",
  "YPB.285": "igf1lr3-0-1mg.png",
  "YPB.262": "igf1lr3-1mg.png",
  "YPB.258": "hmg-75iu.png",
  "YPB.256": "hcg-10000iu.png",
  "YPB.261": "hexarelin-5mg.png",
  "YPB.282": "ghrp6-5mg.png",
  "YPB.257": "ghrp6-10mg.png",
  "YPB.279": "tesamorelin-10mg.png",
  "YPB.288": "tesamorelin-20mg.png",
  "YPB.263": "ipamorelin-10mg.png",
  "YPB.220": "cjc-with-dac-5mg.png",
  "YPB.219": "cjc-no-dac-10mg.png",
  "YPB.211": "sermorelin-10mg.png",
  "YPB.277": "ara290-10mg.png",
  "YPB.244": "ll37-5mg.png",
  "YPB.214": "tb500-5mg.png",
  "YPB.215": "tb500-10mg.png",
  "YPB.212": "bpc157-5mg.png",
  "YPB.213": "bpc157-10mg.png",
  "YPB.237": "bpc157-20mg.png",
};

/** Exposed for tests: the manifest mapping and the bundled file index. */
export const SKU_IMAGE_MANIFEST = SKU_IMAGE_FILES;
export const BUNDLED_VIAL_FILES = IMAGE_BY_FILE;

export function productImageForSku(sku?: string | null): string | null {
  if (!sku) return null;
  const token = sku.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const m = token.match(/^([A-Z]+)(\d+)$/);
  const normalized = m ? `${m[1]}.${m[2]}` : token;
  const file = SKU_IMAGE_FILES[normalized];
  return file ? img(file) : null;
}

/**
 * Single resolver used by the PDP, quick view, catalogue, cart and related
 * cards. Order: exact-SKU asset -> explicit slug+strength alias -> neutral
 * vial. Backend photography is never used for vials, and we never attach a
 * photo whose printed strength differs from the selected variant.
 */
export function variantVialImage({
  sku,
  slug,
  size,
  fallbackSrc,
}: {
  sku?: string | null;
  name?: string;
  slug?: string;
  size?: string | null;
  fallbackSrc?: string;
}): string {
  const bySku = productImageForSku(sku);
  if (bySku) return bySku;
  const aliasSku = skuForSlugSize(slug, size);
  const byAlias = productImageForSku(aliasSku);
  if (byAlias) return byAlias;
  // Unknown / unresolved: a neutral vial, never a wrong-strength label and
  // never the parent product photo.
  void fallbackSrc;
  return vialDefault;
}

function slugifyName(name?: string | null): string | undefined {
  if (!name) return undefined;
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Cart/checkout line image. Cart rows only carry the variation's SKU, name and
 * the chosen attribute values, so resolve through the same exact-SKU map and
 * never fall back to the parent product photo for a variation.
 */
export function cartLineImage(input: {
  sku?: string | null;
  name?: string | null;
  size?: string | null;
  fallbackSrc?: string;
}): string {
  return variantVialImage({
    sku: input.sku,
    slug: slugifyName(input.name),
    size: input.size,
    fallbackSrc: input.fallbackSrc,
  });
}
