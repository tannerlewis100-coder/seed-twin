## Shrink the Testimonials Section

Make the "Trusted by people who read the data" section more compact.

### Changes

**1. `src/components/ui/stagger-testimonials.tsx`**
- Reduce the carousel container height from `600px` to `460px`.
- Reduce card sizes from `365 / 290` to `300 / 240` (desktop / mobile).
- Slightly tighten the navigation button size from `h-14 w-14` to `h-11 w-11`.

**2. `src/routes/index.tsx` (Testimonials section)**
- Reduce vertical padding from `py-24 lg:py-32` to `py-16 lg:py-20`.
- Reduce header bottom margin from `mb-14` to `mb-10`.

This trims the overall section height by roughly a third while keeping the staggered card visual intact.