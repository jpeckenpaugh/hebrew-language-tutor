# English/Hebrew Language Tutor

A simple web application for learning English ↔ Hebrew vocabulary. It provides
five basic language lessons with study, quiz, and exam modes, per-user accounts,
score history, pronunciation aids, incorrect-answer review, and known-word
progress tracking, plus a dummy-gated admin area for adding/editing lessons and
vocabulary.

The frontend is a plain HTML/CSS/JS single-page app (Bootstrap 5.3.3 as the
baseline UI framework), and the backend is a FastAPI service backed by SQLite.
All application state — lessons, vocabulary, users, saved scores, and known-word
progress — is sourced from the backend API.

## Two experiments in this repository

This README documents the **primary** experiment: the full client/server app
built via a 9-stage decomposed role pipeline. A second, simpler experiment — a
single-pass "proof of concept" static SPA with hardcoded vocabulary — lives in
[`proof-of-concept/`](proof-of-concept/). For a detailed prose comparison of the
two approaches (architecture, feature coverage, robustness, effort, and
pros/cons), see [`COMPARISON.md`](COMPARISON.md).

## Features

- **Lesson catalog** — five seeded lessons, each with 10 English/Hebrew
  vocabulary items.
- **Study mode** — browse a lesson's vocabulary pairs forward and back; no
  scoring.
- **Quiz mode** — multiple choice with **immediate** per-question feedback
  (correct/incorrect plus the correct answer).
- **Exam mode** — multiple choice with **no** per-question feedback; results are
  shown at the end.
- **Learner accounts** — create or sign in with a non-empty username (no
  password); the app opens to a Title screen with a separate Admin entry, and a
  logout control returns to it to swap users.
- **Pronunciation guide** — each Hebrew word shows an English transliteration
  alongside it in study mode.
- **Text-to-speech** — study mode can speak the English and Hebrew forms of an
  item aloud using the browser's Web Speech API.
- **Score / attempt persistence** — completed quiz and exam attempts are saved
  and displayed as per-lesson history, tied to the signed-in user.
- **Incorrect-answer review** — after finishing a quiz or exam, review the
  questions answered incorrectly, with the correct answer shown for each.
- **Known-word progress** — words answered correctly on an exam are marked
  "known" for the user and shown as per-lesson progress ("N of M known").
- **Navigation** — switch between catalog, lesson modes, scores, and admin
  without a page reload.
- **Admin mode** — sign in (dummy gate) to add new lessons/vocab and modify
  existing ones.
