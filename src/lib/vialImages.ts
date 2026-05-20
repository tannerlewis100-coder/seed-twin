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

export const DEFAULT_VIAL = vialDefault;

const RULES: Array<[RegExp, string]> = [
  [/cagrilintide.*glp|cagri.*glp/i, cagriGlp],
  [/glp-?1\s*s/i, glp1s],
  [/glp-?2/i, glp2tz],
  [/glp-?3/i, glp3rt],
  [/cjc.*without\s*dac|cjc.*no\s*dac|cjc-?nodac/i, cjcNoDac],
  [/blend\s*cjc\/ipamorelin|cjc.*ipa|ipamorelin.*cjc|2x-cjc-ipa/i, cjcIpaBlend],
  [/tesamorelin/i, tesamorelin],
  [/pnc-?27/i, pnc27],
  [/ss-?31/i, ss31],
  [/ghrp-?6/i, ghrp6],
  [/thymosin\s*alpha\s*1|\bta1\b|\bta-?1\b/i, ta1],
  [/dsip/i, dsip],
  [/snap-?8/i, snap8],
  [/wolverine/i, wolverine],
  [/glow/i, glowBlend],
  [/8x|lipotropic|klow/i, blend8x],
  [/4x|mic|stack|blend/i, blend4x],
];

export function vialImageFor(name: string, slug?: string): string {
  const haystack = `${name} ${slug ?? ""}`;
  for (const [re, img] of RULES) {
    if (re.test(haystack)) return img;
  }
  return vialDefault;
}
