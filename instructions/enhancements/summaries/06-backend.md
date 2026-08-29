# Summary: Backend Engineer (Stage 6)

- **Date:** 2026-08-29
- **Author / Executor:** Backend Engineer (Stage 6 role)
- **Instruction file:** `instructions/enhancements/06-backend.md`
- **Scope reference:** `enhancements/scope.md`
- **Commit:** `stage 06: add lesson level and emoji fields to the backend`

## Work Completed

Implemented the Sprint 03 backend additions per `docs/architecture.md` Part D and
scope constraint **l** — the `level` and `emoji` fields on `lessons`, with seed
data, migration, API exposure, and admin acceptance. All other Sprint 03
features (a–h) are frontend-only and required no backend change.

## Outputs Produced / Modified

- `backend/app/db.py` (modification) — added `_add_lesson_level` and
  `_add_lesson_emoji` migration helpers, wired into `_migrate`. Both use the
  existing idempotent `PRAGMA table_info` pattern and add columns via
  `ALTER TABLE ADD COLUMN` (no drop-and-recreate).
- `backend/app/seed.py` (modification) — added `level = 1` and the specific
  emojis to each of the five seeded lessons (👋 🔢 👨👩👧 🍎 ⚡).
- `backend/app/models.py` (modification) — added `level`/`emoji` to `LessonOut`
  and `LessonDetail`; extended `LessonCreate` with optional `level`/`emoji`
  (defaults 1 / 📘); converted `LessonUpdate` to partial-edit
  `{title, level, emoji}` (all optional).
- `backend/app/routers/catalog.py` (modification) — exposed `level`/`emoji` in
  `GET /api/lessons` and `GET /api/lessons/{id}`.
- `backend/app/routers/admin.py` (modification) — accepted `level`/`emoji` on
  `POST /api/admin/lessons`; converted `PUT /api/admin/lessons/{id}` to
  partial-edit semantics.
- `instructions/enhancements/summaries/06-backend.md` (this summary).

## Key Decisions

- **Emoji back-fill on existing on-disk DB.** The existing local database
  already contains the five seeded lessons, so `seed_if_empty` returns early and
  the seed back-fill would not run. To meet Brief 10's acceptance (seeded
  lessons show their specific emojis), `_add_lesson_emoji` back-fills emojis by
  matching lesson `title` against the seed — the exact precedent of
  `_add_vocab_transliteration`. This is additive and idempotent; pre-existing
  admin-created rows (no matching seed title) keep the `📘` default. `level`
  default (1) already satisfies the seed-row requirement. (Approved by Stage
  Manager.)
- **`PUT /api/admin/lessons/{id}` partial-edit.** Converted from required-`title`
  to full partial-edit `{title, level, emoji}` with an at-least-one guard (422 if
  all absent), matching the existing vocab PUT precedent. Backward compatible:
  a client that sends only `title` still renames as before. (Approved by Stage
  Manager.)
- **Validation.** `level` is validated as integer 1–5 → 422 otherwise (not
  clamped). `emoji` is validated only as a non-empty string (no single-character
  or length restriction), per Part D §23, because emojis may be multi-codepoint.

## Open Questions & Concerns

- **Schema-migration on existing data.** `level` and `emoji` are added via
  `ALTER TABLE ADD COLUMN` with defaults; the local on-disk DB is preserved (not
  dropped/recreated). Seeded rows get their specific emojis via the title back-
  fill; existing non-seed rows keep defaults (level 1, 📘) until edited via the
  admin API. The DB file itself is untracked/gitignored, so no migrated binary is
  committed.
- **`PUT` partial-edit behavior change.** Frontend must still send `title` when
  it wants to rename a lesson; sending only `level`/`emoji` now updates only
  those fields. The existing frontend lesson-edit flow (which sends `title`)
  remains compatible.
- **Admin-created lesson emoji.** A lesson created without an explicit emoji is
  stored as 📘 (the backend default). The frontend's bundled curated emoji picker
  is expected to always send a chosen emoji; no backend-side validation against
  the curated list is performed (per §25 shared contract note).
- None else. All endpoints were exercised via the live server (`run.sh`), the
  FastAPI TestClient, and verified for status codes, defaults, partial edits, and
  validation (422) / auth (401) behavior.

## Status

- [x] Complete
- [ ] Needs review