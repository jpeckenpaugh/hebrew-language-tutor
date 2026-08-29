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

The Sprint 03 pass was a mixed frontend-focused pass with one small backend
addition. It fixed the Catalog breadcrumb navigation, removed the app footer,
added smooth page transitions (cross-fade with a graceful fallback), added a
Study **Auto-Play** control that speaks each item hands-free, gave Exam a neutral
selection indicator, centered and enlarged the Quiz/Exam question and answer
options, renamed the Title-screen "Admin Area" button to "Admin", and made Admin
sign-in automatic (a fixed credential behind the retained dummy gate). It also
added a **Level** (1–5) and a single **emoji** to each lesson — stored on the
backend, shown on the Catalog cards and Lesson screen, and editable in the Admin
area.

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
- **Fixed Catalog breadcrumb navigation** — the Catalog breadcrumb on the Lesson
  and Study screens and the results screen's "All Lessons" button now return to
  the Lesson Catalog, wired via event delegation so every dynamically-rendered
  link works after the page renders.
- **Removed app footer** — the footer line is gone; the page ends after the main
  content.
- **Page transitions** — a smooth cross-fade when navigating between screens,
  degrading gracefully to an instant swap on browsers without View Transitions
  support.
- **Study Auto-Play** — a green "play" button at the top right of the Study
  screen speaks the current English term, pauses ~2s, speaks the Hebrew term,
  pauses ~4s, then advances and repeats through the current lesson. Playback
  stops at the end of the lesson; the control toggles to a stop control. Where
  speech is unsupported, playback advances on the same timing without audio.
- **Exam selection indicator** — in Exam mode, a selected answer gets a neutral
  grey highlight so the user sees it was accepted without revealing correctness.
- **Centered, enlarged Quiz/Exam question** — the prompt is the English word
  alone, centered and enlarged (~3.5rem), with the Hebrew answer options enlarged
  (~2.2rem) for readability.
- **Admin button rename** — the Title-screen button reads "Admin" instead of
  "Admin Area".
- **Automatic Admin sign-in** — clicking "Admin" signs in as Admin automatically
  (a fixed credential through the retained dummy gate); the Admin sign-in form
  was removed.
- **Lesson Level indicator** — lessons carry a `level` (1–5; the five seeded
  lessons are Level 1), shown as a "Level N" badge on the Catalog cards and the
  Lesson screen, selectable in the Admin area, and exposed through the lessons
  API. No lesson gating/unlocking is added.
- **Lesson emoji** — each lesson carries a single `emoji` (the five seeded
  lessons are back-filled: 👋 🔢 👨👩👧 🍎 ⚡), shown on the Catalog cards,
  assigned via a bundled curated emoji picker in the Admin area, and exposed
  through the lessons API.

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
│   ├── enhancements/           # enhancement pipeline (sprints 01–03)
│   │   └── summaries/          # per-stage role summaries (sprints 01–03)
│   ├── debug/                  # debug pipeline (investigate / fix / verify)
│   │   └── summaries/          # debug per-stage role summaries
│   └── meta/                   # Stage Manager meta role + session reports
│       └── summaries/          # durable session-report log
├── features/                   # sprint 03 feature files (01–10) + briefs/
│   └── briefs/                 # sprint 03 feature briefs
├── archive/                    # archived v0.1 baseline (build/) + sprint 01 (sprint01/)
├── enhancements/               # sprint 03 concept (sprint03.md) + agreed scope
├── bugs/                       # bug reports (resolved/ holds closed bugs)
├── tmp/                        # gitignored scratch/log folder (not committed)
├── docs/
│   ├── architecture.md         # technical specification (Parts A, B, C, D)
│   └── verification-report.md  # Stage 8 verification results (Parts A, B, C, D)
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
sign-in picker. The backend serves the frontend static files at `/`. The Sprint
03 pass added the `level` (integer 1–5) and `emoji` (single string) fields on
`lessons` via idempotent `ALTER TABLE` migrations, back-filled the five seeded
lessons with Level 1 and their specific emojis (👋 🔢 👨👩👧 🍎 ⚡), exposed both
in the catalog/detail responses, accepted them on admin lesson create (defaults
1 / 📘), and converted `PUT /api/admin/lessons/{id}` to partial-edit semantics.

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
"Signed in as" badge were removed. The Sprint 03 pass polished the frontend and
added the browser-dependent interactions: navigation is now event-delegated so
every dynamically-rendered link (Catalog breadcrumbs, results "All Lessons")
works; the app footer was removed; screen changes cross-fade via the View
Transitions API (instant-swap fallback); Study gained a green Auto-Play control
that speaks each English/Hebrew pair on a ~2s/~4s cadence and stops at the end of
the lesson; Exam shows a neutral selection highlight without revealing
correctness; the Quiz/Exam prompt is the English word alone, centered and
enlarged, with enlarged Hebrew options; the Title "Admin" button was renamed and
Admin signs in automatically via a fixed credential (the Admin sign-in form was
removed); and the Catalog cards and Lesson screen render a "Level N" badge and
lesson emoji, with the Admin add/edit forms gaining Level (1–5) and a bundled
curated emoji picker.

## Project status

**PASS.** The v0.1 verification (Stage 8, Part A) passed all 26 checklist items.
The Sprint 01 enhancement pass (Part B) added learner identity, pronunciation,
and progress features and passed all 35 enhancement checklist items (23
backend/API + 12 frontend static); no failures were found, and all v0.1
endpoints behaved unchanged. The Sprint 02 pass (Part C) added the frontend
UI/UX refinements and passed all 12 checklist items (4 backend/API live + 2
backend static + 6 frontend static); no failures were found, and all Part A/B
endpoints behaved unchanged. The Sprint 03 pass (Part D) added the UI polish,
Study Auto-Play, and lesson level/emoji features and passed all 34 checklist
items (22 backend/API live + 12 frontend static); no failures were found, and
all Parts A–C endpoints behaved unchanged. The full checklists and evidence are
in `docs/verification-report.md`.

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
9. **Quiz/Exam question sizing is approximate.** The English prompt is ~3.5rem
   and the Hebrew options ~2.2rem (feature f), tuned for layout rather than a
   literal 3× of the prior sizes; this is within the brief's "about 3×" allowance
   (recorded in `docs/verification-report.md`, Part D limitation L1).
10. **Auto-Play timing is fixed, not speech-latency-adaptive.** Study Auto-Play
   drives the sequence on fixed ~2s/4s pauses (matching the audio-free case), so
   on slow speech engines the audio may finish slightly before the next segment;
   this matches the brief's "roughly" allowance. Stop-at-end and resync-on-
   navigation are implemented but were verified statically, not in a live browser
   (Part D limitation L2).
11. **Automatic Admin sign-in uses a fixed credential.** Clicking "Admin" signs
   in via `admin`/`admin` through the retained dummy gate (any non-empty
   credential passes); there is no real credential verification. This is the
   documented simplification per scope constraint m, not a security guarantee
   (Part D limitation L3).

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
- Add browser-driven tests for the Sprint 03 interactive flows: the breadcrumb /
  "All Lessons" navigation, the View Transitions cross-fade, Study Auto-Play
  (audio timing, stop-at-end, resync-on-navigation), the Exam selection
  indicator, and the automatic Admin sign-in — these were verified by static
  review only.
- Reconsider the fixed `admin`/`admin` credential used for automatic Admin
  sign-in if real authentication is ever required; it is a deliberate
  simplification, not a security guarantee.
- Consider whether the approximate Quiz/Exam sizing (3.5rem/2.2rem) should be
  re-tuned after real-browser review across viewport widths.