# Summary: Feature Decomposition (Stage 02)

- **Date:** 2026-08-29
- **Author / Executor:** opencode (Stage 2 role)
- **Instruction file:** `instructions/enhancements/02-decompose-features.md`
- **Scope reference:** `enhancements/scope.md`
- **Commit:** `stage 02: decompose Sprint 02 scope into seven feature files`

## Work Completed

Decomposed the Sprint 02 enhancement scope into seven discrete product
capabilities, one per in-scope feature item (a–g). Created the new `features/`
folder (which did not previously exist) and wrote one capability-level markdown
file per feature. Capabilities were derived only from `enhancements/scope.md`;
no v0.1 or Sprint 01 features were duplicated, and process constraints h and j
were intentionally excluded from feature files.

## Outputs Produced / Modified

- `features/` — new folder.
- `features/01-sign-in-user-picker.md` — new artifact (scope item a.), including a scope note folding in the backend list-users support (constraint i.).
- `features/02-create-account-modal.md` — new artifact (scope item b.).
- `features/03-consistent-admin-sign-out.md` — new artifact (scope item c.).
- `features/04-larger-terms-text.md` — new artifact (scope item d.).
- `features/05-inline-tts-icons.md` — new artifact (scope item e.).
- `features/06-remove-admin-nav-item.md` — new artifact (scope item f.).
- `features/07-remove-signed-in-as-badge.md` — new artifact (scope item g.).
- `instructions/enhancements/summaries/02-decompose-features.md` — new artifact (this summary).

## Key Decisions

- **1:1 decomposition:** each in-scope item (a–g) maps to exactly one feature
  file, ensuring nothing in scope is silently dropped.
- **Backend list-users folded into feature 01:** the single permitted backend
  addition (constraint i.) is recorded as a scope note within
  `01-sign-in-user-picker.md` rather than a standalone feature, since it exists
  solely to support item a.
- **Constraints h and j excluded:** "keep things simple" and "record
  simplifications" are process/scope constraints, not product capabilities, so
  they do not appear as feature files.
- **Items d and e kept separate:** larger terms text and inline TTS icons are
  distinct capabilities despite both touching the Study/Quiz/Exam screens.

## Open Questions & Concerns

- None for this stage. The briefs writer (Stage 3) may decide how granular the
  "Larger Terms Text" sizing and "Inline TTS Icons" placement become, but the
  capabilities themselves are unambiguous.

## Status

- [x] Complete
- [ ] Needs review