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