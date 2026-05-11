## Goal

On the shop, every peptide that exists in multiple sizes (BPC-157 5/10/20mg, TB-500 5/10mg, Tesamorelin 10/20mg, GHRP-6 5/10mg, IGF-1 LR3, Epitalon, MOTS-c, SS-31, GHK-Cu, DSIP, 5-Amino-1MQ, NAD+, Glutathione, Reconstitution Water, Wolverine Blend) collapses into one card. Clicking that card opens a modal with the vial visual, the long-form description, and a size picker that swaps price, batch, purity and the linked COA.

## Behavior

1. **Grouping (shop only, data file unchanged)**
   - In `src/routes/shop.tsx`, build groups by `${name}__${category}` from `allPeptides`.
   - Render one card per group. Card shows the group's lowest price as "Starting at $X" and a "+N sizes" pill when the group has more than one variant.
   - Filters and search keep working against the underlying peptides (search matches if any variant in the group matches).

2. **Card click opens modal (no route change)**
   - Replace the current `<Link to="/coa-library">` wrapper with a button that sets the active group in local state.
   - Modal built with the existing shadcn `Dialog` component.

3. **Modal contents**
   - Left: enlarged vial visual reusing the same CSS vial markup from the shop card (cap, bottle, CLARUM label, dynamic short-code + size).
   - Right:
     - Category pill, name, short purity/batch line.
     - Long description from `peptide.description`.
     - Size selector: pill buttons, one per variant, sorted by price asc. Selecting a size updates: price, batch, purity, COA link, and the size text inside the vial.
     - Primary CTA: "View COA" — links to `peptide.coaUrl` (new tab) when present, otherwise routes to `/coa-library`.
     - Secondary line: "For in vitro laboratory research only."
   - If the variant is in `COMING_SOON_SLUGS`, the COA button shows "Coming soon" and is disabled.

4. **Empty state and counts**
   - "Showing N products" reflects group count, not variant count.
   - No-results copy unchanged.

## Files touched

- `src/routes/shop.tsx` — group peptides, render one card per group, manage modal state, render modal.
- `src/components/ProductDetailModal.tsx` (new) — the dialog with vial + size selector, takes a `group: Peptide[]` prop.

No changes to `src/data/peptides.ts`, header, footer, or other routes. The COA library page stays as-is.

## Out of scope

- No add-to-cart, no new product route, no new images.
- Homepage featured grid keeps using its current `featuredPeptides` (still works since slugs are intact).
