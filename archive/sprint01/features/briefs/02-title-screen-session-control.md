# Brief 02 — Title Screen & Session Control

## Purpose

Provide the app's entry and exit point so a user can sign in, reach Admin, and
sign out to swap users. When the app opens it shows a Title screen offering
username sign-in (Brief 01) and a separate Admin entry. A logout control in the
main UI lets a student or admin return to the Title screen.

## Expected Behavior

1. When the app opens, it shows a Title screen before any main UI.
2. The Title screen offers username sign-in (per Brief 01) and a separate Admin
   entry.
3. After the user signs in, the app shows the main UI (catalog/lessons/modes).
4. The Admin entry leads to the existing dummy admin gate, which is unchanged.
5. A logout control is present in the main UI.
6. Selecting logout signs the current user out and returns to the Title screen,
   allowing a different user to sign in.
7. Logout works for both a student and an admin.

## Inputs / Outputs

- **Inputs (user):** a choice on the Title screen (sign in or Admin entry) and
  selection of logout in the main UI.
- **Outputs (user):** the main UI after sign-in; the Admin area via the Admin
  entry; the Title screen after logout.

## User-Visible Behavior

The app no longer opens straight into the main content. The user first sees a
Title screen where they sign in as a user or enter the Admin area. In the main
UI they see a logout control; using it returns them to the Title screen to swap
users. The existing dummy admin gate behaves exactly as before.

## Constraints

- The existing dummy admin gate is unchanged (per scope note).
- The Title screen offers only username sign-in and the Admin entry; no other
  entry paths are added.
- Logout is available in the main UI for both student and admin.
- Do not add unrequested auth flows beyond sign-in/logout.

## Basic Acceptance Expectations

- The app opens to the Title screen, not the main content.
- From the Title screen the user can sign in or enter Admin.
- A logout control returns the user to the Title screen for both student and
  admin.
- The dummy admin gate behaves as it did in v0.1.
