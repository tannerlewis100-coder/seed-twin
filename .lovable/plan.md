## The overlap

Both sections sit back-to-back on the homepage and both pitch testing/transparency:

- **`QualityCollage`** ("We test what others skip.") — image collage on the left, a 5-item checklist on the right, CTA to the COA Library.
- **`HowTested`** ("Five tests. Every batch. No exceptions.") — 5 numbered cards, one per lab test (HPLC, Mass Spec, Heavy Metals, Microbial, Endotoxin).

The redundancy is real but partial. They repeat the *theme* (testing, transparency, "tests others skip") and the *number five*, but the actual content is different: one is a values/proof checklist with imagery, the other is a concrete breakdown of what the 5 tests are. The checklist in `QualityCollage` is what feels duplicative — items like "Full 5-panel results" and "Heavy metals & endotoxin — tests vendors skip" are exactly what the next section then expands on in detail.

Recommendation: **keep both, but tighten `QualityCollage` so it stops previewing what `HowTested` already shows**. Don't delete either — the imagery + COA-library CTA in `QualityCollage` does work the testing-cards section doesn't, and the detailed test breakdown in `HowTested` is the actual proof.

## Changes (single file: `src/routes/index.tsx`)

**1. Rewrite `QualityCollage` headline + checklist** so it's about *publishing data and batch traceability*, not about which tests get run.

- Headline: change `"We test what\nothers skip."` → `"Receipts, not\nclaims."` (or similar — pivots from "what we test" to "what we publish").
- Replace the 5-item checklist with 4 items focused on transparency/traceability, removing the two that overlap with `HowTested`:
  - Remove: `"Full 5-panel results, published publicly"` (covered by next section)
  - Remove: `"Heavy metals & endotoxin — tests vendors skip"` (covered by next section)
  - Keep: `"Batch-specific COA, not generic certificates"`
  - Keep: `"Independent third-party laboratory"`
  - Keep: `"QR code on every order links to your batch"`
  - Add: `"Public COA library — verify before you order"`

**2. Rewrite `HowTested` intro** so it owns the "what we test" story cleanly.

- Headline stays: `"Five tests. Every batch.\nNo exceptions."`
- Tighten the lead paragraph to drop the "we publish the full report" line (now owned by `QualityCollage`) and focus on the lab/methodology: e.g. `"Each batch is sent to an independent ISO/IEC 17025 accredited laboratory. Here's the full panel we run — every time."`

**3. Reorder for narrative flow** in the `Index` component:

- Currently: `QualityCollage` → `HowTested` → `CoaTeaser`.
- New order: `HowTested` (what we test) → `QualityCollage` (how we prove it) → `CoaTeaser` (browse the proof). This way the page reads: tests → transparency/receipts → library.

## What stays the same

- All imagery, animations, `RevealText` / `RevealOnScroll` behavior.
- The 5 test cards in `HowTested` — content and layout untouched.
- `CoaTeaser` and the existing CTA to `/coa-library`.

## Out of scope

- No styling/design changes beyond the copy edits above.
- No deletions of either section.
- No changes to other routes.
