# Scope — Sprint 01 Enhancement Pass

This pass extends the existing English/Hebrew Language Tutor (study/quiz/exam,
scores, admin). It does not start fresh. It adds learner identity,
pronunciation support, and progress tracking.

Every item from `sprint01.md` is listed below by its original letter and tagged
as a **feature** (new capability), a **constraint** (a rule governing this
pass), or a **boundary** (a limit on what is in scope).

## Features

- **a. English transliteration.** Each Hebrew vocabulary word gets an English
  transliteration (a pronunciation guide), shown alongside the word while the
  user studies.
- **b. Text-to-Speech.** The user can hear the English and Hebrew forms of a
  vocabulary item spoken aloud while studying.
- **c. Per-user accounts.** A user can create or sign in with a non-empty
  username. There is no password.
- **d. Scores tied to a user.** Each saved attempt is tied to the signed-in
  user, and the score history view shows only that user's attempts.
- **e. Title screen.** When the app opens it shows a Title screen offering
  username sign-in and a separate Admin entry. The existing dummy admin gate is
  unchanged.
- **f. Logout.** A logout control in the main UI lets a student or admin sign
  out and return to the Title screen to swap users.
- **g. Incorrect-answer review.** After finishing a quiz or exam, the user can
  review the questions they answered incorrectly, with the correct answer
  shown for each.
- **h. Known-word tracking.** The app tracks which vocabulary words a user
  "knows", deriving "known" from a word answered correctly on an exam, and
  reflects this as per-user progress.

## Constraints

- **j. Backend is the source of truth.** Usernames, users, scores, and
  known-word status are stored in the backend's persistent store (SQLite),
  which remains the single source of truth.
- **k. Document simplifications.** Any simplification noted in the sprint (for
  example, no student password) is recorded as a known limitation in the
  project documentation, not silently hidden.

## Boundaries

- **i. Keep it simple.** Do not add features that were not requested in this
  sprint.

## Notes

- The existing dummy admin gate stays as-is (see feature e).
- Existing v0.1 behavior that is outside the items above is unchanged.
