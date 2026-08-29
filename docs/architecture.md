# Architecture — English/Hebrew Language Tutor

This document is the technical specification for the English/Hebrew Language
Tutor. It defines the shape of the code — structure, data model, API contracts,
and responsibilities — so that the Backend (Stage 6) and Frontend (Stage 7)
engineers can implement independently without guessing at interfaces.

This is reference documentation, not code. Product behavior is defined by
`concept.md` and `features/briefs/*.md`; nothing here changes product
requirements.

## 1. Technical stack

- **Backend:** FastAPI (Python 3.9+) run under Uvicorn. Entry point
  `app.main:app` (consistent with `run.sh`).
- **Database:** SQLite via the Python standard library (no driver package).
- **Frontend:** Plain HTML/CSS/JS with Bootstrap 5.3.3 hosted locally under
  `frontend/static/vendor/bootstrap/`.
- **Single source of truth:** the backend API serves all application state
  (lessons, vocabulary, saved scores/attempts). The frontend holds no
  authoritative copy.

## 2. Project / file structure

```
.
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app, mounts routers, static, entry point
│   │   ├── db.py                # SQLite connection, schema init, seed data
│   │   ├── models.py            # Pydantic request/response schemas (contracts)
│   │   ├── seed.py              # 5 lessons x 10 vocab items (invoked on init)
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── catalog.py       # lesson catalog + lesson detail/vocab
│   │       ├── scores.py        # record & read quiz/exam scores
│   │       └── admin.py         # admin login gate + lesson/vocab CRUD
│   └── english_tutor.db         # SQLite database file (created at runtime)
├── frontend/
│   ├── index.html               # single-page app shell + navigation
│   ├── css/style.css            # app styles (Bootstrap is a vendor asset)
│   ├── js/app.js                # app controller / navigation / API client
│   ├── js/views.js              # rendering of catalog, modes, admin, scores
│   └── static/vendor/bootstrap/ # Bootstrap CSS/JS (already provisioned)
├── requirements.txt             # pinned Python deps (Stage 4)
├── install.sh                   # environment provisioning (Stage 4)
├── run.sh                       # start Uvicorn -> app.main:app (Stage 4)
└── docs/architecture.md         # this file
```

## 3. Module boundaries

- **`app/main.py`** — creates the FastAPI `app`, registers CORS if needed,
  mounts the API routers, and serves the frontend static files. The single
  object named `app` that `run.sh` (`app.main:app`) imports.
- **`app/db.py`** — owns the SQLite connection lifecycle, creates tables if
  absent, and seeds the 5 lessons / 50 vocab items on first run. No business
  logic.
- **`app/models.py`** — Pydantic schemas only; defines every request/response
  contract in section 6. Used by routers for validation and serialization.
- **`app/routers/catalog.py`** — read-only endpoints for the lesson catalog,
  lesson detail, and per-lesson vocabulary.
- **`app/routers/scores.py`** — records completed quiz/exam attempts and
  returns saved score history.
- **`app/routers/admin.py`** — the admin sign-in gate and the
  modify/add operations for lessons and vocabulary. Every mutating route
  requires an admin token.
- **`frontend/js/app.js`** — fetches state from the API, drives navigation and
  the study/quiz/exam/admin flows.
- **`frontend/js/views.js`** — pure rendering of screens from the data the API
  returns; never fabricates lesson/vocab data.

## 4. Data model and database schema

SQLite, tables created by `app/db.py` on startup if missing.

### `lessons`

| column    | type    | notes                          |
|-----------|---------|--------------------------------|
| `id`      | INTEGER | PRIMARY KEY AUTOINCREMENT      |
| `title`   | TEXT    | lesson name (NOT NULL)         |
| `created_at` | TEXT | ISO timestamp (NOT NULL)     |

### `vocab`

| column      | type    | notes                                   |
|-------------|---------|-----------------------------------------|
| `id`        | INTEGER | PRIMARY KEY AUTOINCREMENT               |
| `lesson_id` | INTEGER | FK -> lessons.id (NOT NULL)             |
| `english`   | TEXT    | English form (NOT NULL)                 |
| `hebrew`    | TEXT    | Hebrew translation (NOT NULL)           |

- Each lesson owns exactly 10 vocab items (seed) — enforced by seeding; admin
  can add items, so a lesson may exceed 10 after admin edits, but the seed and
  default content is exactly 10.
- A vocab item belongs to exactly one lesson (FK).

### `scores`

| column     | type    | notes                                   |
|------------|---------|-----------------------------------------|
| `id`       | INTEGER | PRIMARY KEY AUTOINCREMENT               |
| `lesson_id`| INTEGER | FK -> lessons.id (NOT NULL)             |
| `mode`     | TEXT    | `'quiz'` or `'exam'` (NOT NULL)         |
| `correct`  | INTEGER | number of correct answers (NOT NULL)    |
| `total`    | INTEGER | total questions (NOT NULL)              |
| `score_pct`| REAL    | correct/total * 100 (NOT NULL)          |
| `taken_at` | TEXT    | ISO timestamp of completion (NOT NULL)  |

- Scores are **global / per-lesson**; there is no user identity column. They
  persist across reloads and sessions in SQLite, and are read back to show
  history.

### Seeding

On first run, `db.py` seeds **5 lessons**, each with **10** English/Hebrew
vocab pairs (50 items total). Seeding is idempotent (skip if lessons already
exist) so restarts do not duplicate data.

## 5. Application state flow

1. **Load:** the frontend fetches the catalog from `GET /api/lessons`.
2. **Open a lesson:** the frontend fetches `GET /api/lessons/{id}` (or
   `/vocab`) to get that lesson's 10 items.
