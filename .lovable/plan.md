## Plan

1. Update the Wolverine variation filtering in both the product page and quick-view modal so the 40 mg option is removed even when the size comes from Woo fallback data instead of the custom size map.
2. Keep the 20 mg variant wired to the uploaded Wolverine 20 mg product image, and verify the selected size passed into the vial-image resolver matches that override path.
3. Remove the debug logging left in the product page while making the fix so the shop page stays clean.
4. Validate the result in preview on `/shop/wolverine-blend`: only the 10 mg and 20 mg pills remain, and selecting 20 mg shows the uploaded 20 mg bottle image.

## Technical details

- Reuse the existing `getVariationSize()` fallback when filtering Wolverine variants.
- Treat `20mg/20mg` as the hidden option regardless of whether it comes from the custom variation payload or Woo attributes/slug parsing.
- Preserve the existing override in `src/lib/vialImages.ts` for `wolverine-blend|10mg/10mg` and `wolverine-blend|20mg` so the 20 mg selection resolves to the uploaded image.