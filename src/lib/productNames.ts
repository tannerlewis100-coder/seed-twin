/**
 * Display naming for product surfaces. The BPC-157 / TB-500 blend is sold and
 * labelled as WOLVERINE BLEND on the vial, so every surface (cards, quick
 * view, product page, cart lines and metadata) shows that name while keeping
 * the compound names visible.
 */
const WOLVERINE_DISPLAY = "Wolverine Blend — BPC-157 / TB-500";

const WOLVERINE_MATCH = /wolverine|bpc-?\s*157\s*[\/+&]\s*tb-?\s*500/i;

/** True for the standalone blend product, not for KLOW / GLOW multi-blends. */
function isWolverineBlend(name: string, slug?: string | null): boolean {
  const haystack = `${name} ${slug ?? ""}`;
  if (/\bklow\b|\bglow\b/i.test(haystack)) return false;
  return WOLVERINE_MATCH.test(haystack);
}

export function displayProductName(name?: string | null, slug?: string | null): string {
  const raw = (name ?? "").trim();
  if (!raw) return raw;
  if (isWolverineBlend(raw, slug)) return WOLVERINE_DISPLAY;
  return raw;
}
