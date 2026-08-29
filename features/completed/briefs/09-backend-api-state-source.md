# Brief 09 — Backend API State Source

## Purpose

Make the backend API the single source of truth for application state,
including lessons, so the frontend displays data served by the backend rather
than data it generates or stores itself.

## Expected Behavior

1. The frontend requests application state (including the lesson catalog and
   vocabulary) from the backend API.
2. The frontend renders the state it receives from the backend; it does not
   hold its own authoritative copy of lessons/vocabulary.
3. When data changes on the backend (e.g., via admin edits), the frontend
   reflects the updated data by fetching from the API.
4. Persisted scores/attempts are also stored and retrieved through the backend
   (see Brief 07).

## Inputs / Outputs

- **Inputs (frontend → backend):** requests for catalog, lesson vocabulary,
  and saved scores/attempts.
- **Outputs (backend → frontend):** the requested application state data.

## User-Visible Behavior

The user sees lessons, vocabulary, and saved scores that come from the backend.
If the backend data changes, the visible content changes accordingly when
refreshed/fetched. The user does not see raw API mechanics.

## Constraints

- The frontend must source lessons and application state from the backend API,
  not embed its own copy.
- The backend provides the API and persistent store; the frontend consumes it.
- Keep this to sourcing state from the backend; do not introduce an unrelated
  caching/sync architecture.

## Basic Acceptance Expectations

- The catalog and lesson vocabulary displayed come from the backend API.
- Updated backend data (e.g., admin changes) is reflected in the frontend.
- Saved scores/attempts are read from the backend.