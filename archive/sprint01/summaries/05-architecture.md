# Summary: Architect (Stage 05)

- **Date:** 2026-08-29
- **Author / Executor:** opencode (deepseek-v4-flash)
- **Instruction file:** `instructions/enhancements/05-architecture.md`
- **Scope reference:** `enhancements/scope.md`
- **Commit:** `stage 05: specify schema, API, and responsibility deltas for learner identity, pronunciation, and progress`

## Work Completed

Extended the existing v0.1 technical specification (`docs/architecture.md`) with
a clearly-marked **Part B** section describing the architectural deltas for the
sprint 01 enhancement pass (features a–h). The v0.1 spec (Part A) was preserved
in full; additions are additive, and the two now-superseded v0.1 non-goals are
explicitly flagged in Part B rather than silently edited out of section 9.

The Part B section defines: new/modified data model tables, application state
flow changes, backend/frontend responsibility changes, new and modified API
contracts, updated component interactions, and an explicit list of what remains
unchanged / out of scope.

## Outputs Produced / Modified

- `docs/architecture.md` — **modified** (existing v0.1 artifact) by appending
  "Part B — Sprint 01 Enhancement Pass" (sections 10–15). No Part A content was
  rewritten or removed.
- `instructions/enhancements/summaries/05-architecture.md` — **new** summary.

## Key Decisions

- **Schema:** added `users`, `attempt_items`, and `known_words` tables; added
  `vocab.transliteration` and `scores.user_id` columns. No existing columns or
  tables were removed.
- **Session:** because there is no password, identity uses an opaque **user
  session token** issued on signup/login and sent as `Authorization: Bearer` on
  user-scoped calls — mirroring the existing admin-token pattern but as a
  separate token namespace, keeping the dummy admin gate untouched.
- **Known-word derivation is exam-only** and server-side: the frontend sends
  per-item `answers` on `POST /api/scores`; the backend stores `attempt_items`
  and upserts `known_words` (UNIQUE(user_id, vocab_id)) only for correct exam
  answers.
- **Incorrect-answer review** is derived from `attempt_items` per attempt and
  returned via `GET /api/scores/{id}/review`, filtered to the current user.
- **Text-to-speech** is entirely client-side via the browser Web Speech API; no
  backend audio endpoint. This keeps the environment (Stage 4) unchanged.
- Consolidated quiz+exam review into the single `POST /api/scores` endpoint
  (via `answers`) to avoid a parallel submission path and keep the backend the
  source of truth for known-word derivation.

## Open Questions & Concerns

- **Transliteration values for seed data:** the 50 seed vocab items need a
  transliteration supplied by the Backend stage (Stage 6). The architecture
  assumes `transliteration` is NOT NULL, so Stage 6 must backfill seed data on
  migration; otherwise the column must be nullable or defaulted. Flagging so
  Stage 6 does not guess.
- **Session token persistence scope:** the architecture uses an opaque user
  token but does not specify token expiry/rotation (matches the lightweight,
  no-password intent). Confirm with product that tokens may be long-lived.
- **Quiz vs exam `answers`:** Brief 06's review applies to both quiz and exam,
  so `answers` are sent for both modes; known-word derivation applies only to
  exam. Stage 6 must gate `known_words` on `mode == "exam"`.
- **`GET /api/auth/me`** is an optional convenience; Stage 7 should confirm it
  wants it or rely on a sign-in state flag instead.

## Status

- [x] Complete
- [ ] Needs review