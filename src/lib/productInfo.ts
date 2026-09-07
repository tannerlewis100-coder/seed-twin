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
export function buildSpecRows(input: {
  sku?: string | null;
  size?: string | null;
  attributes?: Array<{ name?: string | null; value?: string | null; option?: string | null }>;
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
  push("Strength", input.size);

  for (const attr of input.attributes ?? []) {
    const name = (attr?.name ?? "").trim();
    const value = (attr?.value ?? attr?.option ?? "").trim();
    if (!name || !value) continue;
    if (/^(size|strength)$/i.test(name)) continue;
    push(name, value);
  }

  push("Report batch", input.coaBatch);
  return rows;
}
