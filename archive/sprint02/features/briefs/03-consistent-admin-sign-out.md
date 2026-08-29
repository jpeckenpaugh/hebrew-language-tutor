# Brief 03 — Consistent Admin Sign-Out

## Purpose

Make signing out as Admin behave consistently with the learner sign-out. Today
signing out as Admin returns to the Admin Sign In screen, unlike the learner
"Log out" which returns to the main Title screen (Sprint 01 Brief 02). This
brief makes Admin sign-out return to the main Title screen too, via a "Log out"
control in the Admin UI, and removes the separate admin-only "Sign Out" button.

## Expected Behavior

1. The Admin UI provides a "Log out" control.
2. Selecting "Log out" signs the admin out and returns to the main Title screen
   (the same Title screen a learner returns to after logging out).
3. The separate admin-only "Sign Out" button is removed; it is replaced by the
   "Log out" control.
4. Admin remains reachable from the Title screen via the existing Admin entry,
   which is unchanged.

## Inputs / Outputs

- **Inputs (user):** selection of the "Log out" control in the Admin UI.
- **Outputs (user):** return to the main Title screen, signed out.

## User-Visible Behavior

An admin in the Admin UI sees a "Log out" control instead of the former "Sign
Out" button. Using it returns them to the main Title screen, matching what a
learner experiences, so both roles sign out the same way.

## Constraints

- Admin sign-out returns to the main Title screen, not the Admin Sign In screen.
- The existing Admin entry/gate on the Title screen is unchanged.
- Do not add unrequested auth flows beyond this consistent sign-out behavior.

## Basic Acceptance Expectations

- The Admin UI shows a "Log out" control and no separate "Sign Out" button.
- Selecting "Log out" as Admin returns to the main Title screen, signed out.
- The admin can re-enter Admin from the Title screen as before.