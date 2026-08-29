# Brief 01 — Learner Accounts

## Purpose

Give each learner a stable, personal identity in the app so their scores and
progress can be tracked per user. This extends the existing v0.1 app (which has
no per-user accounts) by letting a user create or sign in with a non-empty
username. There is no password.

## Expected Behavior

1. From the Title screen (see Brief 02), a user can create an account or sign in
   by entering a username.
2. The username must be non-empty; the product must not accept a blank username.
3. Creating an account with a new username establishes a new user identity.
4. Signing in with an existing username returns the user to their existing
   identity (and, per Briefs 03 and 07, their previously saved data).
5. The product does not require or accept a password for sign-in.
6. Usernames and user identities are stored in the backend's persistent store,
   which remains the source of truth (constraint j).

## Inputs / Outputs

- **Inputs (user):** a username (non-empty) entered to create an account or sign
  in.
- **Outputs (user):** confirmation of being signed in as that user; the main UI
  reflects the signed-in identity.

## User-Visible Behavior

The user opens the app, sees a username field, and enters a name to create or
join their account. If they enter a blank name, the product asks for a valid
non-empty name. Afterward they are signed in and the main UI knows who they are.
This is new: v0.1 had no per-user identity.

## Constraints

- Username must be non-empty.
- No password, email, or other credential is collected.
- User data lives in the backend store (SQLite per scope); the frontend does not
  own it.
- Do not add unrequested account features (e.g., password reset, profiles).
- Do not regress existing v0.1 behavior outside this pass's scope.

## Basic Acceptance Expectations

- A user can create an account and sign in with a non-empty username.
- A blank username is rejected with guidance.
- Signing in as an existing user returns to that user's saved data.
- No password is requested anywhere in the flow.
