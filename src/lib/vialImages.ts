import vialDefault from "@/assets/vial/vial-1.png";
import blend4x from "@/assets/products/blend-4x.png";
import blend8x from "@/assets/products/blend-8x.png";
import ss31 from "@/assets/products/ss31-10mg.png";
import cjcNoDac from "@/assets/products/cjc-no-dac.png";
import tesamorelin from "@/assets/products/tesamorelin.png";
import dsip from "@/assets/products/dsip.png";
import snap8 from "@/assets/products/snap8.png";
import pnc27 from "@/assets/products/pnc27.png";
import cjcIpaBlend from "@/assets/products/cjc-ipa-blend.png";
import cagriGlp from "@/assets/products/cagri-glp.png";
import ghrp6 from "@/assets/products/ghrp6.png";
import ta1 from "@/assets/products/ta1.png";
import glowBlend from "@/assets/products/glow-blend.png";
import wolverine from "@/assets/products/wolverine.png";
import ghkcu from "@/assets/products/ghkcu.png";
import ghkcu100 from "@/assets/products/ghkcu-100mg.png";
import motsc from "@/assets/products/motsc.png";
import cjcWithDac from "@/assets/products/cjc-with-dac.png";
import tb500 from "@/assets/products/tb500.png";
import semax from "@/assets/products/semax.png";
import sermorelin from "@/assets/products/sermorelin-10mg.png";
import hmg from "@/assets/products/hmg-75iu.png";
import klowBlend from "@/assets/products/klow-blend.png";
import igf1lr3 from "@/assets/products/igf1lr3-1mg.png";
import nad1000 from "@/assets/products/nad-1000mg.png";
import glutathione from "@/assets/products/glutathione-600mg.png";
import pt141 from "@/assets/products/pt141-10mg.png";
import tesamorelin20 from "@/assets/products/tesamorelin-20mg.png";
import epitalon10 from "@/assets/products/epitalon-10mg.png";
import epitalon50 from "@/assets/products/epitalon-50mg.png";
import selank from "@/assets/products/selank-10mg.png";
import survodutide from "@/assets/products/survodutide-10mg.png";
import glp1s10 from "@/assets/products/glp1-s-10mg.png";
import glp1s20 from "@/assets/products/glp1-s-20mg.png";
import glp1s30 from "@/assets/products/glp1-s-30mg.png";
import glp2tz10 from "@/assets/products/glp2-tz-10mg.png";
import glp2tz20 from "@/assets/products/glp2-tz-20mg.png";
import glp2tz30 from "@/assets/products/glp2-tz-30mg.png";
import glp2tz40 from "@/assets/products/glp2-tz-40mg.png";
import glp2tz50 from "@/assets/products/glp2-tz-50mg.png";
import glp2tz60 from "@/assets/products/glp2-tz-60mg.png";
import glp3rt10 from "@/assets/products/glp3-rt-10mg.png";
import glp3rt20 from "@/assets/products/glp3-rt-20mg.png";
import glp3rt30 from "@/assets/products/glp3-rt-30mg.png";
import glp3rt40 from "@/assets/products/glp3-rt-40mg.png";
import glp3rt50 from "@/assets/products/glp3-rt-50mg.png";
import glp3rt60 from "@/assets/products/glp3-rt-60mg.png";
import melanotan2 from "@/assets/products/melanotan2-10mg.png";
import wolverine20 from "@/assets/products/wolverine-20mg.png";
import slupp332 from "@/assets/products/slu-pp-332-5mg.png";
import igf1lr3Small from "@/assets/products/igf1lr3-0-1mg.png";
import gdf8 from "@/assets/products/gdf8-1mg.png";
import nad500 from "@/assets/products/nad-500mg.png";
import lpv from "@/assets/products/lpv-10mg.png";
import ll37 from "@/assets/products/ll37-5mg.png";
import ipamorelin from "@/assets/products/ipamorelin-10mg.png";
import thymalin from "@/assets/products/thymalin-10mg.png";
import pinealon from "@/assets/products/pinealon-20mg.png";
import vip10 from "@/assets/products/vip10-10mg.png";
import mazdutide from "@/assets/products/mazdutide-100mg.png";
import foxo4 from "@/assets/products/foxo4-10mg.png";
import glutathione1500 from "@/assets/products/glutathione-1500mg.png";
import igfdes from "@/assets/products/igfdes-0-1mg.png";
import cagrilintide10 from "@/assets/products/cagrilintide-10mg.png";
import kisspeptin from "@/assets/products/kisspeptin-10mg.png";
import hcg10000 from "@/assets/products/hcg-10000iu.png";
import hexarelin from "@/assets/products/hexarelin-5mg.png";
import amino1mq50 from "@/assets/products/5amino1mq-50mg.png";
import amino1mq5 from "@/assets/products/5amino1mq-5mg.png";
import b12 from "@/assets/products/b12-10ml.png";
import aod9604 from "@/assets/products/aod9604-5mg.png";
import aicar from "@/assets/products/aicar-50mg.png";
import ace031 from "@/assets/products/ace031-1mg.png";
import ara290 from "@/assets/products/ara290-10mg.png";
import bacWater from "@/assets/products/bac-water-3ml.png";
import bpc157 from "@/assets/products/bpc157-20mg.png";
import kpv10 from "@/assets/products/kpv-10mg.png";
import naEpitalon5 from "@/assets/products/na-epitalon-5mg.png";

