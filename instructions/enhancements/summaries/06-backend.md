# Summary: Backend Engineer (Stage 6)

- **Date:** 2026-08-29
- **Author / Executor:** Backend Engineer (stage 06)
- **Instruction file:** `instructions/enhancements/06-backend.md`
- **Scope reference:** `enhancements/scope.md`
- **Commit:** `stage 06: implement learner identity, pronunciation, and progress backend`

## Work Completed

Extended the existing v0.1 FastAPI backend to implement the Sprint 01
enhancements (learner identity, pronunciation guide, text-to-speech data support,
per-user score history, incorrect-answer review, and known-word progress). No
v0.1 endpoints or behavior were removed; the changes are additive per
`docs/architecture.md` Part B.

Implemented:
- **Learner accounts & session** — new `users` table; `POST /api/auth/signup`,
  `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, with an
  opaque, in-memory user session token (no password) in a namespace separate from
  the v0.1 admin token.
- **Transliteration** — new `vocab.transliteration` column; all reads
  (`GET /api/lessons/{id}`, `GET /api/lessons/{id}/vocab`) now return it; admin
  create/edit accept it; seed data extended so all 50 items carry a
  transliteration.
- **Per-user scores** — `scores.user_id` column; `POST /api/scores` derives the
  user from the session token, stores per-item results in `attempt_items`, and
  upserts `known_words` for correct exam answers (exam-only); `GET /api/scores`
  is filtered to the signed-in user.
- **Incorrect-answer review** — `GET /api/scores/{id}/review` returns the wrong
  items (with correct answer) for the signed-in user's attempt.
- **Progress** — new `progress` router; `GET /api/lessons/{id}/progress` returns
  per-user known-word counts/ids from `known_words`.
- **Text-to-speech** — no backend change required (feature b is fully client-side
  via the Web Speech API).

## Outputs Produced / Modified

- `backend/app/db.py` (modified) — new tables (`users`, `attempt_items`,
  `known_words`), `vocab.transliteration`, `scores.user_id`, schema migration,
  seed insertion now includes transliteration.
- `backend/app/seed.py` (modified) — all 50 vocab tuples extended with a
  transliteration (backend-authored content; see Key Decisions).
- `backend/app/models.py` (modified) — new/changed Pydantic schemas for the
  contracts above.
- `backend/app/routers/auth.py` (new) — learner signup/login/logout/me + token
  dependency.
- `backend/app/routers/scores.py` (modified) — per-user score persistence,
  `answers`/`attempt_items`, exam-only `known_words` upsert, review endpoint,
  per-user history.
- `backend/app/routers/progress.py` (new) — known-word progress endpoint.
- `backend/app/routers/catalog.py` (modified) — vocab reads return
  `transliteration`.
- `backend/app/routers/admin.py` (modified) — vocab create/edit accept
  `transliteration`.
- `backend/app/main.py` (modified) — mounts `auth` and `progress` routers.
- `backend/english_tutor.db` (modified, tracked) — migrated live DB (see Key
  Decisions).

## Key Decisions

- **Schema migration on existing live DB.** The tracked `english_tutor.db`
  already contained rows (6 lessons, 51 vocab, 2 scores from earlier manual
  testing). Migration used `ALTER TABLE vocab ADD COLUMN transliteration …` with
  backfill from the seed content. The two pre-existing `scores` rows were orphaned
  (no user identity) and, per feature 03, a saved attempt must belong to a
  signed-in user; the `scores` table was therefore recreated with a `NOT NULL`
  `user_id` and those two rows were dropped. This is the only data discarded and
  is intentional/documented; no in-scope user data existed yet.
- **Transliteration backfill gaps.** Two vocab items did not match seed content
  (a manually edited "hello" item and the extra "Travel" lesson item), so their
  `transliteration` remained `""`. They satisfy the `NOT NULL` constraint; admin
  should supply values. The frontend should render a missing/empty transliteration
  gracefully.
- **Backend-authored seed content.** All transliteration values were authored by
  this stage (the spec defined shape/quantity, not content). Downstream roles
  should treat these as default content.
- **Session tokens are in-memory.** Learner tokens are issued at signup/login and
  discarded on logout; they do not survive a server restart. This mirrors the
  v0.1 admin dummy gate and is faithful to the contract (no credential
  verification, constraint k). `POST /api/auth/me` is provided so the frontend can
  re-validate a stored token on load.
- **Run script unchanged.** `run.sh` (entry `app.main:app`) already matches the
  backend layout; no adjustment was needed.

## Open Questions & Concerns

- **Empty transliterations** on the two non-seed vocab items — admin should
  populate; frontend should tolerate an empty string.
- **In-memory tokens** are not persistent; a server restart invalidates learner
  sessions (acceptable for the lightweight design, but the frontend should handle
  401 on load by returning to the Title screen).
- **Known-word derivation is exam-only** per Brief 07; quiz/study do not create
  `known_words` rows. The frontend should only send per-item `answers` that the
  backend can attribute; quiz attempts still store `attempt_items` but never mark
  words known.

## Status

- [x] Complete
- [ ] Needs review