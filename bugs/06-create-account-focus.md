# Bug 06 — Create Account modal does not autofocus username; Title screen dropdown not refreshed

## Status

Open.

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