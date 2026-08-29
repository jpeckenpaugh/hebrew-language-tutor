# English/Hebrew Language Tutor

A simple web application for learning English ↔ Hebrew vocabulary. It provides
five basic language lessons with study, quiz, and exam modes, records score
history per lesson, and includes a dummy-gated admin area for adding/editing
lessons and vocabulary.

The frontend is a plain HTML/CSS/JS single-page app (Bootstrap 5.3.3 as the
baseline UI framework), and the backend is a FastAPI service backed by SQLite.
All application state — lessons, vocabulary, and saved scores — is sourced from
the backend API.

## Features

- **Lesson catalog** — five seeded lessons, each with 10 English/Hebrew
  vocabulary items.
- **Study mode** — browse a lesson's vocabulary pairs forward and back; no
  scoring.
- **Quiz mode** — multiple choice with **immediate** per-question feedback
  (correct/incorrect plus the correct answer).
- **Exam mode** — multiple choice with **no** per-question feedback; results are
  shown at the end.
- **Score / attempt persistence** — completed quiz and exam attempts are saved
  and displayed as per-lesson history.
- **Navigation** — switch between catalog, lesson modes, scores, and admin
  without a page reload.
- **Admin mode** — sign in (dummy gate) to add new lessons/vocab and modify
  existing ones.
- **Backend as state source** — the frontend holds no authoritative copy of
  lessons or scores; it reads and writes everything through the API.

## Technology stack

- **Backend:** Python 3.9.6 (verified), FastAPI `0.111.0`, Uvicorn `0.30.1`
- **Database:** SQLite (Python standard library)
- **Frontend:** plain HTML/CSS/JS with Bootstrap `5.3.3` (hosted locally under
  `frontend/static/vendor/bootstrap/`)

See `environment-notes.md` and `requirements.txt` for the pinned environment.

## Setup

Run `./install.sh` from the project root. It:

1. Creates a virtual environment at `.venv/`.
2. Installs the pinned Python dependencies from `requirements.txt`.
3. Fetches Bootstrap `5.3.3` from the CDN and hosts it locally under
   `frontend/static/vendor/bootstrap/`.

## Run

Start the application with `./run.sh`:

```sh
./run.sh            # starts on 127.0.0.1:8000
./run.sh 9000       # starts on a custom port
HOST=0.0.0.0 ./run.sh  # override the bind host
```

On startup the SQLite database (`backend/english_tutor.db`) is created and
seeded automatically. Open the printed URL (e.g. `http://127.0.0.1:8000`) in a
browser.

## Project structure

```
.
├── backend/                    # FastAPI application
│   └── app/
│       ├── main.py             # app entry point, routers, static mount
│       ├── db.py               # SQLite connection, schema, idempotent seed
│       ├── models.py           # Pydantic request/response schemas
│       ├── seed.py             # 5 lessons × 10 vocab items (50 total)
│       └── routers/
│           ├── catalog.py      # GET /api/lessons, /api/lessons/{id}[/vocab]
│           ├── scores.py       # POST /api/scores, GET /api/scores
│           └── admin.py        # login/logout gate + lesson/vocab mutations
├── frontend/                   # SPA (served at / by the backend)
│   ├── index.html              # app shell + Bootstrap navbar
│   ├── css/style.css           # app-specific styles
│   ├── js/app.js               # controller: navigation, API client, admin flow
│   ├── js/views.js             # pure rendering of all views
│   └── static/vendor/bootstrap/# locally hosted Bootstrap
├── concept.md                  # original product brief
├── features/                   # feature capabilities and briefs
├── docs/
│   ├── architecture.md         # technical specification
│   └── verification-report.md  # Stage 8 verification results
├── summaries/                  # per-stage role summaries
├── requirements.txt
├── install.sh
└── run.sh
```

## Implementation summary

The backend (Stage 6) implements the full API defined in `docs/architecture.md`:
three tables (`lessons`, `vocab`, `scores`) with idempotent seeding, catalog
endpoints, score submission/retrieval, and the admin login/logout gate with
token-protected lesson/vocab mutating routes. The backend serves the frontend
static files at `/`.

The frontend (Stage 7) is a single-page app split into a controller
(`app.js` — fetch calls, navigation, admin token handling, score submission)
and pure rendering (`views.js` — catalog, study, quiz, exam, scores, admin).
Quiz/exam questions are built client-side from the served vocabulary, with
distractors drawn from the same lesson. The app sends the admin token on
mutating calls and re-prompts for sign-in on a 401.

## Project status

**PASS.** The Stage 8 verification pass exercised every backend/API contract
with `curl` against a running instance (happy and error paths) and statically
reviewed the frontend rendering logic. All 26 checklist items passed; no
failures were found. The full checklist and evidence are in
`docs/verification-report.md`.

## Known issues & limitations

These are documented as-is and are not hidden:

1. **Dummy admin gate.** Admin sign-in accepts any non-empty credential; there
   is no real password verification (intentional simplification per `concept.md`
   §g). State-changing admin endpoints do check that the client holds a
   "signed-in" token.
2. **Admin tokens do not survive a server restart.** Tokens are held only in
   memory, so a restart invalidates them. The frontend handles this by
   re-prompting for sign-in on a 401.
3. **Admin-created lessons may start with fewer than 10 vocab items.** The
   "exactly 10 per lesson" guarantee applies to the seeded content; a newly
   created lesson has no vocabulary until items are added one at a time.
4. **Frontend prompt direction.** Quiz/exam questions prompt in English with
   Hebrew choices (English → Hebrew). The briefs permit either direction; this
   was recorded as a confirmed acceptable assumption.
5. **Frontend verified by static review.** Browser interaction was not automated
   in this environment; frontend behavior was reviewed statically plus
   API-level verification of the endpoints the frontend consumes (see
   `docs/verification-report.md`).

## Suggested next actions

- Add headless-browser end-to-end tests to exercise quiz/exam/admin flows in a
  live browser.
- Reconsider the dummy admin gate and in-memory token store if real
  authentication or session persistence is ever required.
- Decide whether admin-created lessons should enforce a minimum/typical vocab
  count, and add any UI/API affordances accordingly.
- Consider serving pre-built questions from the backend if client-side
  distractor construction becomes a concern.