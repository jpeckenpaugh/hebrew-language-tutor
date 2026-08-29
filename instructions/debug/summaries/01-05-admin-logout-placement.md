# Summary: Bug Investigator (Stage 1)

- **Date:** 2026-08-29
- **Author / Executor:** opencode (Bug Investigator role)
- **Instruction file:** `instructions/debug/01-investigate-bug.md`
- **Bug report:** `bugs/05-admin-logout-placement.md`
- **Commit:** `debug 01: analyze the five sprint-03 bugs`

## Work Completed

Analyzed `bugs/05-admin-logout-placement.md` against the frontend nav and Admin
panel code. No application code was modified. Traced why Admin "Log out" appears
below the top nav instead of inside it.

## Root Causes Found

The top-nav logout (`#logoutBtn`, `frontend/index.html:22`) is shown only when
`currentUser` is set (`frontend/js/app.js:88-91`, `updateUserBadge()`). Admin
sign-in (`goAdmin()`, `frontend/js/app.js:303-323`) sets only `adminToken`, never
`currentUser`, so the top-nav logout stays hidden. Instead, the Admin panel embeds
its own logout button in the panel body (`frontend/js/views.js:653,657`), below the
nav.

## Proposed Fixes

- In `frontend/js/app.js:88-91`, make `updateUserBadge()` show the top-nav logout
  for admin sessions too (toggle on `currentUser || adminToken`). `logout()`
  (`frontend/js/app.js:178-190`) already clears both tokens.
- Remove the separate `#adminLogout` button/wiring from `adminPanel()`
  (`frontend/js/views.js:653,657`) so there is one consistent top-nav logout.

## Outputs Produced / Modified

- `bugs/05-admin-logout-placement.md` — modified: `Status` set to `Analyzed`;
  appended `## Root Cause Analysis` and `## Proposed Fix`.
- `instructions/debug/summaries/01-05-admin-logout-placement.md` — new: this summary.

## Key Decisions

- Identified the discrepancy between learner (`currentUser`) and admin
  (`adminToken`) session state as the cause of the top-nav logout being hidden.

## Open Questions & Concerns

- Human must **approve** the proposed fix (show top-nav logout for admin, remove
  the embedded Admin-panel logout) before the fix stage runs.

## Status

- [x] Complete
- [ ] Needs review