## Why it looks blurry on desktop

Last turn I regenerated the four "Receipts, not claims" images as crisp JPGs, but `src/routes/index.tsx` still imports the **old PNGs** (`quality-ss37.png`, `quality-semax.png`, `quality-tb500-box.png`, `quality-trio.png`). Those original PNGs were softly rendered by the first image pass — on iPad the collage tiles are physically smaller so the softness hides, but on a desktop monitor each tile is rendered at ~400–600px wide and the softness becomes obvious.

The new sharp files (`quality-*.jpg`) are sitting unused in `src/assets/`.

## Fix

1. In `src/routes/index.tsx` (lines 29–32), change the four imports from `.png` to `.jpg`:
   - `quality-ss37.png` → `quality-ss37.jpg`
   - `quality-semax.png` → `quality-semax.jpg`
   - `quality-tb500-box.png` → `quality-tb500-box.jpg`
   - `quality-trio.png` → `quality-trio.jpg` (need to generate this one — only the .png exists today)
2. Generate the missing `src/assets/quality-trio.jpg` at premium quality (1600×1024) to match the others.
3. Delete the four old `.png` files from `src/assets/` so the bundle drops ~9 MB.

No layout, markup, or component changes — just swapping the asset source.