3. **Study mode:** renders the fetched vocab pairs; no scoring, no API writes.
4. **Quiz mode:** builds multiple-choice questions client-side from the served
   vocab (correct answer is the item; distractors are other items from the same
   lesson). On each answer the frontend gives immediate
   correct/incorrect feedback using the served correct answer. On completion it
   `POST`s the attempt to `/api/scores`.
5. **Exam mode:** same question construction, but no per-question feedback.
   On submission the frontend computes the result and `POST`s it to
   `/api/scores`, then shows the results.
6. **Admin:** the user signs in via `POST /api/admin/login` to obtain a token;
   thereafter mutating admin calls are sent with that token. After a save, the
   frontend re-fetches the catalog/lesson so study/quiz/exam reflect updates.
7. **Scores:** `GET /api/scores` returns history for display.

The backend is always the authority; the frontend only reflects what the API
returns.

## 6. API contracts

All endpoints return JSON. Base path `/api`. Unless stated, a response has the
form `{"data": ...}` on success.

### Lesson catalog & vocabulary (read-only)

**`GET /api/lessons`**
- 200 → `{"data": [ { "id": 1, "title": "…", "vocab_count": 10 }, … ]}`

**`GET /api/lessons/{lesson_id}`**
- 200 → `{"data": { "id": 1, "title": "…", "vocab": [ {"id": 1, "english": "…", "hebrew": "…"}, … ] }}`
- 404 → `{"detail": "Lesson not found"}`

**`GET /api/lessons/{lesson_id}/vocab`**
- 200 → `{"data": [ {"id": 1, "english": "…", "hebrew": "…"}, … ]}`
- 404 → `{"detail": "Lesson not found"}`

### Scores

**`POST /api/scores`**
- Request body: `{"lesson_id": 1, "mode": "quiz"|"exam", "correct": 8, "total": 10}`
- `score_pct` computed server-side (`correct/total*100`).
- 201 → `{"data": { "id": 1, "lesson_id": 1, "mode": "quiz", "correct": 8, "total": 10, "score_pct": 80.0, "taken_at": "…" }}`
- 422 → validation error (invalid lesson, mode, or counts).

**`GET /api/scores`**
- 200 → `{"data": [ { "id": 1, "lesson_id": 1, "mode": "quiz", "correct": 8, "total": 10, "score_pct": 80.0, "taken_at": "…" }, … ]}` ordered most recent first.

### Admin

Admin auth is a **dummy sign-in gate** (no real password verification, by
design). A successful login returns a token the client must send on mutating
requests; any mutating admin route without a valid token returns 401.

**`POST /api/admin/login`**
- Request body: `{"username": "…", "password": "…"}` — any non-empty `password` is accepted.
- 200 → `{"data": {"token": "<opaque-token>", "admin": true}}`
- 400 → `{"detail": "Credentials required"}` if username/password empty.

**`POST /api/admin/logout`** (Bearer token)
- 200 → `{"data": {"logged_out": true}}`

**`POST /api/admin/lessons`** (Bearer token)
- Request body: `{"title": "…"}` (new lesson; seeded with no vocab, then items added via below).
- 201 → `{"data": {"id": N, "title": "…", "vocab": []}}`
- 401 → invalid/missing token.

**`PUT /api/admin/lessons/{lesson_id}`** (Bearer token)
- Request body: `{"title": "…"}`.
- 200 → `{"data": {"id": N, "title": "…"}}`; 404 if lesson missing.

**`POST /api/admin/lessons/{lesson_id}/vocab`** (Bearer token)
- Request body: `{"english": "…", "hebrew": "…"}`.
- 201 → `{"data": {"id": N, "lesson_id": L, "english": "…", "hebrew": "…"}}`; 404 if lesson missing.

**`PUT /api/admin/vocab/{vocab_id}`** (Bearer token)
- Request body: `{"english": "…", "hebrew": "…"}` (both optional for partial edit; at least one present).
- 200 → `{"data": {"id": N, "lesson_id": L, "english": "…", "hebrew": "…"}}`; 404 if item missing.

**Auth header:** mutating admin routes accept `Authorization: Bearer <token>`.
A missing/invalid token → `401 {"detail": "Not authenticated"}`.

## 7. Backend vs frontend responsibilities

### Backend (Stage 6) owns
- SQLite schema, connection, and idempotent seeding.
- All application state as the single source of truth.
- The API endpoints above (validation, serialization, status codes).
- The admin auth gate (token issuance + enforcement on mutating routes).
- Persistence of scores/attempts.

### Frontend (Stage 7) owns
- Rendering screens from API data (catalog, study, quiz, exam, scores, admin).
- Navigation between sections/lessons/modes without page reloads.
- Multiple-choice question construction from served vocab (both quiz and exam).
- Immediate per-question feedback in quiz mode; deferred results in exam mode.
- Calling the admin API and sending the token on mutating calls.
- Displaying saved scores/attempts from the backend.

### Shared contract notes
- Question construction: the frontend builds choices from the lesson's 10
  vocab items; one correct choice is the item being asked, the other choices
  are drawn from the remaining items of the same lesson.
- The frontend must never embed its own copy of lessons/vocab; it always
  renders what the API returns.

## 8. Component interactions

```
Browser (frontend/static, Bootstrap)
   |
   | fetch()  JSON  over /api/...   (GET/POST/PUT; Bearer token for admin)
   v
FastAPI app (app.main:app)
   |-- routers/catalog.py  -> read lessons/vocab
   |-- routers/scores.py   -> record + read attempts
   |-- routers/admin.py    -> login gate + mutate lessons/vocab
   |-- models.py           -> Pydantic validation/serialization
   v
db.py -> SQLite (lessons, vocab, scores)
```

