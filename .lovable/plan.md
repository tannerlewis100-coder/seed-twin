## Why you don't see it

The gate is already wired into `__root.tsx` and renders for every route. It's hidden for you because your browser has `clarum_age_verified = "1"` in `localStorage` from a previous visit, so the component returns `null` immediately.

Two ways to force it to show again — pick one:

### Option A (recommended): Bump the storage key

Change `STORAGE_KEY` in `src/components/AgeGate.tsx` from `clarum_age_verified` to `clarum_age_verified_v2`. Because we just added the new researcher confirmation, every existing visitor (including you) is treated as not-yet-verified and sees the updated modal on next load. Future visits remain remembered like before.

### Option B: Per-session only

Switch from `localStorage` to `sessionStorage` so the gate reappears every time the browser tab is reopened. More aggressive — frequent shoppers will see it often.

## My recommendation

Go with **Option A**. It guarantees the new researcher checkbox is shown to everyone exactly once, then stays out of the way. No other files change.

Confirm which option you want and I'll ship it.
