# Summary: Bug Investigator (Stage 1)

- **Date:** 2026-08-29
- **Author / Executor:** opencode (Bug Investigator role)
- **Instruction file:** `instructions/debug/01-investigate-bug.md`
- **Bug report:** `bugs/06-create-account-focus.md`
- **Commit:** `debug 01: analyze the five sprint-03 bugs`

## Work Completed

Analyzed `bugs/06-create-account-focus.md` against the frontend modal/Title code
and the running backend. No application code was modified. Confirmed Issue 1
(no autofocus) as a real defect; found Issue 2 (dropdown refresh) not
reproducible in the current code path.

## Root Causes Found

1. **No autofocus on username:** the `#createUsername` input
   (`frontend/js/views.js:114`) has no `autofocus` attribute and
   `showCreateModal()` (`frontend/js/app.js:120-125`) never calls `.focus()` after
   `new bootstrap.Modal(modalEl).show()`. Bootstrap's `Modal.show()` does not
   autofocus inputs by default.
2. **Dropdown not refreshed (NOT reproducible):** `createAccount()`
   (`frontend/js/app.js:139-142`) calls `goTitle()` after signup; `goTitle()`
   (`frontend/js/app.js:93-118`) re-fetches `GET /api/users` and re-renders
   `Views.title` with the fresh list (`frontend/js/views.js:74-90`). Verified live:
   signup inserts the user and `GET /api/users` returns it. So the dropdown should
   reflect the new account. Flagged for human browser verification.

## Proposed Fixes

- **Issue 1:** add `autofocus` to `#createUsername` (`frontend/js/views.js:114`)
  and/or focus it in a `shown.bs.modal` handler in `showCreateModal()`
  (`frontend/js/app.js:120-125`).
- **Issue 2:** have a human confirm the symptom in a real browser first; if real,
  ensure `goTitle()` re-render runs after the modal is fully hidden (e.g. via the
  `hidden.bs.modal` handler).

## Outputs Produced / Modified

- `bugs/06-create-account-focus.md` — modified: `Status` set to `Analyzed`;
  appended `## Root Cause Analysis` and `## Proposed Fix`.
- `instructions/debug/summaries/01-06-create-account-focus.md` — new: this summary.

## Key Decisions

- Did not guess a root cause for Issue 2; the current code path appears to refresh
  the dropdown, so the summary flags it for human browser confirmation rather than
  inventing a fix.

## Open Questions & Concerns

- Human must **approve** the proposed autofocus fix.
- Human must **confirm in a browser** whether the dropdown-refresh symptom is real
  before the fix stage implements anything for Issue 2.

## Status

- [x] Complete
- [ ] Needs review