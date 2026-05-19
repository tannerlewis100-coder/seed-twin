## Goal

Center the sign-in form on the page. Remove the split-screen layout. Photo becomes a true full-width background; form sits in a contained panel in the middle.

## Changes

**File:** `src/components/SignInForm.tsx`

1. Remove the empty right `<aside>` and the two-column flex layout in `<main>`.
2. Make `<main>` a single centered container — flex, items-center, justify-center, full width.
3. Keep the background image + dark overlay covering all of `<main>`.
4. Wrap the form content in a centered panel:
   - `max-w-md`, mx-auto
   - Solid black background (matches the inputs/buttons already in place)
   - Subtle border (`border-white/10`), rounded-2xl, generous padding
   - Slight drop shadow for separation from the photo
5. Keep all existing form internals as-is: logo, heading, email, password, "Keep me signed in" + reset, Sign In button, divider, Google, Apple, footer link.

## Out of scope

- No copy changes.
- No changes to inputs, buttons, or auth logic.
- Header, announcement bar, footer untouched.
- Sign-up page automatically inherits the same layout (same component).
