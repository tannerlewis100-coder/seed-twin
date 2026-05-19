## Goal

Use the newly uploaded SS-37 vial image (on the textured tan/sand background) for the top-left image in the "Receipts, not claims." section — **desktop only**. Mobile keeps the current image.

## Changes

1. **Copy uploaded asset** to `public/quality-ss37-desktop.png`.

2. **Edit `src/routes/index.tsx`** (top-left tile of the Receipts collage, around line 268–279):
   - Replace the single `<img src={qualitySs37} />` with a `<picture>` element:
     - `<source media="(min-width: 1024px)" srcSet="/quality-ss37-desktop.png" />` (new image on desktop, matches Tailwind `lg:` breakpoint where the collage layout kicks in)
     - `<img src={qualitySs37} ... />` as the fallback (current image on mobile/tablet)
   - Keep all existing attributes: width, height, alt, loading, decoding, fetchPriority, className.

## Out of scope

- No changes to the other two collage images.
- No changes to copy, layout, or other sections.
- No changes to the sign-in page.
