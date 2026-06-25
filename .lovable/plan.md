## Match the age gate's layout to the sign-up popup

Both modals are now visually similar, but they're not the same size or footprint. The sign-up promo is wider (`md:max-w-3xl`) and its image panel has more presence. The age gate currently sits at `md:max-w-2xl` with a smaller image side, so it lands in a slightly different "spot" on the page.

### Change in `src/components/AgeGate.tsx`

- Match outer container width to `md:max-w-3xl` (same as `PromoPopup`).
- Match the image panel min-height to `md:min-h-[480px]` (same as `PromoPopup`).
- Use the same gap/padding rhythm on the content panel: `gap-3.5 p-5 md:gap-5 md:p-10`.
- Keep the gold "Lab access" eyebrow, `font-display` headline, the two required checkboxes, the disabled Enter button, and the "No, take me back" text link — only the geometry changes.

Result: when the age gate clears and the sign-up promo later appears, both modals occupy the exact same rectangle on screen — same width, same height, same image-to-content split. Identical footprint, just different content.

No copy changes, no behavior changes, no sequencing changes.
