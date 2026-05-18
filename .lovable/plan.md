## Goal

Replace the black CSS-mocked vial on the GHK-Cu (and all other) shop cards and in the product detail modal with the real vial photos you uploaded, animated as a true 360° rotation by cycling the 4 angles.

## Assets

Copy the 4 uploads into `src/assets/vial/`:
- `vial-1.png` (front — label visible)
- `vial-2.png` (3/4 turn)
- `vial-3.png` (back — fine print)
- `vial-4.png` (other 3/4 turn)

Order them front → right → back → left so the rotation reads as a continuous spin.

## New component: `Vial360.tsx`

A small client component that swaps the 4 frames on an interval to simulate rotation.

- Preloads all 4 images on mount.
- Uses `setInterval` (~150ms per frame = full spin every ~600ms; we can tune).
- Renders one `<img>` with a soft drop shadow, no background.
- Accepts `size` prop (e.g. `sm` for shop cards, `lg` for the modal).
- Pauses on `prefers-reduced-motion` and shows just the front frame.
- Optional: pause when card is off-screen using `IntersectionObserver` to save CPU.

## Wire it in

1. **`src/routes/shop.tsx`** — replace the CSS vial block (around lines 150–160, the `<span>CLARUM</span>` / `RESEARCH USE ONLY` mock) with `<Vial360 size="sm" />`. Keep the surrounding card/gradient backdrop.
2. **`src/components/ProductDetailModal.tsx`** — replace the mocked vial block (lines ~36–50) with `<Vial360 size="lg" />`. Keep the green gradient panel behind it.

Same component, same 4 photos in both places — every product uses the same vial visual (matches how the current mock works).

## Notes

- All vials in the catalog currently render the same generic mock, so using one shared spinning vial is consistent with existing behavior.
- No data changes, no route changes, no backend work.
- Pure frontend / presentation.

## Files touched

- add: `src/assets/vial/vial-1.png … vial-4.png`
- add: `src/components/Vial360.tsx`
- edit: `src/routes/shop.tsx`
- edit: `src/components/ProductDetailModal.tsx`
