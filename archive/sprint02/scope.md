# Sprint 02 — Agreed Scope

This document records the agreed scope for the Sprint 02 enhancement pass,
drawn from `enhancements/sprint02.md`. It is a frontend-focused UI/UX
refinement of the existing English/Hebrew Tutor (v0.1 + Sprint 01 build). Every
item in the sprint concept is categorized below as a **feature**, a
**constraint**, or a **boundary**; nothing is dropped.

Each item is listed by its letter from the sprint concept file, with its
high-level intent stated in plain, non-technical language.

## Features

- **a.) Sign-in user picker.** The Title screen shows a dropdown of existing
  user accounts so a returning user can pick their name instead of typing it.
  Intent: pick-then-sign-in — the user selects their name from the list and
  still clicks Sign In to enter (they are not signed in merely by selecting).
  The list is populated from the backend.

- **b.) Create Account modal.** "Create Account" opens a modal form asking for
  a username, separate from the sign-in field. Intent: let a new user create an
  account independently of the sign-in picker, so account creation and sign-in
  are decoupled.

- **c.) Consistent Admin sign-out.** Signing out as Admin returns to the main
  Title screen (like the learner "Log out"), not to the Admin Sign In screen.
  Intent: make Admin sign-out behave consistently with learner sign-out; the
  Admin UI gains a "Log out" control and the separate admin-only "Sign Out"
  button is removed.

- **d.) Larger terms text.** Increase the size of the English/Hebrew text on
  the Study, Quiz, and Exam screens. Intent: improve readability by making the
  terms notably larger / more readable. The concrete size is not fixed here;
  it is chosen during implementation.

- **e.) Inline TTS icons.** Replace the TTS buttons that sit on their own line
  in Study cards with small speaker icons placed next to the English and Hebrew
  terms. Intent: keep text-to-speech available but make it lighter and inline
  with the terms rather than on a separate line.

- **f.) Remove the Admin nav item.** The top navigation no longer shows an
  "Admin" link for signed-in users. Intent: Admin stays reachable only from the
  Title screen; the in-app top nav no longer advertises Admin.

- **g.) Remove the "Signed in as" badge.** The sub-nav no longer shows the
  "Signed in as {User}" text. Intent: reduce clutter in the sub-navigation.

## Constraints

- **h.) Keep things simple.** Do not add features not requested in this sprint.
  Intent: scope discipline — only the items above are in scope; nothing extra
  is introduced.

- **i.) Backend support where needed.** The only backend addition is an endpoint
  listing existing users (to support item a.); all other items are frontend-only.
  Intent: constrain the backend change to a single read-only endpoint and keep
  the rest of the pass in the frontend.

- **j.) Record simplifications.** Wherever this sprint notes a simplification,
  record it as a known limitation in the project documentation, not silently
  hidden. Intent: be transparent about any simplifications made in this pass.

## Boundaries

- The pass is frontend-focused and extends the existing application; it must not
  regress or change out-of-scope existing behavior.
- The single permitted backend addition is the list-users endpoint (item i.).
- No features beyond those listed are in scope (item h.).