# Brief 01 — Sign-In User Picker

## Purpose

Make returning-user sign-in easier on the Title screen by letting a user pick
their name from a dropdown of existing accounts instead of typing it. This
extends the Sprint 01 Title screen (Brief 02, Title Screen & Session Control),
which currently signs in via a free-text username field (Brief 01, Learner
Accounts). The free-text username sign-in field is **removed** and fully
replaced by the picker; account creation moves to a separate modal (see Brief
02).

## Expected Behavior

1. When the app opens, the Title screen shows, in place of the old free-text
   username field, a dropdown listing existing user accounts.
2. The list of existing users is populated from the backend (the single in-scope
   backend addition; scope constraint i.).
3. Selecting a name from the dropdown does **not** sign the user in by itself.
4. The user still clicks a Sign In control to enter; signing in as a selected
   name returns that user to their existing identity and saved data (per Sprint
   01 Brief 01).
5. If no accounts exist yet, the picker area shows a hint directing the user to
   Create Account (the modal, Brief 02) instead of an empty/disabled list.
6. A separate "Create Account" entry (opening the modal, Brief 02) remains
   available for new users.

## Inputs / Outputs

- **Inputs (user):** selection of a username from the dropdown, then the Sign In
  action.
- **Outputs (user):** sign-in as the selected user; the main UI reflects that
  identity.

## User-Visible Behavior

The user opens the app and, instead of typing a name, picks their account from a
list on the Title screen and clicks Sign In. If there are no accounts, they see
a hint to create one. This replaces the prior type-a-name sign-in; the 
experience of clicking Sign In and then seeing the main UI is otherwise
unchanged.

## Constraints

- The picker replaces the free-text username sign-in field on the Title screen;
  the old type-in field is not retained for sign-in.
- The list is sourced from the backend; the frontend does not hardcode the user
  list.
- Selection alone does not sign the user in (pick-then-sign-in).
- Admin entry on the Title screen remains available and unchanged.
- Do not regress existing behavior outside this pass's scope.

## Basic Acceptance Expectations

- The Title screen shows a dropdown of existing users populated from the
  backend.
- Selecting a user and clicking Sign In signs that user in.
- Selecting a user without clicking Sign In does not sign anyone in.
- With no users present, the picker area shows a hint pointing to Create
  Account.