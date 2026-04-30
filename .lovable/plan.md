## Goal
Clean up the shop product cards: remove the COA "test results" panel showing in the background, and fix the title font so it reads cleanly on the dark card.

## Changes (single file: `src/routes/shop.tsx`)

**1. Remove the testing visual from the background**
The mini COA card (Batch number + "● Pass" badge + HPLC Purity bar) currently sits inside each product card as a background layer. Remove it entirely. Keep just the brand gradient (forest → background → black) plus a subtle gold-line texture for depth.

**2. Fix the title font**
The peptide name currently uses `font-display` (Fraunces serif) at `text-2xl`. On a small dark image-style card it reads heavy and inconsistent with the rest of the card. Switch the title to the sans body font: `text-xl font-semibold tracking-tight`, with the size suffix in a lighter weight.

**3. Drop the now-unused import**
Remove `import CoaCard from "@/components/CoaCard"` from `shop.tsx` since nothing on the page references it anymore.

## What stays the same
- Card height, hover lift, dark overlay deepening on hover
- Top meta pills (category badge + HPLC purity)
- Description fade-in on hover, price + "View COA" CTA at the bottom
- Link target (`/coa-library`)

## Out of scope
No changes to `CoaCard` itself (still used on home page, COA library, product detail areas).
