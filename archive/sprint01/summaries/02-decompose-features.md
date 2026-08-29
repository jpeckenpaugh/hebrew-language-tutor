# Summary: Feature Decomposition (Stage 2)

- **Date:** 2026-08-29
- **Author / Executor:** Feature Decomposition role
- **Instruction file:** `instructions/enhancements/02-decompose-features.md`
- **Scope reference:** `enhancements/scope.md`
- **Commit:** `stage 02: decompose new enhancement capabilities into feature files`

## Work Completed

Decomposed the agreed scope (`enhancements/scope.md`) into 7 discrete product
capabilities for this pass. Each capability is an addition to the existing v0.1
features (under `features/completed/`), which were reviewed to avoid duplication.
Capabilities were kept at the product level only; no behavior, workflow, or
implementation detail was included.

## Outputs Produced / Modified

- `features/` folder created (new). The `features/completed/` folder and all v0.1
  feature files were left unchanged.
- `features/01-learner-accounts.md` (new) — scope item c
- `features/02-title-screen-session-control.md` (new) — scope items e and f
- `features/03-per-user-score-history.md` (new) — scope item d
- `features/04-vocabulary-pronunciation-guide.md` (new) — scope item a
- `features/05-text-to-speech.md` (new) — scope item b
- `features/06-incorrect-answer-review.md` (new) — scope item g
- `features/07-known-word-tracking.md` (new) — scope item h
- `instructions/enhancements/summaries/02-decompose-features.md` (new, this file)

## Key Decisions

- Grouped scope items e (Title screen) and f (Logout) into a single capability
  ("Title Screen & Session Control") since they are two sides of the same
  entry/exit session flow. The scope note that the existing dummy admin gate is
  unchanged was preserved.
- Kept the remaining scope features (a, b, c, d, g, h) as their own capabilities.
- Did not add a separate capability for constraints/boundaries (j, k, i); these
  are governing rules, not new product capabilities, and are left to downstream
  stages.

## Open Questions & Concerns

- Scope item d ("Scores tied to a user") and item g ("Incorrect-answer review")
  both depend on per-user identity (item c) and on existing attempt persistence
  (v0.1 feature 07). Brief writers should confirm the exact relationship between
  the signed-in user, attempts, and the incorrect-answer set before backend/frontend
  design.
- Scope item h ("Known-word tracking") derives "known" from exam correctness and
  reflects per-user progress; whether this reuses existing score/attempt data or
  requires a distinct record type should be clarified in the brief stage.
- The scope does not specify the transliteration source or format for item a; this
  is a data question for the backend stage.

## Status

- [x] Complete
- [ ] Needs review
