# Bug 05 — Admin "Log out" button appears below the top nav instead of inside it

## Status

Open.

## Summary

The "Log out" button on the Admin sections appears below the Top nav, but it
should be in the same position as on the regular logged-in pages — in the top
nav bar on the far right.

## Symptom (reported by user)

1. Sign in to an Admin section.
2. The "Log out" button appears below the Top nav rather than inside it.
3. On the regular logged-in pages, "Log out" appears in the top nav bar on the
   far right.
4. Expected: Admin "Log out" is positioned identically — in the top nav bar on
   the far right.

## Environment

- Web app: English/Hebrew Language Tutor (sprint-03).
- Admin layout/nav in `frontend/`.
- Repro: sign in as Admin and view the Admin section.

## Reproduction

- Sign in to an Admin section.
- Observe that "Log out" renders below the Top nav, not in the top nav bar on
  the far right as on the regular logged-in pages.