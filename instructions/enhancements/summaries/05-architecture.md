# Summary: Architect (Stage 5)

- **Date:** 2026-08-29
- **Author / Executor:** Architect (Stage 5)
- **Instruction file:** `instructions/enhancements/05-architecture.md`
- **Scope reference:** `enhancements/scope.md`
- **Commit:** `stage 05: extend architecture spec for sprint 03 lessons level/emoji`

## Work Completed

Extended `docs/architecture.md` with a new **Part D — Sprint 03 Enhancement
Pass** section. The pass is a mixed, frontend-focused sprint; the only backend
additions are the `lessons.level` (1–5) and `lessons.emoji` fields. The section
defines the schema delta, the migration approach, the API contract changes, the
seed back-fill, the backend/frontend responsibility split, component
interactions, and an explicit out-of-scope list. It extends (does not replace)
the v0.1 spec (Part A) and the Sprint 01 / 02 specs (Parts B, C).

## Outputs Produced / Modified

- `docs/architecture.md` — modified (extended) with Part D (§22–§27):
  - §22 Data model / schema: `lessons.level` (INTEGER, NOT NULL, DEFAULT 1) and
    `lessons.emoji` (TEXT, NOT NULL, DEFAULT '📘'); migration via
    `_add_lesson_level` / `_add_lesson_emoji` helpers wired into `_migrate`,
    following the existing `_add_*`/`ALTER TABLE ADD COLUMN` pattern.
  - §22 Seeding: five seeded lessons at Level 1 with the specified emojis.
  - §23 API contracts: `level`/`emoji` added to `GET /api/lessons` and
    `GET /api/lessons/{id}`; `POST /api/admin/lessons` accepts optional
    `level`/`emoji` (defaults 1 / 📘); `PUT /api/admin/lessons/{id}` accepts
    optional partial-update `level`/`emoji`.
  - §24–§26 state flow, responsibilities, and component interactions,
    including the frontend-only items (a–h).
  - §27 explicitly unchanged / out of scope.

## Key Decisions

- **Migration:** `ALTER TABLE ADD COLUMN` with defaults (no drop-and-recreate),
  reusing the established `_migrate`/`_add_*` pattern already in `db.py`.
- **Default emoji:** placeholder `📘` so admin-created lessons without a chosen
  emoji are unambiguous (NOT NULL).
- **Detail response:** both `level` and `emoji` returned in
  `GET /api/lessons/{id}` (consistent with the list response); Lesson screen
  uses `level`, the extra `emoji` is harmless (emoji renders on Catalog only).
- **Validation:** out-of-range `level` → 422 (not clamped); `emoji` validated as
  a non-empty string only (no single-character/length restriction, since emoji
  may be multi-codepoint).
- **Partial-edit:** `PUT /api/admin/lessons/{id}` keeps partial-edit semantics
  consistent with the vocab PUT — `level`/`emoji` optional, only provided fields
  updated; existing `title` behavior unchanged.

## Open Questions & Concerns

- None blocking. Two runtime capabilities (Web Speech API for Auto-Play, View
  Transitions API for page transitions) are frontend-only with graceful
  fallback, owned by the Frontend Engineer stage (Stage 7); documented in
  `environment-notes.md` and referenced in Part D.
- Backend Engineer (Stage 6) should confirm the `_add_lesson_level` /
  `_add_lesson_emoji` helpers are wired into `_migrate` and that the seed
  back-fill updates the five seeded rows idempotently, consistent with the
  existing transliteration precedent.

## Status

- [x] Complete
- [ ] Needs review