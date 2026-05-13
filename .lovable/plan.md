## Plan

1. Copy the two uploads into `src/assets/`:
   - `user-uploads://clarum-tb500-box-3.jpg` → `src/assets/quality-tb500-box.jpg`
   - `user-uploads://clarum-trio-bpc-selank-ghkcu-3.jpg` → `src/assets/quality-trio.jpg`

2. In `src/routes/index.tsx` (`QualityCollage`):
   - Add imports for the two new JPGs.
   - Replace the two dashed "Image coming" placeholder slots with real `<img>` tags styled the same as the SS-37 and SEMAX tiles (same `aspect-[3/4]`, `object-cover`, `srcSet`, `sizes`, eager loading).
   - Order: SS-37, SEMAX, TB500, Trio.

No other changes — copy, layout, and the rest of the page stay as-is.