Application state always flows backend → frontend. User actions that change
state (score completion, admin edits) flow frontend → backend via the API and
persist in SQLite.

## 9. Non-goals (per requirements)

- No deletion of lessons/vocab (not requested).
- No per-user accounts beyond the dummy admin gate.
- No analytics/reporting beyond viewing saved scores.
- No additional learning aids (audio, flashcards games, etc.).
- No complex routing framework; basic navigation only.

---

# Part B — Sprint 01 Enhancement Pass (learner identity, pronunciation, progress)

This section defines the architectural deltas required by `enhancements/scope.md`
and `features/briefs/*.md` (features a–h). It **extends** the v0.1 spec in Part A
above; it does not replace it. Every item in Part A remains in force unless
explicitly superseded below.

**Superseded v0.1 non-goals:** the following lines from section 9 are now
explicitly in scope for this pass and no longer apply as non-goals:
- "No per-user accounts beyond the dummy admin gate" → superseded by features c–h
  (learner accounts, per-user scores, known-word tracking). The existing *dummy
  admin gate* itself is unchanged (feature e).
- "No additional learning aids (audio, …)" → superseded by features a–b
  (transliteration guide and text-to-speech).

All other Part A contracts remain unchanged where not described below.

## 10. Data model and database schema changes

New/changed tables are created by `app/db.py` on startup if absent (same
idempotent pattern as v0.1). No existing column or table is removed.

### `users` (new)

| column      | type    | notes                              |
|-------------|---------|------------------------------------|
| `id`        | INTEGER | PRIMARY KEY AUTOINCREMENT          |
| `username`  | TEXT    | non-empty, UNIQUE (NOT NULL)       |
| `created_at`| TEXT    | ISO timestamp (NOT NULL)           |

- There is **no password** column (feature c, constraint k). Identity is a
  non-empty, unique username only.

### `vocab` (modified — add one column)

| column           | type | notes                                            |
|------------------|------|--------------------------------------------------|
| `transliteration`| TEXT | English pronunciation guide for the Hebrew word (NOT NULL) |

- Every vocab item has a transliteration (feature a, Brief 04). Existing seed
  data is extended so all 50 items carry a transliteration; admin-create/edit
  must supply one. The `english` and `hebrew` columns are unchanged.

### `scores` (modified — add one column)

| column    | type    | notes                                    |
|-----------|---------|------------------------------------------|
| `user_id` | INTEGER | FK -> users.id (NOT NULL)                |

- Every saved attempt is tied to a user (feature d, Brief 03). v0.1 columns
  (`lesson_id`, `mode`, `correct`, `total`, `score_pct`, `taken_at`) are
  unchanged. Scores are no longer global; they are per-user per-lesson.

### `attempt_items` (new)

| column    | type    | notes                                    |
|-----------|---------|------------------------------------------|
| `id`      | INTEGER | PRIMARY KEY AUTOINCREMENT                |
| `score_id`| INTEGER | FK -> scores.id (NOT NULL)               |
| `vocab_id`| INTEGER | FK -> vocab.id (NOT NULL)                |
| `correct` | INTEGER | 1 = answered correctly, 0 = wrong (NOT NULL) |

- Records the per-item result of a completed quiz/exam so the incorrect-answer
  review (feature g) can be reconstructed per attempt. Populated from the
  `answers` payload on `POST /api/scores` (see section 13).

### `known_words` (new)

| column    | type    | notes                                    |
|-----------|---------|------------------------------------------|
| `id`      | INTEGER | PRIMARY KEY AUTOINCREMENT                |
| `user_id` | INTEGER | FK -> users.id (NOT NULL)                |
| `vocab_id`| INTEGER | FK -> vocab.id (NOT NULL)                |
| `known_at`| TEXT    | ISO timestamp when the word became known (NOT NULL) |
| UNIQUE    |         | (`user_id`, `vocab_id`)                  |

- A word becomes "known" for a user when they answer it **correctly on an exam**
  (feature h, Brief 07). The `UNIQUE(user_id, vocab_id)` constraint makes
  upsert idempotent (re-answering correctly does not duplicate). Quiz and study
  never create `known_words` rows.

## 11. Application state flow changes

The v0.1 flow (Part A section 5) is extended as follows:

1. **Open app → Title screen.** Instead of opening straight into the main
   content, the frontend shows a Title screen (feature e). The user either signs
   in / creates an account (feature c) or enters the Admin area (unchanged dummy
   gate).
2. **Session token.** On successful sign-in/account creation the backend issues
   an opaque user token. The frontend stores it and sends it as
   `Authorization: Bearer <user-token>` on all user-scoped calls. This is a
   lightweight session; it is not a password and carries no credential
   verification (constraint k).
3. **Logout.** A logout control in the main UI (feature f) calls
   `POST /api/auth/logout`, discards the token, and returns to the Title screen.
   Works for both student and admin.
4. **Study mode** now displays the Hebrew word, English form, and the English
   transliteration (feature a), and offers text-to-speech buttons to speak the
   English and Hebrew forms (feature b). No API writes.
5. **Quiz / exam completion** `POST`s the attempt with the per-item `answers`
   (section 13). The backend records the score, stores `attempt_items`, and —
   **only for exam mode** — upserts `known_words` for correct items.
6. **Incorrect review (feature g):** after a quiz/exam the user can request
   `GET /api/scores/{id}/review` to see their wrong answers with the correct
   answer shown.
7. **Score history (feature d):** `GET /api/scores` returns only the signed-in
   user's attempts (server-side filter by session token).
