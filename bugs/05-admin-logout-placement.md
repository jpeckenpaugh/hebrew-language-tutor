# Bug 05 — Admin "Log out" button appears below the top nav instead of inside it

## Status

Approved.

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

## Root Cause Analysis

There are two logout buttons and only one is shown. The top-nav "Log out"
(`#logoutBtn`) is displayed only for **learner** sessions (when `currentUser` is
set); an Admin session sets only `adminToken`, never `currentUser`, so the
top-nav logout stays hidden. Instead, the Admin panel embeds its own separate
logout button in the panel body, below the nav.

Evidence:

- `frontend/index.html:22` — `#logoutBtn` ("Log out") lives inside the top nav
  bar (`<button class="btn btn-outline-light ms-2 d-none" id="logoutBtn">`).
- `frontend/js/app.js:88-91` — `updateUserBadge()` toggles `#logoutBtn` with
  `logoutBtn.classList.toggle('d-none', !currentUser)`. It only shows when
  `currentUser` is truthy (learner login).
- Admin sign-in (`frontend/js/app.js:303-323`, `goAdmin()`) sets `adminToken`
  only; it never sets `currentUser`. So `updateUserBadge()` leaves the top-nav
  logout hidden for Admin. (`setNavVisibility()` at `frontend/js/app.js:83-86`
  manages the Admin *nav link*, not the logout button.)
- Instead the Admin panel renders its own logout button:
  `frontend/js/views.js:653` — `'<button class="btn btn-outline-danger" id="adminLogout">Log out</button>'`
  inside the Admin heading row (`frontend/js/views.js:651-655`), which appears
  below the top nav. It is wired to `callbacks.onLogout()` at
  `frontend/js/views.js:657` (→ `frontend/js/app.js:344-349`).

## Proposed Fix

Make the top-nav "Log out" (`#logoutBtn`) the single logout for Admin too,
positioned on the far right as on the regular logged-in pages:

- In `frontend/js/app.js:88-91`, change `updateUserBadge()` to show the top-nav
  logout for admin sessions as well, e.g. toggle on `currentUser || adminToken`.
  `logout()` (`frontend/js/app.js:178-190`) already clears both `userToken` and
  `adminToken` and returns to the Title screen, so no further change is needed
  there.
- In `frontend/js/views.js:653`/`657`, remove the separate `#adminLogout` button
  (and its `onLogout` wiring) from `adminPanel()` so there is a single, consistent
  top-nav logout, matching the regular logged-in pages.

Files to change: `frontend/js/app.js` (`updateUserBadge`), `frontend/js/views.js`
(`adminPanel`).