- **Backend as state source** — the frontend holds no authoritative copy of
  lessons, scores, users, or progress; it reads and writes everything through the
  API.

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
browser. The app opens to a **Title screen** where you enter a username to
sign in or create an account, or choose the Admin entry.

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
│           ├── scores.py       # POST /api/scores, GET /api/scores, review
│           ├── auth.py         # learner signup/login/logout/me (per-user)
│           ├── progress.py     # GET /api/lessons/{id}/progress (known words)
│           └── admin.py        # login/logout gate + lesson/vocab mutations
├── frontend/                   # SPA (served at / by the backend)
│   ├── index.html              # app shell + Bootstrap navbar
│   ├── css/style.css           # app-specific styles
│   ├── js/app.js               # controller: navigation, API client, auth, TTS
│   ├── js/views.js             # pure rendering of all views
│   └── static/vendor/bootstrap/# locally hosted Bootstrap
├── concept.md                  # original product brief (starting point)
├── instructions/
│   ├── build/                  # v0.1 role instructions
│   │   └── summaries/          # v0.1 per-stage role summaries
│   └── enhancements/           # sprint 01 enhancement pipeline
│       └── summaries/          # sprint 01 per-stage role summaries
├── features/
│   └── completed/              # v0.1 feature capabilities and briefs
├── enhancements/               # sprint concept (sprint01.md) + scope
├── docs/
│   ├── architecture.md         # technical specification (Parts A and B)
│   └── verification-report.md  # Stage 8 verification results (Parts A and B)
├── requirements.txt
├── install.sh
└── run.sh
```

## Implementation summary

The backend (Stage 6) implements the full API defined in `docs/architecture.md`:
three v0.1 tables (`lessons`, `vocab`, `scores`) plus the Sprint 01 additions
(`users`, `attempt_items`, `known_words`, `vocab.transliteration`,
`scores.user_id`), with idempotent seeding, catalog endpoints, per-user score
submission/retrieval, incorrect-answer review, known-word progress, learner
auth/session endpoints, and the admin login/logout gate with token-protected
lesson/vocab mutating routes. The backend serves the frontend static files at
`/`.

The frontend (Stage 7) is a single-page app split into a controller
(`app.js` — fetch calls, navigation, admin/user token handling, auth, TTS,
score submission, review) and pure rendering (`views.js` — title, catalog,
study, quiz, exam, results, review, scores, admin). It opens to a Title screen,
keeps separate admin/user token namespaces, sends per-item answers when saving
attempts, fetches per-user progress, and renders study-mode transliteration and
text-to-speech controls. Quiz/exam questions are built client-side from the
served vocabulary, with distractors drawn from the same lesson.

## Project status

**PASS.** The v0.1 verification (Stage 8, Part A) passed all 26 checklist items.
The Sprint 01 enhancement pass (Part B) added learner identity, pronunciation,
and progress features and passed all 35 enhancement checklist items (23
backend/API + 12 frontend static); no failures were found, and all v0.1
endpoints behaved unchanged. The full checklists and evidence are in
`docs/verification-report.md`.

## Known issues & limitations

These are documented as-is and are not hidden:

1. **No learner password (intentional simplification).** Accounts use a non-empty
   username only; there is no password. This is a recorded simplification per the
   sprint scope (constraint k).
2. **In-memory session tokens.** Both learner and admin tokens are held in memory
   and do not survive a server restart; on a restart the user returns to the
   Title screen and must sign in again. The frontend handles the resulting 401.
3. **Dummy admin gate.** Admin sign-in accepts any non-empty credential; there is
   no real password verification (intentional simplification per `concept.md`
   §g). State-changing admin endpoints do check that the client holds a
   "signed-in" token.
4. **One non-seed vocab item has an empty transliteration.** The 50 seeded items
   all carry a transliteration; a single admin-created item from earlier v0.1
   testing (`airport`, lesson 6) has `transliteration: ""`. The frontend renders
   an empty transliteration gracefully (blank in study, blank input in admin), and
   admin can populate it.
5. **Admin-created lessons may start with fewer than 10 vocab items.** The
   "exactly 10 per lesson" guarantee applies to the seeded content; a newly
   created lesson has no vocabulary until items are added one at a time.
6. **Text-to-speech depends on browser support.** Pronunciation audio uses the
   browser's Web Speech API (`SpeechSynthesis`), which is client-side and
   voice/availability varies by browser and platform.
7. **Frontend prompt direction.** Quiz/exam questions prompt in English with
   Hebrew choices (English → Hebrew). The briefs permit either direction; this
   was recorded as a confirmed acceptable assumption.
8. **Frontend verified by static review.** Browser interaction was not automated
   in this environment; frontend behavior was reviewed statically plus
   API-level verification of the endpoints the frontend consumes (see
   `docs/verification-report.md`).

## Suggested next actions

- Add headless-browser end-to-end tests to exercise the title/sign-in,
  study/quiz/exam, review, and admin flows in a live browser.
- Reconsider the dummy admin gate and in-memory token stores if real
  authentication or session persistence is ever required.
- Decide whether admin-created lessons should enforce a minimum/typical vocab
  count, and add any UI/API affordances accordingly.
- Backfill the one non-seed vocab item's transliteration and consider making the
  transliteration field mandatory on admin create/edit.
- Consider serving pre-built questions from the backend if client-side
  distractor construction becomes a concern.