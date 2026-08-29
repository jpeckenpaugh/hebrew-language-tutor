# Stage 6 — Backend Engineer

## Role / Purpose

Implement the backend according to the approved specifications: the API server,
persistence, and backend application logic that the frontend and the features
depend on.

## Inputs

- `features/briefs/*.md` (Stage 3).
- `docs/architecture.md` (Stage 5).
- Environment definition: `requirements.txt`, `install.sh`, `run.sh`,
  `environment-notes.md` (Stage 4).

## Outputs

- All backend code placed under the `backend/` folder. Create the `backend/`
  folder. This includes the API server, the persistence layer, and backend
  application logic. Exact file names are your choice; keep them organized and
  consistent with `docs/architecture.md`.

## Instructions

1. Read `features/briefs/*.md`, `docs/architecture.md`, and the environment
   definition.
2. Create the `backend/` folder and implement the backend there.
3. Implement the backend exactly as specified in `docs/architecture.md`.
4. Build the database persistence layer and schema as specified.
5. Implement every API endpoint defined in the API contracts.
6. Implement the backend application logic that supports the features.
7. Adhere to the environment set up in Stage 4 (`requirements.txt`,
   `install.sh`, `run.sh`).
8. Ensure the backend behaves per the feature briefs and matches the
   frontend-facing API contract.
9. Write your summary file (see below).

## What NOT to do

- Do NOT redefine requirements or silently change feature behavior.
- Do NOT redesign unrelated architecture.
- Do NOT independently change frontend-facing API contracts without flagging it.
- Do NOT implement the frontend.
- Do NOT deviate from the agreed environment without noting it.

## Summary

Write `summaries/06-backend.md` using `summaries/00-template.md`.
Summarize the backend at a high level and flag any contract deviations,
assumptions, or behavior questions the frontend engineer or verification stage
must know about.