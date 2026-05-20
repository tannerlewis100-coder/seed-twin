import vialDefault from "@/assets/vial/vial-1.png";
import glp1s from "@/assets/products/glp1-s-20mg.png";
import blend4x from "@/assets/products/blend-4x.png";
import blend8x from "@/assets/products/blend-8x.png";
import ss31 from "@/assets/products/ss31.png";
import cjcNoDac from "@/assets/products/cjc-no-dac.png";
import tesamorelin from "@/assets/products/tesamorelin.png";
import dsip from "@/assets/products/dsip.png";
import glp3rt from "@/assets/products/glp3-rt.png";
import glp2tz from "@/assets/products/glp2-tz.png";
import snap8 from "@/assets/products/snap8.png";

export const DEFAULT_VIAL = vialDefault;

// Match by lowercased product name. Order matters — first match wins.
const RULES: Array<[RegExp, string]> = [
  [/glp-?1\s*s/i, glp1s],
  [/glp-?2/i, glp2tz],
  [/glp-?3/i, glp3rt],
  [/cjc.*without\s*dac|cjc.*no\s*dac|cjc-?nodac/i, cjcNoDac],
  [/tesamorelin/i, tesamorelin],
  [/ss-?31/i, ss31],
  [/dsip/i, dsip],
  [/snap-?8/i, snap8],
  [/8x|lipotropic|wolverine|klow/i, blend8x],
  [/4x|blend|mic|stack|glow/i, blend4x],
];

export function vialImageFor(name: string, slug?: string): string {
  const haystack = `${name} ${slug ?? ""}`;
  for (const [re, img] of RULES) {
    if (re.test(haystack)) return img;
  }
  return vialDefault;
}
