# English/Hebrew Language Tutor

A simple web application for learning English ↔ Hebrew vocabulary. It provides
five basic language lessons with study, quiz, and exam modes, per-user accounts,
score history, pronunciation aids, incorrect-answer review, and known-word
progress tracking, plus a dummy-gated admin area for adding/editing lessons and
vocabulary.

The Sprint 02 pass added frontend UI/UX refinements: a sign-in **user picker**
with a separate **Create Account modal**, larger terms text, inline
text-to-speech icons, and a simplified navigation (the top-nav Admin link and
the "Signed in as" badge were removed, and Admin sign-out now returns to the
main Title screen).

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
- **Sign-in user picker** — the Title screen shows a dropdown of existing
  accounts (loaded from the backend) so a returning user picks their name
  instead of typing it; selecting a name does not sign the user in by itself.
- **Create Account modal** — "Create Account" opens a separate modal asking for a
  username, decoupled from sign-in; creating an account does not auto sign in.
- **Larger terms text** — the English/Hebrew terms on the Study, Quiz, and Exam
  screens are rendered notably larger for readability.
- **Inline TTS icons** — small speaker icons sit beside each English/Hebrew term
  in study mode, replacing the separate-line TTS buttons.
- **Simplified navigation** — the top-nav "Admin" link is removed for signed-in
  users (Admin stays reachable from the Title screen), the "Signed in as {User}"
  badge is removed, and Admin "Log out" returns to the main Title screen.
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
browser. The app opens to a **Title screen** with a sign-in user picker
(populated from the backend) and a Create Account modal, plus a separate Admin
entry.

To reset to a clean, freshly seeded state (e.g. after demo data or testing),
stop the server, delete `backend/english_tutor.db`, and start `./run.sh` again
— the database is recreated and seeded on startup.

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
│           ├── admin.py        # login/logout gate + lesson/vocab mutations
│           └── users.py        # GET /api/users (public list for sign-in picker)
├── frontend/                   # SPA (served at / by the backend)
│   ├── index.html              # app shell + Bootstrap navbar
│   ├── css/style.css           # app-specific styles
│   ├── js/app.js               # controller: navigation, API client, auth, TTS
│   ├── js/views.js             # pure rendering of all views
│   └── static/vendor/bootstrap/# locally hosted Bootstrap
├── concept.md                  # original product brief (starting point)
├── COMPARISON.md               # prose comparison of the two experiments
├── instructions/
│   ├── build/                  # v0.1 role instructions
│   │   └── summaries/          # v0.1 per-stage role summaries
│   ├── enhancements/           # enhancement pipeline (sprint 01, sprint 02)
│   │   └── summaries/          # per-stage role summaries (sprints 01, 02)
│   ├── debug/                  # debug pipeline (investigate / fix / verify)
│   │   └── summaries/          # debug per-stage role summaries
│   └── meta/                   # Stage Manager meta role + session reports
│       └── summaries/          # durable session-report log
├── features/                   # sprint 02 feature files (01–07) + briefs/
│   └── briefs/                 # sprint 02 feature briefs
├── archive/                    # archived v0.1 baseline (build/) + sprint 01 (sprint01/)
├── enhancements/               # sprint 02 concept (sprint02.md) + agreed scope
├── bugs/                       # bug reports (resolved/ holds closed bugs)
├── tmp/                        # gitignored scratch/log folder (not committed)
├── docs/
│   ├── architecture.md         # technical specification (Parts A, B, and C)
│   └── verification-report.md  # Stage 8 verification results (Parts A, B, and C)
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
lesson/vocab mutating routes. The Sprint 02 pass added the public `GET /api/users`
endpoint (lists existing accounts, ordered by `id`) to back the Title-screen
sign-in picker. The backend serves the frontend static files at `/`.

The frontend (Stage 7) is a single-page app split into a controller
(`app.js` — fetch calls, navigation, admin/user token handling, auth, TTS,
score submission, review) and pure rendering (`views.js` — title, catalog,
study, quiz, exam, results, review, scores, admin). It opens to a Title screen,
keeps separate admin/user token namespaces, sends per-item answers when saving
attempts, fetches per-user progress, and renders study-mode transliteration and
text-to-speech controls. Quiz/exam questions are built client-side from the
served vocabulary, with distractors drawn from the same lesson. The Sprint 02
pass refined the frontend: the Title screen's free-text username field became a
sign-in picker (populated from `GET /api/users`) with a separate Create Account
modal, study terms gained inline TTS speaker icons and larger text, Admin
sign-out routes back to the main Title screen, and the top-nav Admin link and
"Signed in as" badge were removed.

## Project status

**PASS.** The v0.1 verification (Stage 8, Part A) passed all 26 checklist items.
The Sprint 01 enhancement pass (Part B) added learner identity, pronunciation,
and progress features and passed all 35 enhancement checklist items (23
backend/API + 12 frontend static); no failures were found, and all v0.1
endpoints behaved unchanged. The Sprint 02 pass (Part C) added the frontend
UI/UX refinements and passed all 12 checklist items (4 backend/API live + 2
backend static + 6 frontend static); no failures were found, and all Part A/B
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
4. **Admin-created lessons may start with fewer than 10 vocab items.** The
   "exactly 10 per lesson" guarantee applies to the seeded content; a newly
   created lesson has no vocabulary until items are added one at a time.
5. **Text-to-speech depends on browser support.** Pronunciation audio uses the
   browser's Web Speech API (`SpeechSynthesis`), which is client-side and
   voice/availability varies by browser and platform. A prior TTS failure mode
   (a stray punctuation character being read aloud and stalling subsequent
   speech) was fixed: the DB was re-seeded clean and the frontend `speak()`
   logic was hardened against one-shot failures.
6. **Frontend prompt direction.** Quiz/exam questions prompt in English with
   Hebrew choices (English → Hebrew). The briefs permit either direction; this
   was recorded as a confirmed acceptable assumption.
7. **Frontend verified by static review.** Browser interaction was not automated
   in this environment; frontend behavior was reviewed statically plus
   API-level verification of the endpoints the frontend consumes (see
   `docs/verification-report.md`).
8. **User-list ordering is an implementation choice.** `GET /api/users` returns
   accounts in `ORDER BY id` order; downstream consumers should not rely on a
   specific order, since the API contract leaves ordering to implementation
   choice (recorded in `docs/verification-report.md`, Part C limitation L1).

## Suggested next actions

- Add headless-browser end-to-end tests to exercise the title/sign-in,
  study/quiz/exam, review, and admin flows in a live browser.
- Add browser-driven tests specifically for the Sprint 02 interactive flows:
  the sign-in picker (including the empty-state hint), the Create Account modal,
  the inline TTS icons, the larger-text rendering, and the Admin "Log out" →
  Title routing — these were verified by static review only.
- Reconsider the dummy admin gate and in-memory token stores if real
  authentication or session persistence is ever required.
- Decide whether admin-created lessons should enforce a minimum/typical vocab
  count, and add any UI/API affordances accordingly.
- Treat `GET /api/users` ordering as unspecified: the UI may rely on the current
  `ORDER BY id` behavior, or the endpoint could gain an explicit sort parameter
  if a stable order must be guaranteed.
- Consider serving pre-built questions from the backend if client-side
  distractor construction becomes a concern.