# Summary: Feature Brief Writer (Stage 3)

- **Date:** 2026-08-28
- **Author / Executor:** opencode (Stage 3 role)
- **Instruction file:** `instructions/03-write-feature-briefs.md`

## Work Completed

Read `concept.md` and all 9 feature files under `features/`, then wrote one
behavioral brief per feature under `features/briefs/`, keeping numbering and
names in sync with the source feature files. Each brief covers purpose,
expected behavior, inputs/outputs, user-visible behavior, constraints, and
basic acceptance expectations. No implementation details, filenames, classes,
SQL, or architecture were included, per the stage's constraints.

## Outputs Produced

- `features/briefs/01-lesson-catalog.md`
- `features/briefs/02-vocabulary-data.md`
- `features/briefs/03-learn-study-mode.md`
- `features/briefs/04-quiz-mode.md`
- `features/briefs/05-exam-mode.md`
- `features/briefs/06-admin-mode.md`
- `features/briefs/07-score-attempt-persistence.md`
- `features/briefs/08-navigation.md`
- `features/briefs/09-backend-api-state-source.md`

## Key Decisions

- Kept briefs strictly bounded to what `concept.md` and the feature files
  state, intentionally not inventing behavior.
- Preserved the 5-lesson × 10-vocab structure and the 3-modes-per-lesson
  (study/quiz/exam) scope across relevant briefs.
- Quiz vs. exam distinction preserved: immediate per-question feedback (quiz)
  versus results at the end (exam).
- Reinforced the backend-as-source-of-truth constraint in catalog, vocabulary,
  admin, persistence, and navigation briefs so downstream stages keep state
  server-side.

## Open Questions & Concerns

- **Admin sign-in (Brief 06):** `concept.md` says "sign in" but specifies no
  authentication model, credential storage, or admin user(s). The brief
  requires sign-in gating but does not resolve how identities/credentials are
  created or verified. Needs a decision before backend engineering (Stage 6).
- **Score/attempt identity (Brief 07):** `concept.md` requests score/attempt
  persistence but does not say whether scores are tied to a user/identity, a
  device/session, or are global. Ambiguity affects the persistence schema.
- **Admin "new lesson" count (Brief 06):** the 10-vocab-per-lesson rule is
  stated for the baseline catalog; whether newly added admin lessons must also
  hold exactly 10 items is not specified upstream. Flagged so it is not assumed.
- **Admin scope (Brief 06):** only modify-existing and add-new are requested;
  deletion is excluded. Confirmed exclusion so a downstream role does not add
  it.

## Status

- [x] Complete
- [ ] Needs review