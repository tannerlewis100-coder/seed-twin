## Mobile issues found

Walked through the homepage at 390×844. Three real problems, plus a couple of small polish items.

### 1. Sticky header overlaps content (highest priority)
The floating header (logo pill + menu pill) sits on top of the page, but section titles and CTAs scroll *under* it with no padding offset. Visible cases:
- "BPC-157" product card title hidden behind logo
- "View the COA Library" announcement button half-covered
- "Shop Catalog" CTA in the bottom section completely hidden behind the logo

**Fix:** Give the sticky header a subtle background/blur on mobile so content underneath is at least readable, *and* nudge first-section top padding so headings don't collide on scroll-stop. Simplest version — add `backdrop-blur` + semi-opaque background to the header pill container on `<sm` so it stops being transparent on dark backgrounds.

### 2. Promo popup has a huge blank black area on mobile
On mobile the popup stacks vertically and shows a 16:9 black box at top where the `promo-vials.png` image should be — image isn't rendering / is empty. Takes up ~40% of the popup before the headline.

**Fix:** Hide the image block entirely on mobile (`hidden md:block`) so the popup opens compact, or shrink to a small banner. Keep the desktop split-screen layout untouched.

### 3. Hero pushes text below the fold
On 390px the hero vials image takes the full viewport and "Research peptides, without the guesswork." only appears after a scroll. The headline is the whole point.

**Fix:** Shrink the hero image height on mobile (e.g. `h-[55vh]` instead of full) and tighten top padding so the headline peeks above the fold.

### Smaller polish (optional, group into same pass)
- Stat row (70+ / 5 / 100% / ≥99%) — gold numbers are nice but the 2×2 grid has uneven vertical rhythm; tighten gap.
- COA cards: right-aligned values (`99.8%`, `<20ppb`) sit tight against the edge — add a hair more right padding.

### Out of scope
- Testimonials (already fixed last turn)
- Product modal — not re-checked here; can audit in a follow-up if you want.

### Files I'd touch
- `src/components/SiteHeader.tsx` — mobile background/blur
- `src/routes/index.tsx` — hero height, section top padding, stat/COA spacing
- `src/components/PromoPopup.tsx` — hide image on mobile

Want me to ship all three, or just #1 and #2?