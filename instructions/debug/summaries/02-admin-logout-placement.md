# Summary: Bug Fixer (Stage 2)

- **Date:** 2026-08-29
- **Author / Executor:** Bug Fixer (Stage 2 role)
- **Instruction file:** `instructions/debug/02-fix-bug.md`
- **Bug report:** `bugs/05-admin-logout-placement.md`
- **Commit:** `debug 02: fix the five sprint-03 bugs`

## Work Completed

Made the top-nav "Log out" (`#logoutBtn`) the single logout for Admin sections,
positioned on the far right as on the regular logged-in pages, and removed the
embedded Admin-panel logout button.

## Outputs Produced / Modified

- `frontend/js/app.js` — modified: `updateUserBadge()` toggles `#logoutBtn` on
  `currentUser || adminToken`; `goAdmin()` now calls `updateUserBadge()` after
  `adminToken` is set.
- `frontend/js/views.js` — modified: removed the `#adminLogout` button and its
  `onLogout` wiring from `adminPanel()`.
- `bugs/05-admin-logout-placement.md` — modified: appended a "Fix Implementation
  (Stage 2)" section and set `Status` to `Fixed`.
- `instructions/debug/summaries/02-admin-logout-placement.md` — new: this summary.

## Key Decisions

- Added an `updateUserBadge()` call in `goAdmin()` (companion change approved by
  the human) — previously it was only called on learner sign-in and logout, so
  without it the top-nav logout would not have appeared for admins.
- Left `adminCallbacks().onLogout` in place; it is now unused by `adminPanel()`
  but remains valid, so no further wiring was removed.

## Open Questions & Concerns

Human confirmation pending in a real browser: Admin sections should show "Log out"
in the top nav on the far right and no longer below the nav. No code concerns
remain.

## Status

- [x] Complete
- [ ] Needs review