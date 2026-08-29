# Summary: Feature Decomposition (Stage 2)

- **Date:** 2026-08-28
- **Author / Executor:** opencode (deepseek-v4-flash)
- **Instruction file:** `instructions/02-decompose-features.md`

## Work Completed

Read `concept.md` and decomposed the English/Hebrew Language Tutor Web App
into 9 discrete product capabilities. Each capability is written to its own
file under `features/`, at the capability level only (no behavior, workflow,
or implementation). Every requirement stated in `concept.md` is covered by at
least one feature.

## Outputs Produced

- `features/01-lesson-catalog.md` — 5 basic lessons, 10 vocab items each
- `features/02-vocabulary-data.md` — 10 vocab items per lesson
- `features/03-learn-study-mode.md` — study mode per lesson
- `features/04-quiz-mode.md` — multiple choice with immediate feedback
- `features/05-exam-mode.md` — multiple choice with end-of-exam results
- `features/06-admin-mode.md` — sign-in and add/modify lessons & vocab
- `features/07-score-attempt-persistence.md` — persisted scores/attempts
- `features/08-navigation.md` — basic navigation
- `features/09-backend-api-state-source.md` — state sourced from backend API
- `summaries/02-decompose-features.md` (this file)

## Key Decisions

- Kept "Lesson Catalog" and "Vocabulary Data" as separate capabilities
  because the concept distinguishes the lessons (5) from their vocab content
  (10 items each), and vocab is reused across study/quiz/exam modes.
- Kept study, quiz, and exam as separate capabilities since the concept
  assigns distinct feedback behavior to each (immediate vs. end-of-exam).
- Included Admin Mode and Backend API State Source as first-class features
  because the concept explicitly requires them.

## Open Questions & Concerns

- **Admin sign-in scope:** The concept says admin mode lets a user "sign in"
  but does not specify an authentication mechanism, user model, or access
  control. This needs clarification before briefs/design so scope does not
  grow beyond "simple."
- **Feedback / results specifics:** Quiz (immediate) and exam (end-of-exam)
  behaviors are named but not specified in detail; briefs should define the
  multiple-choice format and result presentation.

## Status

- [x] Complete
- [ ] Needs review