import vialDefault from "@/assets/vial/vial-1.png";
import glp1s from "@/assets/products/glp1-s-20mg.png";
import blend4x from "@/assets/products/blend-4x.png";
import blend8x from "@/assets/products/blend-8x.png";
import ss31 from "@/assets/products/ss31-10mg.png";
import cjcNoDac from "@/assets/products/cjc-no-dac.png";
import tesamorelin from "@/assets/products/tesamorelin.png";
import dsip from "@/assets/products/dsip.png";
import glp3rt from "@/assets/products/glp3-rt.png";
import glp2tz from "@/assets/products/glp2-tz-40mg.png";
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
import epitalon from "@/assets/products/epitalon.png";
import sermorelin from "@/assets/products/sermorelin-10mg.png";
import hmg from "@/assets/products/hmg-75iu.png";
import glp2tz20 from "@/assets/products/glp2-tz-20mg.png";
import glp2tz50 from "@/assets/products/glp2-tz-50mg.png";
import klowBlend from "@/assets/products/klow-blend.png";
import igf1lr3 from "@/assets/products/igf1lr3-1mg.png";
import nad1000 from "@/assets/products/nad-1000mg.png";
import glutathione from "@/assets/products/glutathione-600mg.png";
import pt141 from "@/assets/products/pt141-10mg.png";

export const DEFAULT_VIAL = vialDefault;

const RULES: Array<[RegExp, string]> = [
  [/cagrilintide.*glp|cagri.*glp/i, cagriGlp],
  [/glp-?1\s*s/i, glp1s],
  [/glp-?2.*50mg|glp-?2-tz-50mg/i, glp2tz50],
  [/glp-?2.*20mg|glp-?2-tz-20mg/i, glp2tz20],
  [/glp-?2/i, glp2tz],
  [/glp-?3/i, glp3rt],
  [/cjc.*with\s*dac|cjc-?dac|cjc\s*\+\s*dac/i, cjcWithDac],
  [/cjc.*without\s*dac|cjc.*no\s*dac|cjc-?nodac/i, cjcNoDac],
  [/blend\s*cjc\/ipamorelin|cjc.*ipa|ipamorelin.*cjc|2x-cjc-ipa/i, cjcIpaBlend],
  [/tesamorelin/i, tesamorelin],
  [/sermorelin/i, sermorelin],
  [/pnc-?27/i, pnc27],
  [/ss-?31/i, ss31],
  [/ghrp-?6/i, ghrp6],
  [/\bhmg\b/i, hmg],
  [/thymosin\s*alpha\s*1|\bta1\b|\bta-?1\b/i, ta1],
  [/dsip/i, dsip],
  [/snap-?8/i, snap8],
  [/wolverine/i, wolverine],
  [/glow/i, glowBlend],
  [/\bklow\b/i, klowBlend],
  [/ghk-?cu.*100mg|ghk-cu-100mg/i, ghkcu100],
  [/ghk-?cu|\bghk\b/i, ghkcu],
  [/mots-?c|\bmots\b/i, motsc],
  [/tb-?500|thymosin\s*beta/i, tb500],
  [/semax/i, semax],
  [/igf-?1\s*lr3|igf-1-lr3/i, igf1lr3],
  [/epitalon|epithalon/i, epitalon],
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