8. **Progress (feature h):** the frontend fetches
   `GET /api/lessons/{id}/progress` to show per-user known-word progress (e.g.,
   "4 of 10 known").

The backend remains the single source of truth (constraint j); the frontend only
reflects what the API returns and holds no authoritative user/scores/progress
state.

## 12. Backend vs frontend responsibility changes

### Backend (Stage 6) additionally owns
- `users`, `attempt_items`, `known_words` tables; `vocab.transliteration`; the
  `scores.user_id` column; migration/seed extension.
- Username sign-in/account creation, user session-token issuance, and enforcing
  the token on all user-scoped routes.
- Filtering score history and progress to the current user.
- Deriving "known" words from correct exam answers (upsert into `known_words`).
- Returning the per-attempt incorrect-answer review.
- Including `transliteration` in vocab create/edit and read contracts.

### Frontend (Stage 7) additionally owns
- The Title screen (sign-in / account create / Admin entry) and the main-UI
  logout control.
- Storing the user session token and sending it on user-scoped calls.
- Text-to-speech via the browser's Web Speech API (`SpeechSynthesis`) for the
  English and Hebrew forms in study mode (feature b). This is entirely
  client-side; no backend audio endpoint is added.
- Displaying the transliteration in study mode.
- Requesting and rendering the incorrect-answer review and per-user progress.

### Shared contract notes
- The frontend builds quiz/exam questions from served vocab exactly as in v0.1,
  and sends per-item results in the `answers` payload so the backend can derive
  review and known words. The backend is the authority on known-word derivation.

## 13. API contract changes

All additions follow the same conventions as Part A: JSON, base path `/api`,
`{"data": ...}` on success. User-scoped routes require
`Authorization: Bearer <user-token>`; missing/invalid token → `401
{"detail": "Not authenticated"}`.

### Learner identity / session (features c, e, f)

**`POST /api/auth/signup`** (create account)
- Request body: `{"username": "…"}` (non-empty).
- 201 → `{"data": {"user": {"id": 1, "username": "…"}, "token": "<opaque-user-token>"}}`
- 409 → `{"detail": "Username already exists"}` if taken.
- 422 → validation error if `username` is empty.

**`POST /api/auth/login`** (sign in — no password)
- Request body: `{"username": "…"}` (non-empty).
- 200 → `{"data": {"user": {"id": 1, "username": "…"}, "token": "<opaque-user-token>"}}`
- 401 → `{"detail": "User not found"}` if the username does not exist.
- 422 → validation error if `username` is empty.

**`POST /api/auth/logout`** (Bearer user token)
- 200 → `{"data": {"logged_out": true}}`
- 401 → invalid/missing token.

**`GET /api/auth/me`** (Bearer user token) — optional convenience for the
frontend to validate a stored token on load.
- 200 → `{"data": {"id": 1, "username": "…"}}`
- 401 → invalid/missing token.

### Vocabulary (features a; modified read + admin contracts)

All vocab reads (`GET /api/lessons/{id}`, `GET /api/lessons/{id}/vocab`) return
each item with the new `transliteration` field:

```
{"id": 1, "english": "…", "hebrew": "…", "transliteration": "…"}
```

Admin create/edit now accept `transliteration`:
- `POST /api/admin/lessons/{lesson_id}/vocab`
  - Body: `{"english": "…", "hebrew": "…", "transliteration": "…"}`.
- `PUT /api/admin/vocab/{vocab_id}`
  - Body: any subset of `{english, hebrew, transliteration}` (at least one present).

### Scores (features d, g; modified)

**`POST /api/scores`** (Bearer user token) — extended with per-item `answers`.
- Request body:
  ```
  {
    "lesson_id": 1,
    "mode": "quiz"|"exam",
    "correct": 8,
    "total": 10,
    "answers": [ {"vocab_id": 1, "correct": true}, ... ]
  }
  ```
- `user_id` is derived server-side from the session token (not sent by client).
- 201 → `{"data": { ...v0.1 score fields..., "user_id": 1 }}`
- Backend stores each `answers` row in `attempt_items`. If `mode == "exam"`, for
  each `correct: true` answer it upserts a `known_words` row for this user
  (feature h).
- 422 → validation error (bad lesson, mode, counts, or `answers` shape).

**`GET /api/scores`** (Bearer user token) — now filtered to the current user.
- 200 → `{"data": [ {score fields..., "user_id": 1}, ... ]}` — only the signed-in
  user's attempts, most recent first.

**`GET /api/scores/{score_id}/review`** (Bearer user token) — feature g.
- 200 → `{"data": {"id": <score_id>, "lesson_id": 1, "mode": "exam", "wrong": [ {"vocab_id": 3, "english": "…", "hebrew": "…", "transliteration": "…"}, ... ]}}`
  where `wrong` lists only the items answered incorrectly for that attempt, with
  the correct answer shown (the item itself is the correct answer, per v0.1
  multiple-choice construction).
- 404 → if the attempt does not exist or does not belong to the current user.
- 401 → invalid/missing token.

### Progress (feature h; new)

**`GET /api/lessons/{lesson_id}/progress`** (Bearer user token)
- 200 → `{"data": {"lesson_id": 1, "total": 10, "known": 4, "known_vocab_ids": [2, 5, 7, 9]}}`
- `known` is the count of this lesson's vocab items in `known_words` for the
  current user; `known_vocab_ids` lists them. 404 if lesson missing.

## 14. Component interaction changes

