# Summary: Feature Brief Writer (Stage 3)

- **Date:** 2026-08-29
- **Author / Executor:** Feature Brief Writer role
- **Instruction file:** `instructions/enhancements/03-write-feature-briefs.md`
- **Scope reference:** `enhancements/scope.md`
- **Commit:** `stage 03: write feature briefs for learner identity, pronunciation, progress`

## Work Completed

Read `enhancements/scope.md`, all 7 feature files under `features/`, and the 9
existing v0.1 briefs under `features/completed/briefs/` for context. Wrote one
behavioral brief per new feature, each describing the new behavior in the context
of the existing application (what changes or is added to the current experience).
Numbering and naming are kept in sync with the feature files. The new
`features/briefs/` folder was created; all existing v0.1 artifacts were left
unchanged.

## Outputs Produced / Modified

- `features/briefs/` folder (new).
- `features/briefs/01-learner-accounts.md` (new) — scope item c.
- `features/briefs/02-title-screen-session-control.md` (new) — scope items e and f.
- `features/briefs/03-per-user-score-history.md` (new) — scope item d.
- `features/briefs/04-vocabulary-pronunciation-guide.md` (new) — scope item a.
- `features/briefs/05-text-to-speech.md` (new) — scope item b.
- `features/briefs/06-incorrect-answer-review.md` (new) — scope item g.
- `features/briefs/07-known-word-tracking.md` (new) — scope item h.
- `instructions/enhancements/summaries/03-write-feature-briefs.md` (new, this file).

## Key Decisions

- Wrote one brief per feature without merging distinct features, matching the
  decomposition in Stage 2.
- Addressed Stage 2 concerns behaviorally: per-user score history (03) and
  incorrect-answer review (06) are tied to the signed-in user's attempt; known-word
  tracking (07) is defined as per-user and exam-derived.
- Described transliteration (04) and text-to-speech (05) strictly as study-mode
  display/aids so quiz/exam behavior is not altered.
- Preserved v0.1 behavior as constraints (unchanged dummy admin gate, immediate quiz
  feedback, score persistence, 10-items-per-lesson).

## Open Questions & Concerns

- Transliteration source and format (item a) are not specified in scope; this is a
  data question for the backend stage.
- Whether known-word status (item h) is stored as a distinct record type or derived
  from existing exam attempt data is left to backend design.
- The exact storage/API shape for tying attempts to users and the incorrect-answer
  set (items d and g) is left to backend/frontend design; the required behavior is
  specified here.
- All seven features have briefs; none was silently skipped or merged.

## Status

- [x] Complete
- [ ] Needs review
