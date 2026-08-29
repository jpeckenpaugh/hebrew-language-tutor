# Brief 02 — Create Account Modal

## Purpose

Let a new user create an account independently of the sign-in flow. Since the
Title screen sign-in is now a picker (Brief 01), account creation moves to a
separate "Create Account" modal that asks for a username, decoupling creation
from sign-in.

## Expected Behavior

1. The Title screen offers a "Create Account" entry (in addition to the sign-in
   picker, Brief 01).
2. Choosing "Create Account" opens a modal form asking for a username.
3. The username must be non-empty; the product must not accept a blank username
   and must ask for a valid name if one is not provided.
4. Submitting a new username creates a new account identity.
5. After the account is created, the modal closes and the user is returned to
   the Title screen — they are **not** auto-signed-in.
6. The new account is then available in the sign-in picker (Brief 01), so the
   user can pick/sign in with it.

## Inputs / Outputs

- **Inputs (user):** a non-empty username entered in the Create Account modal.
- **Outputs (user):** confirmation the account was created; return to the Title
  screen; the new account now appears in the sign-in picker.

## User-Visible Behavior

The user clicks "Create Account", enters a username in the modal, and submits.
If the name is blank they are prompted for a valid name. After creation they are
back on the Title screen, not signed in, and their new name shows in the picker
so they can sign in. This is new: previously account creation happened through
the single sign-in username field.

## Constraints

- Account creation and sign-in are decoupled; creating an account does not sign
  the user in.
- The username must be non-empty.
- No password, email, or other credential is collected (consistent with Sprint
  01 Brief 01).
- Account data is stored in the backend's persistent store.
- Do not add unrequested account features (e.g., password reset, profiles).

## Basic Acceptance Expectations

- "Create Account" opens a modal asking for a username.
- A blank username is rejected with guidance.
- Submitting a valid username creates the account and returns the user to the
  Title screen without signing them in.
- The newly created account appears in the sign-in picker on the Title screen.