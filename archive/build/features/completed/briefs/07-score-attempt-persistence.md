# Brief 07 — Score / Attempt Persistence

## Purpose

Retain user performance across sessions so scores and attempts are not lost
when the user reloads or returns to the app.

## Expected Behavior

1. When the user completes a quiz or exam, the resulting score and attempt are
   recorded.
2. Recorded scores/attempts are persisted (not stored only in the browser's
   memory) so they survive reloads and separate sessions.
3. The user can later see their recorded scores/attempts (e.g., a history or
   per-lesson record).
4. Data is stored via the backend (see Brief 09) in the persistent store.

## Inputs / Outputs

- **Inputs (user):** completion of a quiz or exam, producing a score/attempt.
- **Outputs (user):** confirmation of saving and the ability to view prior
  scores/attempts.

## User-Visible Behavior

After finishing a quiz or exam, the user sees their score; the score/attempt
remains available when they return to the app later. The user can review their
saved performance.

## Constraints

- Persistence must survive page reloads and new sessions (not ephemeral
  frontend state).
- Data lives in the backend's persistent store (FastAPI/SQLite per concept);
  the frontend does not own the store.
- Keep to score/attempt persistence; do not add analytics or other reporting
  beyond showing saved scores/attempts.

## Basic Acceptance Expectations

- A completed quiz/exam score is saved.
- After reloading or returning, the saved score/attempt is still present.
- The user can view their persisted scores/attempts.