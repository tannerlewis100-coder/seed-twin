## Goal
Replace the current 8-product placeholder dataset with the full Clarum catalog (~70 products across 11 categories) from the sister project `Clarum Website Build`, and wire up real per-batch COA images into the existing COA Library layout.

## 1. Expand the data layer (`src/data/peptides.ts`)

Rewrite this file to mirror the source-of-truth data model from the other project, while staying compatible with our current `shop.tsx`, `coa-library.tsx`, and `index.tsx` (Featured) consumers.

New shape:

```ts
export type CoaData = {
  purity: string;       // e.g. "99.5%"
  assay: string;        // e.g. "5.00mg"
  identity: "Confirmed";
  heavyMetals: "<20ppb";
  tamc: "0 CFU";
  tymc: "0 CFU";
  sku: string;
  date: string;
  form: string;
};

export type Peptide = {
  slug: string;            // unique id (was `id` in the other project)
  name: string;
  size: string;            // dosage
  category: string;        // "Recovery" | "Growth Hormone" | ... | "Supplies"
  price: number;
  badge?: string;          // "BEST SELLER", "NEW", etc.
  batch: string;           // coaBatch
  purity: string;          // mirrors coa.purity for backwards-compat
  description: string;     // pulled from descriptions.ts (with sensible fallback)
  coa: CoaData;
  coaImage?: string;       // /coa/<file>.png — present when we have an image
  coaUrl?: string;         // external Drive folder fallback
};
```

Add the full ~70-product list (Recovery, Growth Hormone, Longevity, Skin, Cognitive, Immune, Weight Management, NAD+, Sexual Health, Blends, Supplies). Keep `slug` as the source `id` so existing routes and the `key={p.slug}` loops keep working.

Also export:
- `categories` — the 11-category list with display names + slugs (used for the new filter bar).
- `featuredPeptides` — the 8 IDs already curated on the homepage of the other project: `bpc-157-10mg`, `tb-500-10mg`, `epitalon-10mg`, `mots-c-10mg`, `ghk-cu-50mg`, `nad-500mg`, `klow-blend`, `wolverine-10mg`.
- Keep `sampleCoa(p)` returning the same 5 rows, but now derived from `p.coa` (HPLC Purity = `coa.purity`, Mass Spec ID = `coa.identity`, Heavy Metals = `coa.heavyMetals`, Microbial = `coa.tamc`, Endotoxin = `< 1 EU/mg` static).

Long descriptions get pulled from the other project's `descriptions.ts` keyed by base slug (e.g. `bpc-157`, `ghk-cu`). Variants share their parent description. Anything missing falls back to the existing short blurb pattern.

## 2. Copy COA images into `/public/coa/`

Use `cross_project--copy_project_asset` to bring over the ~50 PNG certificates from `Clarum Website Build/public/coa/` into our `public/coa/` directory. Files to copy (one call each):

`BPC-157-(5mg).png`, `BPC-157-(10mg).png`, `BPC-157-(20mg).png`, `TB-500-(5mg).png`, `TB-500-(10mg).png`, `Wolverine-Blend-(5mg5mg).png`, `Wolverine-Blend-(10mg10mg).png`, `LL37.png`, `Sermorelin.png`, `CJC-1295-Without-DAC.png`, `CJC-1295-With-DAC.png`, `2X-Blend-CJCIpamorelin.png`, `Ipamorelin.png`, `GHRP-6-Acetate.png`, `Hexarelin-Acetate.png`, `GDF-8.png`, `ACE-031.png`, `Epitalon-(10mg).png`, `MOTS-c.png`, `SS-31-(10mg).png`, `SS-31-(50mg).png`, `FOXO4.png`, `GHK-Cu-(50mg).png`, `GHK-Cu-(100mg).png`, `GLOW.png`, `KLOW.png`, `Melanotan-2.png`, `Semax.png`, `Selank.png`, `DSIP-(5mg).png`, `DSIP-(15mg).png`, `Thymosin-Alpha-1.png`, `KPV.png`, `5-Amino-1MQ-(5mg).png`, `5-Amino-1MQ-(50mg).png`, `AOD-9604.png`, `Cagrilintide.png`, `Mazdutide.png`, `SLU-PP-332.png`, `NAD+-(500mg).png`, `NAD+-(1000mg).png`, `Glutathione.png`, `KissPeptin.png`, `4X-Blend.png`, `8X-Blend.png`, `B12.png`.

Note: the source uses `NAD+-(500mg).png` literally — keep the `+` in the filename and URL-encode in the `coaImage` field (`/coa/NAD%2B-(500mg).png`).

## 3. Update the COA Library page (`src/routes/coa-library.tsx`)

Keep the existing dark "row card" layout the user already approved (gold accent header, 5-cell test grid on the right, RevealOnScroll stagger). Two enhancements:

1. **Render the actual COA image** when `peptide.coaImage` exists — collapsed by default with a "View Certificate" button that expands a panel showing the PNG (white background, rounded, max-height ~700px, click-to-enlarge modal). Falls back to the current static row when no image is available, and shows a "Coming Soon" badge in place of "Pass" for the handful of products without lab data (`aicar`, `glp-3-rz`, `hcg`, `hmg`, `igf-1-lr3-*`, `igf-des`, `recon-water-*`).
2. **Add a category filter bar + search input** above the list (chips styled with `brand-gold` accents to match site theme). Drives a memoized filter on the existing `peptides` array.

The Download PDF button becomes "Open Full Report" linking to `coaUrl` when present (Google Drive), hidden otherwise.

## 4. Update Shop (`src/routes/shop.tsx`)

- Surface all ~70 products in the existing 4-column card grid.
- Add a category dropdown/chip row using the new `categories` export so the catalog is browsable (currently there is no filter — with 70 items it needs one).
- Show the `badge` ("BEST SELLER" etc.) when present, in the same gold pill style already used for the `tag` field.
- No visual redesign of the card itself — just more data flowing in.

## 5. Update homepage Featured section (`src/routes/index.tsx`)

Swap the current `peptides.slice(0,4)` (or similar) for `featuredPeptides`, so the homepage showcases the curated 8 (BPC-157, TB-500, Epitalon, MOTS-c, GHK-Cu, NAD+, KLOW, Wolverine) that the other Clarum site already uses. Keep the Seed-style card design we just built.

## 6. Verification

- `bun run build` to confirm types are clean and every imported asset path resolves.
- Spot-check 3 COA cards in the preview (one with image, one Drive-only, one Coming Soon) to confirm layout.

## Out of scope
- No e-commerce / cart wiring (the Shopify integration is not enabled here).
- No new ProductDetail route — that can be a follow-up if you want individual product pages.
- The `_v2` jpg product photos from the source aren't copied; product cards stay text-only as they are today.