export const DEFAULT_VIAL = vialDefault;

const PRODUCT_IMAGE_MODULES = import.meta.glob("../assets/products/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const PRODUCT_IMAGE_BY_FILE = Object.fromEntries(
  Object.entries(PRODUCT_IMAGE_MODULES).map(([path, url]) => [path.split("/").pop()!.toLowerCase(), url]),
);

function normalizeImageToken(value: string): string {
  return value
    .toLowerCase()
    .replace(/&nbsp;/g, " ")
    .replace(/µ/g, "u")
    .replace(/(\d)\s+(mg|ml|iu|mcg|ug|g)\b/g, "$1$2")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function productImageByFileName(fileName?: string | null): string | null {
  if (!fileName) return null;
  return PRODUCT_IMAGE_BY_FILE[fileName.toLowerCase()] ?? null;
}

const RULES: Array<[RegExp, string]> = [
  [/reconstitution\s*water|bac\s*water|bacteriostatic|sterile\s*water|recon-water/i, bacWater],
  [/bpc-?157/i, bpc157],
  [/cagrilintide.*glp|cagri.*glp/i, cagriGlp],
  [/\bcagrilintide\b|\bcagri\b/i, cagrilintide10],
  [/cagrilintide.*10mg|\bcagri\b.*10mg/i, cagrilintide10],
  [/5-?amino-?1mq.*50mg|5amino1mq.*50mg/i, amino1mq50],
  [/5-?amino-?1mq.*5mg|5amino1mq.*5mg/i, amino1mq5],
  [/5-?amino-?1mq/i, amino1mq5],
  [/\bb-?12\b|cyanocobalamin|methylcobalamin/i, b12],
  [/aod-?9604/i, aod9604],
  [/\baicar\b/i, aicar],
  [/ace-?031/i, ace031],
  [/ara-?290/i, ara290],
  [/glp-?1\s*s.*30mg/i, glp1s30],
  [/glp-?1\s*s.*20mg/i, glp1s20],
  [/glp-?1\s*s.*10mg/i, glp1s10],
  [/glp-?1\s*s/i, glp1s10],
  [/glp-?2.*60mg/i, glp2tz60],
  [/glp-?2.*50mg|glp-?2-tz-50mg/i, glp2tz50],
  [/glp-?2.*40mg|glp-?2-tz-40mg/i, glp2tz40],
  [/glp-?2.*30mg|glp-?2-tz-30mg/i, glp2tz30],
  [/glp-?2.*20mg|glp-?2-tz-20mg/i, glp2tz20],
  [/glp-?2.*10mg|glp-?2-tz-10mg/i, glp2tz10],
  [/glp-?2/i, glp2tz10],
  [/glp-?3.*60mg/i, glp3rt60],
  [/glp-?3.*50mg/i, glp3rt50],
  [/glp-?3.*40mg/i, glp3rt40],
  [/glp-?3.*30mg/i, glp3rt30],
  [/glp-?3.*20mg/i, glp3rt20],
  [/glp-?3.*10mg/i, glp3rt10],
  [/glp-?3/i, glp3rt10],
  [/pinealon/i, pinealon],
  [/\bvip-?10\b|\bvip\b/i, vip10],
  [/mazdutide/i, mazdutide],
  [/foxo-?4/i, foxo4],
  [/glutathione.*1500mg/i, glutathione1500],
  [/survodutide/i, survodutide],
  [/cjc.*with\s*dac|cjc-?dac|cjc\s*\+\s*dac/i, cjcWithDac],
  [/cjc.*without\s*dac|cjc.*no\s*dac|cjc-?nodac/i, cjcNoDac],
  [/blend\s*cjc\/ipamorelin|cjc.*ipa|ipamorelin.*cjc|2x-cjc-ipa/i, cjcIpaBlend],
  [/\bipamorelin\b/i, ipamorelin],
  [/tesamorelin.*20mg/i, tesamorelin20],
  [/tesamorelin/i, tesamorelin],
  [/sermorelin/i, sermorelin],
  [/kisspeptin/i, kisspeptin],
  [/hexarelin/i, hexarelin],
  [/\bhcg\b|chorionic\s+gonadotropin/i, hcg10000],
  [/pnc-?27/i, pnc27],
  [/ss-?31/i, ss31],
  [/ghrp-?6/i, ghrp6],
  [/\bhmg\b/i, hmg],
  [/thymosin\s*alpha\s*1|\bta1\b|\bta-?1\b/i, ta1],
  [/thymalin/i, thymalin],
  [/dsip/i, dsip],
  [/snap-?8/i, snap8],
  [/wolverine.*20mg|wolverine-?20/i, wolverine20],
  [/wolverine/i, wolverine],
  [/glow/i, glowBlend],
  [/\bklow\b/i, klowBlend],
  [/ghk-?cu.*100mg|ghk-cu-100mg/i, ghkcu100],
  [/ghk-?cu|\bghk\b/i, ghkcu],
  [/mots-?c.*40mg/i, motsc],
  [/mots-?c|\bmots\b/i, motsc],
  [/tb-?500.*10mg/i, tb500],
  [/tb-?500|thymosin\s*beta/i, tb500],
  [/selank/i, selank],
  [/semax/i, semax],
  [/melanotan/i, melanotan2],
  [/slu-?pp-?332|slupp332/i, slupp332],
  [/gdf-?8|myostatin/i, gdf8],
  [/ll-?37/i, ll37],
  [/\blpv\b/i, lpv],
  [/\bkpv\b|lysine[-\s]*proline[-\s]*valine/i, kpv10],
  [/igf-?des|igf\s*des/i, igfdes],
  [/igf-?1\s*lr3.*0\.?1mg|igf-?1-?lr3-?0/i, igf1lr3Small],
  [/igf-?1\s*lr3|igf-1-lr3/i, igf1lr3],
  [/n[-\s]*acetyl[-\s]*epitalon|na[-\s]*epitalon/i, naEpitalon5],
  [/epitalon.*50mg|epithalon.*50mg/i, epitalon50],
  [/epitalon|epithalon/i, epitalon10],
  [/nad\+.*500mg/i, nad500],
  [/nad\+/i, nad1000],
  [/glutathione/i, glutathione],
  [/pt-?141/i, pt141],
  [/8x|lipotropic/i, blend8x],
  [/4x|mic|stack|blend/i, blend4x],
];

export function vialImageFor(name: string, slug?: string): string {
  const haystack = `${name} ${slug ?? ""}`;
  for (const [re, img] of RULES) {
    if (re.test(haystack)) return img;
  }
  return vialDefault;
}

const FORCED_OVERRIDE_MAP: Array<[RegExp, string]> = [
  [/\bklow\b/i, klowBlend],
  [/\bglow\b/i, glowBlend],
  [/\bkpv\b|lysine[-\s]*proline[-\s]*valine/i, kpv10],
  [/n[-\s]*acetyl[-\s]*epitalon|na[-\s]*epitalon/i, naEpitalon5],
];

export function forcedVialImage(name: string, slug?: string): string | null {
  const haystack = `${name} ${slug ?? ""}`;
  for (const [re, img] of FORCED_OVERRIDE_MAP) {
    if (re.test(haystack)) return img;
  }
  return null;
}

export function variantVialImage({
  name,
  slug,
  size,
  fallbackSrc,
}: {
  name: string;
  slug?: string;
  size?: string | null;
  fallbackSrc?: string;
}): string {
  const sizedLocal = slug && size ? productImageByFileName(`${slug}-${normalizeImageToken(size)}.png`) : null;
  const forced = forcedVialImage(name, slug);
  const exactLocal = slug ? productImageByFileName(`${slug}.png`) : null;

  return sizedLocal ?? forced ?? exactLocal ?? fallbackSrc ?? vialImageFor(name, slug);
}
