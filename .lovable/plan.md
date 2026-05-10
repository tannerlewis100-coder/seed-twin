## Problem

The footer currently shows the full Clarum lockup (icon + "CLARUM Research Peptides" wordmark) at `h-10`. Two issues:

1. The full lockup is wide and text-heavy, so at `h-10` the wordmark text is tiny and hard to read.
2. The giant animated "CLARUM / PURITY / TESTED / TRUSTED" GooeyText sits right below it, so the small wordmark in the lockup is redundant and visually competes with it.

## Fix

Replace the lockup in the footer with just the icon mark (the gold "C" monogram), shown larger and centered with the brand name. The big GooeyText below already serves as the wordmark.

### Changes in `src/components/ui/footer.tsx`

- Add a new `src/assets/clarum-mark.png` containing only the icon (cropped from the existing logo, transparent background).
- Swap the footer `<img>` to use `clarumMark` instead of `clarumLogo`.
- Bump size to `h-14 md:h-16 w-auto` so the mark reads clearly against the dark forest background.
- Keep header untouched (it still uses the full lockup, which makes sense up top).

### Result

Footer brand area: clean gold mark, properly sized, no tiny illegible text fighting with the GooeyText wordmark beneath it.