```
Browser (frontend/static, Bootstrap, Web Speech API for TTS)
   |
   | fetch() JSON over /api/...
   |   user-scoped calls carry Authorization: Bearer <user-token>
   |   admin mutating calls carry Authorization: Bearer <admin-token>  (unchanged)
   v
FastAPI app (app.main:app)
   |-- routers/auth.py   (new)  -> signup / login / logout / me
   |-- routers/catalog.py       -> read lessons/vocab (+ transliteration)
   |-- routers/scores.py        -> record attempt + answers, review, per-user history
   |-- routers/progress.py (new) -> per-user known-word progress
   |-- routers/admin.py         -> login gate + mutate lessons/vocab (unchanged + transliteration)
   |-- models.py                -> Pydantic schemas for new/changed contracts
   v
db.py -> SQLite (lessons, vocab, scores, users, attempt_items, known_words)
```

- A user session token authorizes read/write of that user's scores, known words,
  and review. Admin token (v0.1) continues to authorize admin mutations.
- Text-to-speech stays entirely in the browser via the Web Speech API; no audio
  is transmitted to or from the backend.

## 15. Explicitly unchanged / out of scope

- The existing **dummy admin gate** (`POST /api/admin/login` and admin token
  enforcement) is unchanged (feature e, scope note). Admin and learner identity
  are separate token namespaces.
- v0.1 `lessons` table, catalog endpoints, and study/quiz/exam mechanics
  (question construction, immediate quiz feedback, deferred exam results) are
  unchanged.
- `vocab.english` and `vocab.hebrew` semantics are unchanged; `transliteration`
  is an additive display aid (Brief 04).
- Known-word derivation is **exam-only**; quiz and study never create
  `known_words` rows (Brief 07).
- Quiz mode's immediate per-question feedback is unchanged (Brief 06).
- No password, email, profile, password-reset, retake, or explanations features
  (constraint i).
- Audio is limited to the English/Hebrew forms in study mode via the browser Web
  Speech API; no speed/voice controls, no quiz/exam audio (Brief 05).
- No unrequested analytics/reporting beyond per-user score history and
  known-word progress.

---

# Part C — Sprint 02 Enhancement Pass (UI/UX refinements)

This section defines the architectural deltas required by
`enhancements/scope.md` and `features/briefs/*.md` (features a–g). It **extends**
the v0.1 spec (Part A) and the Sprint 01 spec (Part B); it does not replace
either. Every item in Parts A and B remains in force unless explicitly
superseded below.

Sprint 02 is a frontend-focused UI/UX refinement. Per `enhancements/scope.md`
constraint **i**, the **only backend addition** is a single public, read-only
endpoint listing existing users (feature a, Brief 01). All other features are
frontend-only and require **no schema, API, or backend change**. No existing
column or table is added, removed, or modified in this pass.

## 16. Data model and database schema changes

**None.** The Sprint 02 pass introduces no schema changes. The existing
`users`, `lessons`, `vocab`, `scores`, `attempt_items`, and `known_words` tables
(Parts A and B) are unchanged. The list-users endpoint reads the existing
`users` table.

## 17. API contract changes

A single new endpoint is added. All additions follow the same conventions as
Parts A and B: JSON, base path `/api`, `{"data": ...}` on success.

### Users (feature a, Brief 01; new)

**`GET /api/users`** — **public, no auth** (shown on the Title screen before
sign-in).
- 200 → `{"data": [ {"id": 1, "username": "…"}, {"id": 2, "username": "…"}, … ]}`
  — one entry per existing user, ordered by implementation choice.
- Requires a new route handler registered in `backend/app/main.py` (per
  `environment-notes.md`, the FastAPI app is built/mounted there). This is the
  single in-scope backend addition (scope constraint i).
- No auth header; must succeed for an unauthenticated client on the Title
  screen.

### Unchanged / not modified
- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, and
  `GET /api/auth/me` — unchanged (Sprint 01). Account creation (Brief 02) reuses
  the existing `signup`; sign-in reuses the existing `login`, now driven by a
  selected username from the picker.
- `POST /api/admin/logout` — unchanged (Sprint 01). Feature c (admin sign-out)
  reuses it; it already invalidates the admin token and returns
  `{"data": {"logged_out": true}}`. **No API change for feature c.**
- All catalog, scores, progress, and admin vocab/lesson contracts — unchanged.

## 18. Application state flow changes

The Sprint 01 flow (Part B §11) is refined as follows:

1. **Title screen — sign-in picker (feature a, Brief 01).** On load the Title
   screen calls `GET /api/users` and renders a dropdown of existing usernames in
   place of the Sprint 01 free-text username field (which is removed). Selecting
   a name does **not** sign the user in; the user still clicks Sign In, which
   calls the existing `POST /api/auth/login` with the selected username. If the
   endpoint returns an empty array, the picker area instead shows a hint
   directing the user to Create Account (frontend-only behavior driven by an
   empty array).
2. **Create Account modal (feature b, Brief 02).** "Create Account" opens a
   modal asking for a non-empty username; submitting calls the existing
   `POST /api/auth/signup`. On success the modal closes and the user returns to
   the Title screen **not signed in**; the new account appears in the picker on
   refresh. No auto sign-in.
3. **Admin sign-out (feature c, Brief 03).** The Admin UI replaces its separate
   "Sign Out" button with a "Log out" control. Selecting it calls the existing
   `POST /api/admin/logout` (token invalidation is already handled by the
   backend) and then routes to the **main Title screen** (`goTitle()`) instead of
   the Admin Sign In screen (`goAdmin()`). This is a pure frontend routing fix;
   no backend change.
4. **Nav / sub-nav cleanup (features f, g; Briefs 06, 07).** The top nav drops
   the "Admin" link for signed-in users; the sub-nav drops the
   "Signed in as {User}" badge. Frontend-only rendering changes; no state-flow
   impact.

The backend remains the single source of truth; the frontend only reflects what
the API returns.

