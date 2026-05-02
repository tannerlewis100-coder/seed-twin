# Mobile Optimization Plan

## The big problem first

**There is no mobile menu.** Right now, the nav links (Shop, COA Library, About, FAQ) and Sign In are all `hidden md:flex` — meaning on phones, users see only the logo and a "Get Started" button. They can't navigate anywhere except the homepage and shop. This is the #1 fix.

## What I'll change

### 1. SiteHeader — add a real mobile menu
- Add a hamburger icon (visible `md:hidden`) on the right side of the header pill, next to or instead of "Get Started" on mobile
- Tapping it opens a full-screen slide-down sheet with: Shop, COA Library, About, FAQ, Sign in / Sign out, and the "Get Started" CTA
- Close on tap-outside, on link click, and on a top-right X
- Lock body scroll while open
- Keep the floating pill style, but make the pill row use less horizontal padding on mobile so it doesn't crowd the edges

### 2. Announcement bar
- Currently "Every batch tested. Every COA published." + "View the COA Library →" sit on one line and wrap awkwardly on 390px viewports
- On mobile: stack the link below the message, or show only the headline and drop the link (the COA library is in the menu)

### 3. Hero section overlap
- Hero CTA buttons currently sit too close to the floating header pills, causing visual overlap when scrolling
- Increase top padding on the hero on mobile (`pt-24` minimum) so the floating pill row doesn't visually clip the badge / headline
- Reduce h1 from `text-[44px]` on mobile — push to `text-[40px]` with tighter `leading-[1.05]` so the headline fits cleanly on 360–390px screens
- Stack CTAs full-width on mobile instead of side-by-side

### 4. Image collage section
- Lines 270–310 of `index.tsx` use a fixed-height (`h-[520px]`) 12-column grid that gets crammed on mobile
- On mobile: collapse the collage to a single 2-column grid of the 4 images (or just 2 stacked), drop the fixed height, let images flow naturally

### 5. Typography & spacing pass on all routes
- Many headings use `text-4xl md:text-5xl lg:text-[56px]` — fine, but check that the mobile size doesn't overflow on the smallest screens. Drop a step where needed.
- Section vertical padding: `py-24 lg:py-32` is too tall on mobile. Change to `py-16 md:py-24 lg:py-32`
- Stat grid (`grid-cols-2 md:grid-cols-4`) is fine, but check number sizes don't crowd
- Audit horizontal padding: standardize on `px-5 md:px-6 lg:px-10` instead of mixing

### 6. Footer
- Check column stacking, link tap targets (need `min-h-[44px]` for accessibility)

### 7. Buttons & forms
- Hero buttons, CTA buttons → make `w-full` on mobile, side-by-side from `sm:` up
- Promo popup already responsive, no change needed
- Sign-in / Sign-up forms: verify input field padding and button sizes on mobile

### 8. Other routes (about, shop, contact, faq, coa-library, disclaimer)
- Apply same audit: section padding, headline sizes, grid column counts, button widths
- Most heavy lifting is in the shared header — fixing that alone unlocks navigation on every page

## Files to edit
- `src/components/SiteHeader.tsx` — add mobile menu, fix announcement bar
- `src/routes/index.tsx` — hero spacing, collage layout, section padding, button widths
- `src/routes/about.tsx`, `shop.tsx`, `contact.tsx`, `faq.tsx`, `coa-library.tsx`, `disclaimer.tsx` — section padding + heading sizes pass
- `src/components/SiteFooter.tsx` (or `src/components/ui/footer.tsx`) — tap target sizes, column stacking
- `src/components/SignInForm.tsx` — mobile spacing pass

## Out of scope
- No content/copy changes (voice and copy are dialed in, leaving them alone)
- No design system / color token changes
- No new routes or features

Approve and I'll implement the whole pass.