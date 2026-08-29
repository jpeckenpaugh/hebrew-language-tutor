# Brief 03 — Per-User Score History

## Purpose

Tie each saved attempt to the signed-in user so the score history shows only
that user's attempts. This extends v0.1 score/attempt persistence (completed
Brief 07) from a single shared history to a per-user one.

## Expected Behavior

1. When a user completes a quiz or exam, the saved attempt is associated with the
   signed-in user.
2. The score history view shows only the signed-in user's attempts.
3. A signed-in user cannot see another user's attempts in their history.
4. Scores and attempts continue to persist in the backend store (constraint j),
   which remains the source of truth.
5. If no user is signed in, the user cannot save or view a personalized history;
   they must be signed in (per Briefs 01/02).

## Inputs / Outputs

- **Inputs (user):** completion of a quiz or exam while signed in.
- **Outputs (user):** the score history limited to that user's saved attempts.

## User-Visible Behavior

After signing in, the user sees only their own saved scores and attempts in the
history view. Their attempts are tied to their username. This differs from v0.1,
where attempts were not attributed to a user.

## Constraints

- Every saved attempt is associated with the signed-in user.
- The history view is filtered to the current user only.
- Persistence rules from v0.1 Brief 07 continue to hold (survives reloads).
- User/scores data lives in the backend store (SQLite per scope).
- Do not regress existing score persistence or add unrequested reporting.

## Basic Acceptance Expectations

- After a quiz/exam, the attempt is saved to the signed-in user.
- The history view shows only the signed-in user's attempts.
- Two different users see distinct histories.
