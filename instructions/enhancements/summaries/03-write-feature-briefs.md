# Summary: Feature Brief Writer (Stage 3)

- **Date:** 2026-08-29
- **Author / Executor:** Feature Brief Writer role
- **Instruction file:** `instructions/enhancements/03-write-feature-briefs.md`
- **Scope reference:** `enhancements/scope.md`
- **Commit:** `stage 03: write feature briefs for UI/UX refinements`

## Work Completed

Read `enhancements/scope.md`, all 7 feature files under `features/`, and the
relevant existing briefs for context (v0.1 briefs under
`archive/build/features/completed/briefs/` and Sprint 01 briefs under
`archive/sprint01/features/briefs/`). Wrote one behavioral brief per feature,
each describing the new behavior relative to the existing application (what
changes or is added to the current experience). Numbering and naming are kept in
sync with the feature files. The new `features/briefs/` folder was created; all
existing artifacts were left unchanged.

## Outputs Produced / Modified

- `features/briefs/` folder (new).
- `features/briefs/01-sign-in-user-picker.md` (new) — scope item a.
- `features/briefs/02-create-account-modal.md` (new) — scope item b.
- `features/briefs/03-consistent-admin-sign-out.md` (new) — scope item c.
- `features/briefs/04-larger-terms-text.md` (new) — scope item d.
- `features/briefs/05-inline-tts-icons.md` (new) — scope item e.
- `features/briefs/06-remove-admin-nav-item.md` (new) — scope item f.
- `features/briefs/07-remove-signed-in-as-badge.md` (new) — scope item g.
- `instructions/enhancements/summaries/03-write-feature-briefs.md` (new, this
  file).

## Key Decisions

- Wrote one brief per feature without merging distinct features, matching the
  Stage 2 decomposition.
- Sign-in picker (01) fully replaces the free-text username sign-in field on the
  Title screen; account creation moves to the modal (02).
- Account creation does not auto-sign-in: after the modal closes, the user
  returns to the Title screen and then picks/signs in (per human direction).
- Empty user list (01) shows a hint in the picker area directing the user to
  Create Account.
- Admin sign-out (03) returns to the main Title screen via a "Log out" control;
  the separate admin-only "Sign Out" button is removed.
- The Admin nav link (06) is removed from the top nav entirely; Admin is
  reachable only from the Title screen.
- Constraint scope kept tight: no new features, backend addition limited to the
  list-users endpoint; recorded simplifications noted where applicable.

## Open Questions & Concerns

- The backend list-users endpoint's shape (data format, ordering) is not
  specified; left to the backend stage.
- The concrete larger text size (04) is intentionally left to implementation, as
  allowed by scope.
- Whether the Create Account modal should also accept the account and reflect it
  in the picker immediately vs. on next reload is left to implementation; the
  required behavior (visible in the picker after creation) is specified here.
- All seven features have briefs; none was silently skipped or merged.

## Status

- [x] Complete
- [ ] Needs review