## 19. Backend vs frontend responsibility changes

### Backend (Stage 6) additionally owns
- The `GET /api/users` endpoint (read the existing `users` table; public, no
  auth), registered in `backend/app/main.py`.
- Nothing else changes in this pass.

### Frontend (Stage 7) additionally owns
- Replacing the free-text sign-in field with the picker dropdown fed by
  `GET /api/users`, including the empty-state "Create Account" hint (feature a).
- The Create Account modal and its validation flow, calling the existing signup
  endpoint without auto sign-in (feature b).
- The Admin "Log out" control, calling the existing `POST /api/admin/logout` and
  routing to the Title screen (`goTitle()`) instead of the Admin sign-in screen
  (feature c).
- Enlarging the English/Hebrew term text on Study, Quiz, and Exam screens via
  CSS; the concrete size is an implementation choice and must not break layout
  (feature d).
- Presenting TTS as small inline speaker icons beside each English and Hebrew
  term in Study cards, replacing the former separate-line buttons; reuses the
  existing Web Speech API affordance (feature e).
- Removing the "Admin" top-nav link for signed-in users (feature f) and the
  "Signed in as {User}" sub-nav badge (feature g).

### Shared contract notes
- The picker and modal are frontend presentation over the existing signup/login
  endpoints; the backend issues no new tokens and enforces no new identity in
  this pass.
- TTS remains entirely client-side (Web Speech API); no audio endpoint is added.

## 20. Component interaction changes

```
Browser (frontend/static, Bootstrap, Web Speech API for TTS)
   |
   | GET  /api/users                  (public; Title screen picker)
   | POST /api/auth/signup|login      (unchanged; create account / sign in)
   | POST /api/auth/logout            (unchanged; learner logout)
   | POST /api/admin/logout           (unchanged; admin logout -> Title screen)
   | ...other /api/... contracts unchanged (Parts A & B)
   v
FastAPI app (app.main:app)
   |-- routers/users.py   (new)  -> GET /api/users (public list)
   |-- routers/auth.py            -> signup / login / logout / me (unchanged)
   |-- routers/catalog.py         -> lessons / vocab (unchanged)
   |-- routers/scores.py          -> attempts / review (unchanged)
   |-- routers/progress.py        -> known-word progress (unchanged)
   |-- routers/admin.py           -> login gate + mutations (unchanged)
   |-- models.py                  -> Pydantic schemas (unchanged; add user-list schema)
   v
db.py -> SQLite (lessons, vocab, scores, users, attempt_items, known_words) [unchanged]
```

- The only new interaction is the public `GET /api/users` call from the Title
  screen to populate the sign-in picker.
- Admin sign-out now routes to the main Title screen via the existing admin
  logout endpoint (feature c), matching learner sign-out.

## 21. Explicitly unchanged / out of scope

- **No schema changes** this pass: `users`, `lessons`, `vocab`, `scores`,
  `attempt_items`, and `known_words` are unchanged (scope constraint i).
- All Sprint 01 and v0.1 API contracts other than the new `GET /api/users` are
  unchanged, including signup/login/logout/me, all catalog/vocab reads, scores,
  review, progress, and admin routes.
- The existing dummy admin gate and admin token namespace are unchanged.
- Admin remains reachable only from the Title screen; the top-nav "Admin" link
  is removed but the Title screen Admin entry is unchanged (feature f, Brief 06).
- Learner and admin logout destinations are now consistent (both the Title
  screen); no other auth flow changes (feature c, Brief 03).
- TTS is limited to English/Hebrew forms in Study mode via the browser Web
  Speech API; inline icons are a presentation-only change, with no new audio
  features (feature e, Brief 05).
- No new features are added beyond those in `enhancements/scope.md`
  (constraint h).

---

# Part D — Sprint 03 Enhancement Pass (UI polish, Study Auto-Play, lesson levels)

This section defines the architectural deltas required by
`enhancements/scope.md` and `features/briefs/*.md` (features a–j). It **extends**
the v0.1 spec (Part A) and the Sprint 01 and Sprint 02 specs (Parts B and C); it
does not replace any of them. Every item in Parts A–C remains in force unless
explicitly superseded below.

Sprint 03 is a mixed, frontend-focused pass. Per `enhancements/scope.md`
constraint **l**, the **only backend additions** are the `level` and `emoji`
fields on lessons (with seed data and API exposure/acceptance). All other
features (a–h) are frontend-only and require **no schema or API change** beyond
the lessons `level`/`emoji` fields.

## 22. Data model and database schema changes

### `lessons` (modified — add two columns)

| column    | type    | notes                                             |
|-----------|---------|---------------------------------------------------|
| `level`   | INTEGER | difficulty 1–5, higher = harder (NOT NULL, DEFAULT 1) |
| `emoji`   | TEXT    | single emoji illustrating the lesson (NOT NULL, DEFAULT '📘') |

- `level` (feature i, Brief 09): valid values are 1–5, default 1. Display-only;
  **no gating or unlocking** logic is added (scope boundary).
- `emoji` (feature j, Brief 10): a non-empty string; because an emoji may be
  multi-codepoint (e.g. 👨👩👧), it is validated only as a non-empty string, with
  no single-character or length restriction. The default placeholder `📘`
  applies when an admin creates a lesson without choosing an emoji, keeping
  admin-created rows unambiguous.
- The existing `lessons` columns (`id`, `title`, `created_at`) are unchanged.
  `vocab`, `scores`, `users`, `attempt_items`, and `known_words` are unchanged.

### Migration approach (existing on-disk DBs)

