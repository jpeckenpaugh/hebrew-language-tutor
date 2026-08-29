# Summary: Architect (Stage 5)

- **Date:** 2026-08-28
- **Author / Executor:** opencode (Stage 5 role)
- **Instruction file:** `instructions/05-architecture.md`

## Work Completed

Translated the product requirements (concept + 9 feature briefs) and the
approved environment into a technical specification for the English/Hebrew
Language Tutor. Defined the project/file structure, module boundaries, SQLite
data model and schema, complete API contracts, backend/frontend responsibility
split, and the application state flow. No application code was written.

## Outputs Produced

- `docs/architecture.md` — the full technical specification.
- `summaries/05-architecture.md` (this file).

## Key Decisions

- **Backend layout `backend/app/`** matches Stage 4's `run.sh` target
  (`app.main:app`) so the entry point is `backend/app/main.py`.
- **Schema of three tables:** `lessons`, `vocab`, `scores`; idempotent seed of
  5 lessons × 10 items.
- **Quiz/exam question construction** is a frontend responsibility, built from
  served vocab with distractors drawn from the same lesson; the backend only
  stores completed score/attempt records.
- **Admin auth = dummy sign-in gate** (per decision): any non-empty credential
  yields a token; mutating admin routes require the token. No real password
  verification.
- **Scores are global / per-lesson** (per decision): no user identity column;
  history is app-wide and per lesson.

## Open Questions & Concerns

- **Admin auth is intentionally a dummy gate.** If a real authentication
  requirement ever appears, the schema and `/api/admin/login` contract will
  need revision. Flagged to avoid surprising downstream engineers.
- **Distractor construction** lives on the frontend, so quiz/exam correctness
  depends on the frontend building choices from the same 10-item lesson set.
  If the backend must instead serve pre-built questions, the contract needs
  new endpoints.
- **Lesson vocab count:** seed guarantees exactly 10, but admin can add items,
  so a lesson may exceed 10 after edits. Downstream engineers should confirm
  this is acceptable (it is consistent with briefs 06).
- **`run.sh` / static path assumptions** from Stage 4 remain; Stage 6 must
  produce `backend/app/main.py` and Stage 7 must reference
  `frontend/static/vendor/bootstrap/`. Confirm those paths during
  implementation.

## Status

- [x] Complete
- [ ] Needs review