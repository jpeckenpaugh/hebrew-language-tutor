# Bug 06 — Create Account modal does not autofocus username; Title screen dropdown not refreshed

## Status

Approved.

> Human gate note (2026-08-29): Only **Issue 1** (autofocus the username field)
> is approved for the fix. Issue 2 was not reproduced in the current code path
> and is **out of scope** for this run; it remains flagged pending human browser
> confirmation.

## Summary

Two related issues with "Create Account" on the Title screen: (1) when the modal
opens, the cursor does not auto-focus into the "username" text box; and (2)
after creating a new user, the Title screen's user dropdown is not updated to
include the newly added user when it re-displays.

## Symptom (reported by user)

1. On the Title screen, click "Create Account".
2. Once the modal opens, the cursor should auto-focus into the "username" text
   box — currently it does not.
3. After creating a new user this way, when the Title screen re-displays, the
   user dropdown should be updated to the newly added user — currently it is not
   refreshed.

## Environment

- Web app: English/Hebrew Language Tutor (sprint-03).
- Create Account modal and Title screen user picker in `frontend/`.
- Repro: Title screen → Create Account.

## Reproduction

- On the Title screen, click "Create Account".
- Observe that the cursor is not auto-focused into the "username" field.
- Create a new user and return to the Title screen; observe the user dropdown is
  not updated with the newly added user.

## Root Cause Analysis

This report contains **two independent issues** that share the Create Account
modal. Issue 1 is a clear code defect. Issue 2 does not reproduce in the current
code path; evidence indicates the dropdown *is* refreshed, so it is flagged for
human browser verification rather than assumed.

### Issue 1 — username field is not auto-focused

**Root cause:** the Create Account modal's username input has no `autofocus`
attribute, and the code that shows the modal never calls `.focus()` on it.
Bootstrap's `Modal.show()` does not focus inputs by default (it focuses the modal
container for accessibility), so the cursor lands nowhere.

Evidence:

- `frontend/js/views.js:114` — `'<input class="form-control" id="createUsername" autocomplete="username" placeholder="Enter a username">'`
  — no `autofocus` attribute.
- `frontend/js/app.js:120-125` — `showCreateModal()` builds the modal, calls
  `new bootstrap.Modal(modalEl).show()`, and never focuses `#createUsername`.
  No `shown.bs.modal` handler exists to focus the field after the modal is
  visible.

### Issue 2 — Title screen dropdown after account creation

**Evidence (symptom does not reproduce in current code):**

- `frontend/js/app.js:139-142` — on successful signup, `createAccount()` calls
  `goTitle()`: `bootstrap.Modal.getInstance(modalEl).hide(); goTitle();`.
- `frontend/js/app.js:93-118` — `goTitle()` re-fetches users via `api('/api/users')`
  and re-renders `Views.title(..., res.data)`.
- `frontend/js/views.js:74-90` — `Views.title()` rebuilds the `#titleUserPicker`
  `<select>` from the fresh `users` array passed to it.
- Backend confirmed live: `POST /api/auth/signup` inserts the user and
  `GET /api/users` (`backend/app/routers/users.py:9-14`) returns it (verified by
  creating `TestUser` via the running app: signup returned `id 3`, and the
  subsequent `GET /api/users` listed Jarad, Ronald, and TestUser).

Because `createAccount()` already routes through `goTitle()` (which re-fetches
and re-renders with the fresh user list), the dropdown should include the newly
created account. The reported symptom was **not reproducible statically**; it may
reflect an earlier build, or the user observing the Title screen while the modal
was still animating out (the re-render happens under the closing modal). This
needs human browser confirmation before a fix is implemented.

## Proposed Fix

### Issue 1 — autofocus the username field

- Add `autofocus` to the username input (`frontend/js/views.js:114`), and/or call
  `.focus()` on `#createUsername` after the modal is shown in `showCreateModal()`
  (`frontend/js/app.js:120-125`), e.g. in a `shown.bs.modal` handler to guarantee
  the field is focused once visible.

### Issue 2 — confirm dropdown refresh

- Before implementing a fix, a human should confirm in a real browser whether the
  dropdown fails to show a newly created account. If it does, the fixer should
  ensure the re-render of `Views.title` happens after the modal is fully hidden
  (e.g. trigger `goTitle()` from the `hidden.bs.modal` handler, or await the modal
  hide), so the freshly-fetched user list is always reflected.

Files to change: `frontend/js/views.js` (autofocus, ~line 114),
`frontend/js/app.js` (`showCreateModal` ~120-125, and possibly the create→title
handoff for Issue 2).