Both columns are added via `ALTER TABLE ADD COLUMN` with defaults, following the
existing `_migrate`/`_add_*` pattern in `backend/app/db.py` (the same precedent
used for `vocab.transliteration` and `scores.user_id`). Two new helpers are wired
into `_migrate`, each checking `PRAGMA table_info(lessons)` and returning early
if the column already exists (idempotent):

- `_add_lesson_level(conn)` → `ALTER TABLE lessons ADD COLUMN level INTEGER NOT NULL DEFAULT 1`
- `_add_lesson_emoji(conn)` → `ALTER TABLE lessons ADD COLUMN emoji TEXT NOT NULL DEFAULT '📘'`

The existing on-disk database is **not** dropped or recreated. Because the five
seeded lessons are re-seeded idempotently (see §24), their `level`/`emoji`
values are back-filled as part of the existing seed flow when those seed rows are
created; pre-existing admin-created rows keep the column defaults until edited
via the admin API.

### Seeding

The five seeded lessons are all assigned **Level 1** (scope boundary, item i)
and back-filled with these specific emojis (scope boundary, item j), matched to
the seeded lesson names to keep seed data reproducible:

| seeded lesson name  | emoji | description            |
|---------------------|-------|------------------------|
| Greetings & Basics  | 👋    | waving hand            |
| Numbers & Time      | 🔢    | numbers                |
| Family              | 👨👩👧 | family                 |
| Food & Drink        | 🍎    | apple                  |
| Common Verbs        | ⚡    | high voltage / action  |

Seeding stays idempotent (skip if lessons already exist) so restarts do not
duplicate data; the `level`/`emoji` back-fill rides on the existing seed rows.

## 23. API contract changes

All additions follow the same conventions as Parts A–C: JSON, base path `/api`,
`{"data": ...}` on success. Admin mutating routes continue to require
`Authorization: Bearer <admin-token>` (the dummy gate is unchanged).

### Lesson catalog & vocabulary (modified — add `level`/`emoji` to reads)

**`GET /api/lessons`**
- 200 → `{"data": [ { "id": 1, "title": "…", "vocab_count": 10, "level": 1, "emoji": "👋" }, … ]}`
- The `level`/`emoji` fields are added to each catalog entry so the Catalog
  cards can render the "Level N" badge and the emoji (features i, j).

**`GET /api/lessons/{lesson_id}`**
- 200 → `{"data": { "id": 1, "title": "…", "level": 1, "emoji": "👋", "vocab": [ {"id": 1, "english": "…", "hebrew": "…"}, … ] }}`
- Both `level` and `emoji` are returned in the detail response, consistent with
  the list response. The Lesson screen uses `level` (Level badge, feature i);
  the extra `emoji` field is harmless (emoji is rendered only on Catalog cards
  per Brief 10).
- 404 → `{"detail": "Lesson not found"}` (unchanged).

**`GET /api/lessons/{lesson_id}/vocab`** — unchanged (no `level`/`emoji`; vocab
items do not carry them).

### Admin (modified — accept `level`/`emoji` on create/update)

**`POST /api/admin/lessons`** (Bearer admin token)
- Request body: `{"title": "…", "level": 1, "emoji": "📘"}` — `title` required;
  `level` and `emoji` **optional**, defaulting to `1` and `📘` respectively.
- 201 → `{"data": {"id": N, "title": "…", "level": 1, "emoji": "📘", "vocab": []}}`
- 401 → invalid/missing token.
- 422 → validation error (e.g. `level` not an integer in 1–5).

**`PUT /api/admin/lessons/{lesson_id}`** (Bearer admin token)
- Request body: any subset of `{title, level, emoji}` (at least one present),
  preserving **partial-edit** semantics consistent with the vocab PUT
  (`PUT /api/admin/vocab/{vocab_id}`). Only the provided fields are updated;
  the existing `title` update behavior is unchanged.
- 200 → `{"data": {"id": N, "title": "…", "level": 1, "emoji": "👋"}}` (full,
  post-update lesson fields); 404 if lesson missing.
- 401 → invalid/missing token.
- 422 → validation error if a provided `level` is not an integer in 1–5.

### Validation semantics

- **`level`:** an integer **1–5**; out-of-range (or non-integer) is rejected
  with **422**, not clamped.
- **`emoji`:** a **non-empty string** only; no single-character or length
  restriction (an emoji may be multi-codepoint, e.g. 👨👩👧). An empty string is
  rejected (422).

## 24. Application state flow changes

The v0.1 / Sprint 01 / Sprint 02 flows (Parts A–C §5, §11, §18) are extended as
follows:

1. **Catalog render (features i, j).** `GET /api/lessons` now returns `level`
   and `emoji`; the Catalog cards render a "Level N" badge and the lesson emoji.
2. **Lesson screen (feature i).** `GET /api/lessons/{id}` returns `level`; the
   Lesson screen renders a "Level N" badge.
3. **Admin create/edit lesson (features i, j).** The Admin lesson form gains a
   Level field (1–5, default 1) and an emoji picker (a small **bundled curated
   frontend set**, per constraint k — not an open-ended search). Submitting
   `POST /api/admin/lessons` or `PUT /api/admin/lessons/{id}` includes
   `level`/`emoji`; after a save the frontend re-fetches the catalog/lesson as
   before.
