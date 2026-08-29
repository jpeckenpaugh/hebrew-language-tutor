# Brief 07 — Known-Word Tracking

## Purpose

Track which vocabulary words a user "knows", deriving "known" from a word
answered correctly on an exam, and reflect this as per-user progress.

## Expected Behavior

1. The product tracks, per user, which vocabulary words they "know".
2. A word becomes "known" for a user when they answer it correctly on an exam.
3. Known-word status is stored and tied to the signed-in user (constraint j).
4. The product reflects this as per-user progress (e.g., a progress indicator for
   how many of a lesson's words the user knows).
5. Progress is specific to each user; it does not mix across users.

## Inputs / Outputs

- **Inputs (user):** completing an exam with correctly answered words.
- **Outputs (user):** per-user progress showing which words are known and how many
  of a lesson's words are known.

## User-Visible Behavior

After the user answers words correctly on an exam, those words are reflected as
"known" for that user, and the app shows per-user progress (for example, "4 of 10
known" for a lesson). This is new relative to v0.1, which had no progress
tracking.

## Constraints

- "Known" is derived from a word answered correctly on an exam (not from quizzes
  or study).
- Known-word status is per-user and persisted in the backend store (SQLite per
  scope).
- Progress reflects the signed-in user only.
- Do not add unrequested progress features beyond known-word tracking.

## Basic Acceptance Expectations

- A word answered correctly on an exam becomes "known" for that user.
- Progress is shown per user and reflects the known words.
- Two users' known-word progress is distinct.
