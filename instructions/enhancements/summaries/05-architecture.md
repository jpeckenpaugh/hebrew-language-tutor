# Summary: Architect (Stage 05)

- **Date:** 2026-08-29
- **Author / Executor:** opencode (deepseek-v4-flash), as Stage 05 role
- **Instruction file:** `instructions/enhancements/05-architecture.md`
- **Scope reference:** `enhancements/scope.md`
- **Commit:** `stage 05: extend architecture spec for sprint 02 UI/UX refinements`

## Work Completed

Read `enhancements/scope.md`, all seven `features/briefs/*.md` (01–07), the
existing `docs/architecture.md` (Part A v0.1 + Part B Sprint 01), and the
environment definition (`requirements.txt`, `environment-notes.md`). Appended a
clearly-marked **Part C — Sprint 02 Enhancement Pass (UI/UX refinements)**
section to `docs/architecture.md` describing the deltas for features a–g,
without rewriting Parts A or B.

Per scope constraint **i**, the pass is frontend-focused with a single permitted
backend addition. Part C therefore defines **one new public API contract**
(`GET /api/users`), explicitly states **no schema changes**, and documents the
frontend-only responsibility and state-flow changes for all other features.
Sections continue the Part B numbering (§16–§21) to keep the spec internally
consistent.

## Outputs Produced / Modified

- `docs/architecture.md` — **modified** (extended): appended Part C (§16–§21),
  additive to the existing v0.1 (Part A) and Sprint 01 (Part B) specs.
- `instructions/enhancements/summaries/05-architecture.md` — new summary.

## Key Decisions

- **Single backend delta:** only a new public `GET /api/users` endpoint (no
  auth, shown pre-sign-in on the Title screen) returning the standard
  `{"data": [{"id", "username"}, …]}` envelope, requiring a new route registered
  in `backend/app/main.py`. Confirmed with human direction.
- **Admin sign-out is frontend-only (feature c):** confirmed the existing
  `POST /api/admin/logout` already invalidates the token and returns
  `{"data": {"logged_out": true}}`; the mis-routing is purely the frontend
  calling `goAdmin()` instead of `goTitle()`. **No API change** for feature c.
- **No schema changes:** all tables (`users`, `lessons`, `vocab`, `scores`,
  `attempt_items`, `known_words`) are unchanged; the list endpoint reads the
  existing `users` table.
- **Terms-text size (feature d):** recorded as a frontend CSS responsibility
  with no fixed value; Stage 7 chooses the concrete size.
- **Empty picker state (feature a):** frontend-only, driven by an empty array
  from `GET /api/users`.

## Open Questions & Concerns

- The `backend/app/main.py` router registration and a user-list Pydantic schema
  are deferred to Stage 6, which must provide them per Part C §17/§19/§20.
- Stage 7 must implement the picker dropdown, the Create Account modal (reusing
  existing `signup`), the Admin "Log out"→`goTitle()` routing fix, the CSS text
  enlargement, the inline TTS icons, and the nav/badge removals. None require
  further backend work beyond `GET /api/users`.
- No schema or contract ambiguities remain; the single permitted backend
  addition is unambiguous.

## Status

- [x] Complete
- [ ] Needs review