4. **All other Sprint 03 features are frontend-only and do not change state
   flow:**
   - Catalog breadcrumb repair (a) — event-delegation wiring of existing
     `data-nav` links; navigation targets unchanged.
   - Footer removal (b) — static DOM/CSS removal.
   - Page transitions (c) — `document.startViewTransition` cross-fade with
     instant-swap fallback; no API impact.
   - Study Auto-Play (d) — a green play/stop control; uses the browser Web
     Speech API (`SpeechSynthesis`) to speak English then Hebrew per item with
     roughly 2s/4s pauses, advancing within the current lesson only; audio-free
     timed advance where speech is unsupported. No API writes.
   - Exam selection indicator (e) — neutral style on the chosen option; no
     correctness revealed.
   - Enlarged centered Quiz/Exam question (f) — CSS presentation change.
   - Admin button rename + automatic admin sign-in (g, h) — the frontend
     supplies a fixed credential to the existing dummy gate
     (`POST /api/admin/login`) and removes the Admin sign-in form; the backend
     gate is unchanged.

The backend remains the single source of truth; the frontend only reflects what
the API returns and holds no authoritative lesson state.

## 25. Backend vs frontend responsibility changes

### Backend (Stage 6) additionally owns
- The `lessons.level` and `lessons.emoji` columns; the `_add_lesson_level` /
  `_add_lesson_emoji` migration helpers wired into `_migrate` (no drop-and-
  recreate).
- Extending the five seeded lessons with `level = 1` and their specific emojis
  (idempotent back-fill on the existing seed rows).
- Exposing `level`/`emoji` in `GET /api/lessons` and `GET /api/lessons/{id}`.
- Accepting `level`/`emoji` (with defaults 1 / 📘) on `POST /api/admin/lessons`
  and as optional partial-update fields on `PUT /api/admin/lessons/{id}`.
- Validating `level` (integer 1–5 → 422 otherwise) and `emoji` (non-empty string).

### Frontend (Stage 7) additionally owns
- Rendering the "Level N" badge and the emoji on Catalog lesson cards (i, j).
- Rendering the "Level N" badge on the Lesson screen (i).
- The Admin lesson form's Level field (1–5, default 1) and the bundled curated
  emoji picker (j), sending `level`/`emoji` on lesson create/update.
- The Catalog breadcrumb repair via event delegation on dynamically-rendered
  `data-nav` links (a).
- Removing the app footer (b).
- Page transitions via `document.startViewTransition` with instant-swap fallback (c).
- Study Auto-Play: the green play/stop control, Web Speech API playback with
  2s/4s timing, resync on manual navigation, stop on leaving the lesson, and
  audio-free timed advance where speech is unsupported (d).
- The Exam neutral selection indicator (e) and the enlarged, centered Quiz/Exam
  question and Hebrew options (f).
- Renaming the Title screen's Admin button to "Admin" and the automatic admin
  sign-in that supplies a fixed credential to the existing dummy gate, removing
  the Admin sign-in form (g, h).

### Shared contract notes
- The emoji picker is a **bundled curated frontend set** (constraint k); the
  backend stores whatever non-empty string is sent and does not validate it
  against any curated list.
- Auto-Play operates within the current lesson only (scope boundary); it does
  not chain across lessons and makes no API writes.
- The admin automatic sign-in is a documented simplification: the backend dummy
  gate is retained, and the frontend simply supplies a fixed credential to obtain
  an admin token (constraint m).

## 26. Component interaction changes

```
Browser (frontend/static, Bootstrap, Web Speech API for Auto-Play,
         View Transitions API for page transitions)
   |
   | GET  /api/lessons, /api/lessons/{id}   (+ level, emoji)
   | POST/PUT /api/admin/lessons[/{id}]     (accept level, emoji; Bearer admin-token)
   | ...other /api/... contracts unchanged (Parts A–C)
   v
FastAPI app (app.main:app)
   |-- routers/catalog.py         -> lessons/vocab (+ level, emoji)
   |-- routers/admin.py           -> login gate + lesson/vocab mutations (+ level, emoji)
   |-- routers/users.py           -> GET /api/users (unchanged)
   |-- routers/auth.py            -> signup/login/logout/me (unchanged)
   |-- routers/scores.py          -> attempts / review (unchanged)
   |-- routers/progress.py        -> known-word progress (unchanged)
   |-- models.py                  -> Pydantic schemas (add level/emoji to lesson schemas)
   v
db.py -> SQLite (lessons +level+emoji, vocab, scores, users, attempt_items, known_words)
```

- The only new backend interactions are the `level`/`emoji` fields flowing
  through the lessons read and admin create/update endpoints.
- Page transitions and Study Auto-Play stay entirely in the browser (View
  Transitions API and Web Speech API respectively); no new backend interaction
  is introduced for items c and d.

## 27. Explicitly unchanged / out of scope

- **No drop-and-recreate** of the existing database. `lessons` gains two columns
  via `ALTER TABLE ADD COLUMN`; `vocab`, `scores`, `users`, `attempt_items`, and
  `known_words` are unchanged. No table is removed.
- The dummy admin gate (`POST /api/admin/login` and admin token enforcement) is
  unchanged; automatic admin sign-in is a frontend-only simplification over it
  (features g, h, constraint m).
- All other v0.1 / Sprint 01 / Sprint 02 API contracts (auth, users, scores,
  review, progress, catalog/vocab reads, vocab admin CRUD) are unchanged except
  where the lessons `level`/`emoji` fields are added above.
- **No lesson gating or unlocking** by level (feature i, scope boundary).
- The emoji is shown on **Catalog lesson cards only**, not on the Lesson screen
  (feature j, Brief 10).
- Study Auto-Play does not chain across lessons and adds no audio to quiz/exam;
  it reuses the existing client-side Web Speech API (feature d).
- Page transitions degrade to the existing instant swap on unsupported browsers
  (feature c); the transition changes only the navigation feel, not which screens
  exist or how targets are chosen.
- The footer removal, Exam selection indicator, enlarged/centered question, and
  Admin button rename are presentation-only and change no data or contracts.
- No features beyond those in `enhancements/scope.md` are added (constraint k).