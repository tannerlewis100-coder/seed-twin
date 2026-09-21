/**
 * Product detail page information sections.
 *
 * Pure data helpers so the collapsed-by-default behaviour and the
 * "never invent a field" rule are testable without a DOM.
 */

/** The certificate panel on product pages is always closed on first render. */
export const COA_INITIALLY_OPEN = false;

export type InfoSectionId = "description" | "specifications" | "shipping";

export type SpecRow = { label: string; value: string };

export type InfoSection = { id: InfoSectionId; label: string };

export const INFO_SECTIONS: InfoSection[] = [
  { id: "description", label: "Description" },
  { id: "specifications", label: "Specifications" },
  { id: "shipping", label: "Shipping & Returns" },
];

/** Every bottom info row starts collapsed; each opens independently. */
export function initialSectionState(): Record<InfoSectionId, boolean> {
  return { description: false, specifications: false, shipping: false };
}

export function buildInfoSections(_input: {
  description: string;
  specs: SpecRow[];
}): InfoSection[] {
  return INFO_SECTIONS;
}

/**
 * Specifications come only from verified WooCommerce data plus the matched
 * certificate. Empty values are dropped — nothing is inferred or invented.
 */
/**
 * Supplier records whose backend attributes contradict the published
 * certificate (B12 backend "1ml" vs a 10mL labelled vial and 10mL COA; the 4X
 * and 8X blends list per-vial totals against a per-mL concentration COA).
 * Until the backend is authoritatively corrected we render no attribute rows
 * for these SKUs rather than publishing a value we know is disputed.
 */
export const ATTRIBUTE_CONFLICT_SKUS = ["YPB.251", "YPB.268", "YPB.267"] as const;

function isConflicted(sku?: string | null): boolean {
  if (!sku) return false;
  const token = sku.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return ATTRIBUTE_CONFLICT_SKUS.some((s) => s.replace(/[^A-Z0-9]/g, "") === token);
}

export function buildSpecRows(input: {
  sku?: string | null;
  size?: string | null;
  attributes?: Array<{
    name?: string | null;
    value?: string | null;
    option?: string | null;
    terms?: Array<{ name?: string | null }> | null;
  }>;
  coaBatch?: string | null;
}): SpecRow[] {
  const rows: SpecRow[] = [];
  const seen = new Set<string>();

  const push = (label: string, value?: string | null) => {
    const v = (value ?? "").trim();
    if (!v) return;
    const key = `${label.toLowerCase()}|${v.toLowerCase()}`;
    if (seen.has(key) || seen.has(`*|${v.toLowerCase()}`)) return;
    seen.add(key);
    seen.add(`*|${v.toLowerCase()}`);
    rows.push({ label, value: v });
  };

  push("SKU", input.sku);
  const conflicted = isConflicted(input.sku);
  const overrides = specOverridesFor(input.sku);
  if (overrides) {
    for (const [label, value] of overrides) push(label, value);
    push("Report batch", input.coaBatch);
    return rows;
  }
  if (!conflicted) push("Strength", input.size);

  if (!conflicted) {
    for (const attr of input.attributes ?? []) {
      const name = (attr?.name ?? "").trim();
      const terms = (attr?.terms ?? [])
        .map((t) => (t?.name ?? "").trim())
        .filter(Boolean)
        .join(", ");
      const value = (attr?.value ?? attr?.option ?? "").trim() || terms;
      if (!name || !value) continue;
      if (/^(size|strength)$/i.test(name)) {
        // Simple products carry their strength as an attribute term; variable
        // products already pushed the selected variation strength above.
        if (!input.size) push("Strength", value);
        continue;
      }
      push(name, value);
    }
  }

  push("Report batch", input.coaBatch);
  return rows;
}
