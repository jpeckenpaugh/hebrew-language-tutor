# Brief 08 — Automatic Admin Sign-In

## Purpose

Streamline Admin access so clicking the "Admin" button signs the user in as
Admin automatically, without a username/password prompt, and remove the Admin
sign-in form.

## Expected Behavior

1. Clicking the "Admin" button on the Title screen signs the user in as Admin
   automatically, without prompting for a username or password.
2. The Admin sign-in form is removed.
3. The existing dummy gate still applies on the backend; the frontend simply
   supplies a fixed credential to obtain an admin token.
4. After sign-in, the user reaches the Admin area as usual.

## Inputs / Outputs

- **Inputs (user):** a click on the "Admin" button.
- **Outputs (user):** automatic sign-in as Admin and access to the Admin area.

## User-Visible Behavior

The user clicks "Admin" and is taken straight into the Admin area, signed in as
Admin. No username/password form appears. This replaces the previous Admin
sign-in flow (see Brief 06 of the existing build).

## Constraints

- The backend dummy gate is retained; the frontend supplies a fixed credential
  to obtain an admin token.
- Do not change the Admin area's functionality once signed in.
- Record the automatic sign-in (with the retained dummy gate) as a known
  simplification in project documentation.
- Do not regress non-admin sign-in behavior.

## Basic Acceptance Expectations

- Clicking "Admin" signs the user in as Admin automatically and opens the Admin
  area.
- No Admin sign-in form is shown.
- The Admin area functions as before after sign-in.