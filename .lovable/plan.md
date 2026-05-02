## What I'll build

A new route at `/promo` — a single landing page built around the uploaded photo of the BPC-157 / GHK-Cu / TB500 vials, offering 10% off a first order with code `CLARUM10`.

The photo gets saved as `src/assets/promo-vials.png` and used as the hero image (and og:image / twitter:image for shares).

## Page structure

```text
┌───────────────────────────────────────────────────────────┐
│ HERO (split, photo right)                                 │
│  ─ "First-order offer" eyebrow                            │
│  H1: "10% off your first order."                          │
│  Sub: one-line, voice-matching                            │
│  [ CODE: CLARUM10  ] [ Copy ]   ← copy-to-clipboard       │
│  [Shop the Catalog →]  [View the COA Library]             │
│                                                           │
│  Right: uploaded photo, rounded card, soft shadow,        │
│         floating "10% Off" gold sticker                   │
│         + 4-cell live countdown (Days/Hours/Mins/Secs)    │
├───────────────────────────────────────────────────────────┤
│ THREE BENEFITS (sm:grid-cols-3)                           │
│  • Same panel, every time (Eurofins, Lancaster, PA)       │
│  • Public batch COA (QR on vial)                          │
│  • Code stacks with nothing (no influencer codes)         │
├───────────────────────────────────────────────────────────┤
│ FINE PRINT (centered, short)                              │
│  Code, one-use rule, bulk-orders note → contact CTA       │
└───────────────────────────────────────────────────────────┘
```

Voice follows the project memory: short fragments mixed with longer lines, no em-dash hand-waves, no triplet headlines, specific details (Eurofins / Lancaster, PA; QR; "first order").

## Technical details

- **Asset**: copy `user-uploads://PNG_image.PNG` → `src/assets/promo-vials.png`, import as ES6 module.
- **Route**: `src/routes/promo.tsx` using TanStack Start file-based routing, with `head()` setting title, description, og:title, og:description, og:image, twitter:image (the vial photo).
- **Header / footer**: reuse `AnnouncementBar`, `SiteHeader`, `SiteFooter`.
- **Copy-to-clipboard**: `navigator.clipboard.writeText("CLARUM10")` with a `sonner` toast confirmation.
- **Countdown**: small `useCountdown` hook with `setInterval(1000)`. Deadline computed at module load: today + 3 days, 23:59:59 local. Cells use tabular-nums.
- **Discount sticker**: pure CSS — circular `bg-brand-gold` badge, rotated -12°, anchored top-left of the photo card.
- **Design tokens only**: `bg-brand-gold`, `text-brand-forest`, `bg-brand-forest-deep`, `text-foreground`, etc. No raw color classes.
- **Reveal animations**: reuse `RevealText` and `RevealOnScroll` for parity with rest of the site.

## Files

- `src/assets/promo-vials.png` (new — the uploaded image)
- `src/routes/promo.tsx` (new)

No other files touched. Header/footer nav not modified — page is reachable via direct link `/promo` (campaign URL). I can add it to nav in a follow-up if you want.

## Out of scope

- Persisting the discount code to a real cart/checkout (no commerce backend wired up yet).
- A/B variants, email capture, or analytics events.
- Adding `/promo` to the main nav or announcement bar.
