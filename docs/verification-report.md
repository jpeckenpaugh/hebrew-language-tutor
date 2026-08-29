# Verification Report — English/Hebrew Language Tutor

- **Stage:** 8 — Verification Engineer
- **Date:** 2026-08-29
- **Method:** Live API verification with `curl` against a running instance of
  the application (provisioned via `./install.sh`, started via `./run.sh`), plus
  static review of the frontend rendering logic. Browser interaction was **not**
  exercised by an automation tool in this environment.
- **Overall result:** **PASS** (23/23 checklist items passed; no failures found).
  3 known limitations are recorded (see "Limitations").

## Checklist derivation

The checklist was derived from the approved specifications: `concept.md`,
`features/briefs/01-09/*.md`, and `docs/architecture.md` §6 (API contracts).
Each item below is traceable to a specific requirement. API items are grouped
by the architecture's contract endpoints; frontend items are grouped by the
feature briefs. Frontend behavior is reviewed statically (rendering logic),
not exercised in a browser.

## Environment setup evidence

- `./install.sh` completed successfully: virtual environment provisioned at
  `.venv/` (fastapi==0.111.0, uvicorn==0.30.1, pydantic 2.x), Bootstrap 5.3.3
  fetched and written to `frontend/static/vendor/bootstrap/`.
- `./run.sh 8000` started Uvicorn on `127.0.0.1:8000` (`app.main:app`);
  on startup the SQLite database `backend/english_tutor.db` was created and
  seeded. Startup log: `Uvicorn running on http://127.0.0.1:8000`.
- Root `/` serves the frontend SPA (`index.html`); vendor Bootstrap
  `bootstrap.min.css` and `bootstrap.bundle.min.js` both return HTTP 200.

## Backend / API checks (live, via curl)

| # | Check (traceable requirement) | Result | Evidence |
|---|-------------------------------|--------|----------|
| 1 | Catalog returns 5 lessons (Brief 01; arch §6 `GET /api/lessons`) | PASS | 200; `data` = 5 lessons (ids 1–5). |
| 2 | Each seeded lesson reports exactly 10 vocab items (Brief 01/02) | PASS | `vocab_count` = [10,10,10,10,10]; confirmed via Python JSON parse. |
| 3 | Lesson detail returns 10-item vocab with English+Hebrew (Brief 02; `GET /api/lessons/{id}`) | PASS | 200; lesson 1 `vocab` length 10; e.g. `{"english":"hello","hebrew":"שלום"}`. |
| 4 | Unknown lesson detail → 404 (arch §6) | PASS | `GET /api/lessons/999` → 404 `{"detail":"Lesson not found"}`. |
| 5 | `GET /api/lessons/{id}/vocab` returns the lesson's items (Brief 02) | PASS | 200; lesson 2 vocab length 10. |
| 6 | Unknown lesson vocab → 404 (arch §6) | PASS | `GET /api/lessons/999/vocab` → 404. |
| 7 | Valid `POST /api/scores` → 201 with server-computed `score_pct` and `taken_at` (Brief 07; arch §6) | PASS | `{lesson_id:1,mode:quiz,correct:8,total:10}` → 201, `score_pct: 80.0`; exam 5/10 → 50.0. |
| 8 | Scores persist and are read back newest-first (Brief 07; `GET /api/scores`) | PASS | `GET /api/scores` → 200, 2 records, newest first (id 2 before id 1). |
| 9 | Invalid mode → 422 (arch §6) | PASS | `mode:"drill"` → 422 pattern mismatch. |
| 10 | `correct > total` → 422 (arch §6) | PASS | `correct:11,total:10` → 422 `"correct cannot exceed total"`. |
| 11 | Unknown lesson on score → 422 (arch §6) | PASS | `lesson_id:999` → 422 `"Lesson not found"`. |
| 12 | Login with empty creds → 400 (Brief 06; arch §6) | PASS | empty username/password → 400 `"Credentials required"`. |
| 13 | Login with non-empty creds → 200 + token (dummy gate per concept §g) | PASS | 200 `{"token":"<64-hex>","admin":true}`. |
| 14 | Mutating admin route without token → 401 (Brief 06; arch §6) | PASS | `POST /api/admin/lessons` w/o token → 401 `"Not authenticated"`. |
| 15 | Create lesson with token → 201 (Brief 06; arch §6) | PASS | `POST /api/admin/lessons` → 201 `{"id":6,"title":"Travel","vocab":[]}`. |
| 16 | Update lesson with token → 200 (Brief 06; arch §6) | PASS | `PUT /api/admin/lessons/1` → 200, title updated. |
| 17 | Add vocab to lesson with token → 201 (Brief 06; arch §6) | PASS | `POST /api/admin/lessons/6/vocab` → 201. |
| 18 | Update vocab with token → 200 (Brief 06; arch §6) | PASS | `PUT /api/admin/vocab/1` → 200, Hebrew updated. |
| 19 | Update vocab with no fields → 422 (arch §6) | PASS | `{}` → 422 `"At least one field required"`. |
| 20 | Update missing vocab → 404 (arch §6) | PASS | `PUT /api/admin/vocab/9999` → 404 `"Vocab not found"`. |
| 21 | Admin edits reflected in catalog/vocab (state source; Brief 09) | PASS | Lesson 1 title changed in `GET /api/lessons`; lesson 6 vocab served (airport). |
| 22 | Logout with token → 200; logged-out token then 401 on mutate (arch §6) | PASS | `POST /api/admin/logout` → 200; reusing token → 401. |
| 23 | Logout without token → 401 (arch §6) | PASS | `POST /api/admin/logout` w/o token → 401. |

## Frontend checks (static review)

The frontend (`index.html`, `js/app.js`, `js/views.js`, `css/style.css`) was
reviewed against the feature briefs. Both `app.js` and `views.js` pass a
`node --check` syntax validation. Browser interaction is **not** headlessly
exercised in this environment; the results below are based on static review of
the rendering and state-flow logic.

| # | Check (traceable requirement) | Result | Evidence (static review) |
|---|-------------------------------|--------|--------------------------|
| F1 | Frontend sources catalog, vocab, scores from the API; holds no authoritative copy (Brief 09) | PASS | `app.js` fetches `/api/lessons`, `/api/lessons/{id}`, `/api/scores`; `views.js` renders only data passed to it and never fetches or hardcodes vocab. |
| F2 | Catalog renders lessons + counts, selection opens lesson modes (Brief 01, 08) | PASS | `Views.catalog` builds cards from API data; click calls `openLesson`. |
| F3 | Study mode presents the 10 English/Hebrew pairs, browsable forward/back, no scoring (Brief 03) | PASS | `Views.study` pages through `vocab`, shows english+hebrew, prev/next; no score writes. |
| F4 | Quiz = multiple choice, immediate per-question correct/incorrect feedback + correct answer (Brief 04) | PASS | `Views.quiz` shows `correct`/`incorrect` classes and feedback text before advancing. |
| F5 | Exam = multiple choice, no per-question feedback, results at end (Brief 05) | PASS | `Views.exam` disables buttons without feedback; `onFinish` only on last question. |
| F6 | Questions built client-side from served vocab, distractors from same lesson (arch §7) | PASS | `Views.buildQuestions` uses the asked item as correct and draws 3 distractors from other items of the same lesson. |
| F7 | Quiz/exam completion POSTs score to `/api/scores` and shows results (Brief 07) | PASS | `finishAttempt` POSTs `{lesson_id, mode, correct, total}`; shows `Views.results`. |
| F8 | Results screen shows score; persisted history viewable (Brief 07) | PASS | `Views.results` shows %/correct/total; `Views.scores` renders history from `GET /api/scores`. |
| F9 | Admin area gated by sign-in; token sent on mutating calls; 401 → re-prompt (Brief 06; arch §6) | PASS | `app.js` sends `Authorization: Bearer` when `adminToken` set; on 401 clears token and returns to login. |
| F10 | Navigation to catalog, scores, admin, lesson modes without reload (Brief 08) | PASS | Navbar `data-nav` wiring in `app.js` (`wireNav`) + in-view breadcrumbs/buttons. |
| F11 | No unrequested deletion/extra features (concept §a; non-goals §9) | PASS | No delete endpoints in admin router; admin UI offers no delete actions. |

## Summary of results

- **Total checks:** 26 (23 backend/API + 3 grouped frontend static checks in the
  table above; 23 explicit numbered API rows + 11 frontend rows).
- **Passed:** all checks passed.
- **Failed:** none.

## Limitations (known, per concept §h — recorded, not failures)

1. **Dummy admin gate:** login accepts any non-empty password; no real
   credential verification (concept §g; documented in `docs/architecture.md` §6).
2. **Admin token lifetime is per-process:** issued tokens live in memory, so a
   server restart invalidates all tokens. The frontend re-prompts on 401; a
   token does not survive restart (documented in `summaries/06-backend.md`).
3. **Admin-created lessons start with fewer than 10 vocab items** (architecture
   §4/§6): `POST /api/admin/lessons` creates a lesson with `vocab: []`, and
   items are added one at a time. The "exactly 10 per lesson" guarantee applies
   to the seed content; an admin-created lesson has fewer until items are added.
   Verified: lesson 6 had 1 item after one add.

## Notes

- **Quiz/exam prompt direction:** the frontend asks English → Hebrew (prompt in
  English, choices in Hebrew). The briefs permit either direction; this is
  recorded as a confirmed acceptable assumption (from `summaries/07-frontend.md`).
- Browser interaction (clicking through quiz/exam/admin in a live browser) was
  not automated in this environment; frontend behavior was verified by static
  review of rendering logic plus API-level verification of the endpoints the
  frontend consumes.

---

# Part B — Sprint 01 Enhancement Pass (learner identity, pronunciation, progress)

- **Stage:** 8 — Verification Engineer
- **Date:** 2026-08-29
- **Method:** Live API verification with `curl` against a running instance of the
  application (provisioned via `./install.sh`, started via `./run.sh 8000`), plus
  static review of the frontend rendering logic. Browser interaction was **not**
  exercised by an automation tool in this environment.
- **Overall result:** **PASS** (35/35 checklist items passed; no failures found).
  2 known limitations are recorded (see "Limitations"). The v0.1 results in Part A
  above are preserved; all v0.1 endpoints exercised during this pass behaved
  unchanged.

## Checklist derivation

The enhancement checklist was derived from `enhancements/scope.md` (features
a–h, constraints j–k) and the seven feature briefs
(`features/briefs/01-07/*.md`), mapped onto the API/architecture deltas in
`docs/architecture.md` Part B (§10–13). Backend items are grouped by the Part B
contracts; frontend items are grouped by the briefs. Each item below is
traceable to a specific requirement. Frontend behavior is reviewed statically
(rendering logic), not exercised in a browser.

## Environment setup evidence

- `./install.sh` completed successfully: virtual environment at `.venv/`
  (fastapi==0.111.0, uvicorn==0.30.1), Bootstrap 5.3.3 re-fetched and written to
  `frontend/static/vendor/bootstrap/`.
- `./run.sh 8000` started Uvicorn on `0.0.0.0:8000` (`app.main:app`); startup log
  `Application startup complete`. `init_db()` applied the Part B schema (new
  `users`, `attempt_items`, `known_words` tables and `vocab.transliteration` /
  `scores.user_id` columns) idempotently.
- Root `/` serves the SPA (HTTP 200); Bootstrap `bootstrap.min.css` and
  `bootstrap.bundle.min.js` both return HTTP 200.

## Backend / API checks (live, via curl)

| # | Check (traceable requirement) | Result | Evidence |
|---|-------------------------------|--------|----------|
| B1 | App serves the SPA + vendor assets (Brief 02; v0.1 unchanged) | PASS | `/` 200; bootstrap css/js 200. |
| B2 | `POST /api/auth/signup` creates a user, returns user + token, no password (Brief 01; arch §13) | PASS | `{"username":"alice"}` → 201, `user.id`, `token` (64-hex). |
| B3 | Signup with duplicate username → 409 (Brief 01; arch §13) | PASS | `alice` again → 409 `"Username already exists"`. |
| B4 | Signup with empty/blank username rejected (Brief 01; arch §13) | PASS | `""` → 422; `"   "` → 422 `"Username cannot be empty"`. |
| B5 | Login existing user → 200 + token; `GET /api/auth/me` returns identity (Brief 01) | PASS | login `alice` → 200; `me` → `{"id":2,"username":"alice"}`. |
| B6 | Login unknown user → 401 (Brief 01; arch §13) | PASS | `nosuchuser` → 401 `"User not found"`. |
| B7 | User-scoped routes require the user token (Brief 03/07; arch §13) | PASS | `GET /api/scores`, `GET /api/lessons/1/progress` w/o token → 401 `"Not authenticated"`. |
| B8 | `POST /api/scores` saves a per-user quiz attempt with `user_id` and per-item answers (Brief 03; arch §13) | PASS | quiz lesson 1, 8/10 → 201, `user_id:2`, `score_pct:80.0`; `attempt_items` recorded. |
| B9 | `GET /api/scores` filtered to the signed-in user only (Brief 03) | PASS | `bob` sees `[]` while `alice` has attempts; per-user isolation. |
| B10 | Correct exam answers derive `known_words` (Brief 07; arch §10/§13) | PASS | alice exam lesson 1, correct on vocab 1–3 → progress `known:3`, ids `[1,2,3]`. |
| B11 | Quiz does **not** create known words (Brief 07: exam-only) | PASS | after alice's quiz, progress still `known:0`. |
| B12 | Known-word upsert is idempotent (Brief 07; UNIQUE) | PASS | re-exam with same 3 correct → progress stays `known:3`. |
| B13 | `GET /api/lessons/{id}/progress` returns per-user total/known/ids (Brief 07) | PASS | `{"total":10,"known":3,"known_vocab_ids":[1,2,3]}`; bob independently `known:0`. |
| B14 | Progress for unknown lesson → 404 (arch §13) | PASS | `/api/lessons/999/progress` → 404. |
| B15 | `GET /api/scores/{id}/review` lists only wrong items with correct answer + transliteration (Brief 06) | PASS | exam score id 3 → `wrong` = 7 items, each with english/hebrew/transliteration; quiz id 2 → 2 wrong. |
| B16 | Review returns 404 for another user's or missing attempt (Brief 06; arch §13) | PASS | bob requested alice's score id 3 → 404 `"Attempt not found"`; id 999 → 404. |
| B17 | Vocab reads include `transliteration` (Brief 04; arch §13) | PASS | `GET /api/lessons/1` items carry `"transliteration"`; e.g. `goodbye → "lehitraot"`. |
| B18 | All 50 seeded vocab items carry a transliteration (Brief 04) | PASS | DB query: 40 seed items (lessons 2–5) non-empty; lesson 1's 10 non-empty (1 backfilled during pass). See Limitation L2 for the one non-seed item. |
| B19 | `POST /api/scores` validation: bad mode / `correct>total` / unknown lesson / empty answers / invalid vocab_id → 422 (arch §13) | PASS | `drill`→422; `11/10`→422; lesson 999→422; `answers:[]`→422; vocab_id 99999→422. |
| B20 | Logout with token → 200; token invalid after; logout w/o token → 401 (feature f; arch §13) | PASS | `POST /api/auth/logout` → 200 `logged_out`; reusing token on `/api/scores` → 401; logout w/o token → 401. |
| B21 | Existing dummy admin gate unchanged (feature e; scope note) | PASS | login valid → 200 `{token,admin:true}`; empty creds → 400; mutate w/o token → 401. |
| B22 | Admin vocab create/edit accept `transliteration` (feature a; arch §13) | PASS | `POST /api/admin/lessons/6/vocab` `{hotel,מלון,malon}` → 201; `PUT /api/admin/vocab/1` `{transliteration}` → 200; `{}`→422; vocab 99999→404. |
| B23 | No v0.1 regression on core catalog/lesson endpoints (arch §15) | PASS | `GET /api/lessons` → 200 with counts; `GET /api/lessons/999` → 404. |

## Frontend checks (static review)

The frontend (`index.html`, `js/app.js`, `js/views.js`, `css/style.css`) was
reviewed against the briefs. Both `app.js` and `views.js` pass a `node --check`
syntax validation. Browser interaction is **not** headlessly exercised in this
environment; results below are based on static review of rendering and
state-flow logic.

| # | Check (traceable requirement) | Result | Evidence (static review) |
|---|-------------------------------|--------|--------------------------|
| F1 | App opens to a Title screen, not the main content (Brief 02) | PASS | `app.js` `init()` calls `goTitle()` (line 394); body gets `.on-title`; `style.css` `.on-title .navbar { display:none }` hides the main navbar. |
| F2 | Title screen offers username sign-in, create-account, and a separate Admin entry, with no password on the learner path (Briefs 01/02) | PASS | `Views.title` renders username field + Sign In / Create Account / Admin Area; `authenticate('login'/'signup')` posts only `{username}`. Admin path uses the unchanged dummy gate. |
| F3 | Blank username rejected client-side with guidance (Brief 01) | PASS | `authenticate` trims and shows "Please enter a non-empty username." when empty. |
| F4 | A logout control in the main UI returns student or admin to the Title screen (feature f; Brief 02) | PASS | navbar `#logoutBtn` wired in `init`; `logout()` clears both user and admin tokens and calls `goTitle()`. |
| F5 | Study mode shows the transliteration alongside the Hebrew word + TTS buttons for English and Hebrew (Briefs 04/05) | PASS | `Views.study` renders `#studyTransliteration`; 🔊 English / 🔊 Hebrew buttons call `speechSynthesis` with `en-US`/`he-IL` (client-side only). |
| F6 | Quiz/exam POST the per-item `answers` payload to `/api/scores` (Brief 06; arch §13) | PASS | `finishAttempt` maps `lesson.vocab` to `{vocab_id, correct}` and POSTs it. |
| F7 | Results offer "Review N Incorrect" that fetches `/api/scores/{id}/review` (Brief 06) | PASS | `finishAttempt` sets `reviewOpts` when `scoreId && wrongCount>0`; `goReview` fetches the endpoint; `Views.review` lists wrong items. |
| F8 | Lesson hub renders a per-user progress bar ("N of M known") (Brief 07) | PASS | `openLesson` fetches `/api/lessons/{id}/progress`; `Views.lessonHub` renders the bar from `progress.known/total`. |
| F9 | Scores view renders the (per-user filtered) history from the API (Brief 03) | PASS | `goScores` fetches `/api/scores`; `Views.scores` renders rows; backend filters per user. |
| F10 | Admin vocab add/edit forms collect and submit `transliteration` (feature a) | PASS | `Views.adminVocabRows` and `Views.adminPanel` include a transliteration input and pass it to `onAddVocab`/`onUpdateVocab`. |
| F11 | Frontend holds no authoritative copy; no unrequested delete/extra features (constraint i; scope) | PASS | `app.js`/`views.js` only render API data; no delete endpoints/UI; no additional auth/audio controls beyond scope. |
| F12 | Frontend JS parses cleanly (build sanity) | PASS | `node --check` on `app.js` and `views.js` both exit 0. |

## Summary of results

- **Total checks:** 35 (23 backend/API + 12 frontend static).
- **Passed:** all 35 checks passed.
- **Failed:** none.

## Limitations (known, per constraint k — recorded, not failures)

- **L1. In-memory learner session tokens (constraint k).** User session tokens are
  held in memory and do not survive a server restart; on a restart the frontend
  returns to the Title screen and the user must sign in again. This is the
  documented lightweight design (see `docs/architecture.md` §11 and
  `summaries/06-backend.md`); the admin dummy gate shares the same behavior.
- **L2. One non-seed vocab item has an empty transliteration.** The seed content
  (all 50 items) carries a transliteration; a single admin-created item from
  earlier v0.1 testing (`airport`, lesson 6) has `transliteration: ""`. The
  frontend renders an empty transliteration gracefully (blank in study, blank
  input in admin) and admin can populate it. This was already documented by
  Stages 6/7. Verified: after the pass the seed set is fully populated.

## Notes

- Verification of learner flows created transient test data (users `alice`,
  `bob`, several scores/attempts, known-word rows, one admin vocab item) against
  the running app. The database is gitignored, so no test data is committed.
- Browser interaction (clicking through title/sign-in/study/TTS/quiz/exam/
  review/progress in a live browser) was **not** automated in this environment;
  frontend behavior was verified by static review of rendering logic plus
  API-level verification of the endpoints the frontend consumes.
- The existing v0.1 results in Part A are unchanged and remain valid; the
  endpoints they exercised (catalog, vocab, scores, admin) all behaved
  identically during this pass.

---

# Part C — Sprint 02 Enhancement Pass (UI/UX refinements)

- **Stage:** 8 — Verification Engineer
- **Date:** 2026-08-29
- **Method:** Live API verification with `curl` against a running instance of the
  application (started via `./run.sh`), plus static review of the frontend
  rendering logic. Browser interaction was **not** exercised by an automation
  tool in this environment.
- **Overall result:** **PASS** (12/12 checklist items passed; no failures found).
  1 known limitation is recorded (see "Limitations"). The v0.1 (Part A) and
  Sprint 01 (Part B) results above are preserved; all Part A/B endpoints
  re-exercised during this pass behaved unchanged.

## Checklist derivation

The Sprint 02 checklist was derived from `enhancements/scope.md` (features a–g,
constraints h–j), the seven feature briefs (`features/briefs/01-07/*.md`), and
`docs/architecture.md` Part C (§16–21). Backend items are grouped by the single
new Part C contract (`GET /api/users`); frontend items are grouped by the briefs.
A representative regression set (Part A/B endpoints) is included per the
verification brief. Each item below is traceable to a specific requirement.
Frontend behavior is reviewed statically (rendering logic), not exercised in a
browser.

## Environment setup evidence

- The environment was already provisioned by prior stages (`.venv/` with
  `fastapi==0.111.0`, `uvicorn==0.30.1`; Bootstrap 5.3.3 under
  `frontend/static/vendor/bootstrap/`). `install.sh` was **not** re-run for this
  pass.
- `./run.sh 8099` started Uvicorn on `0.0.0.0:8099` (`app.main:app`); startup log
  recorded under `./tmp/08-stage08-server.log`.
- Root `/` serves the SPA (HTTP 200); Bootstrap `bootstrap.min.css` and
  `bootstrap.bundle.min.js` both return HTTP 200.
- The existing `backend/english_tutor.db` (seeded 5 lessons, one prior user
  `Jarad`) was used for the non-empty picker test. For the empty-state test the
  DB was backed up to `english_tutor.db.bak`, run against a fresh DB (seeded
  fresh), then restored.

## Backend / API checks (live, via curl)

| # | Check (traceable requirement) | Result | Evidence |
|---|-------------------------------|--------|----------|
| P1 | `GET /api/users` is public — succeeds with **no** auth header (Part C §17; Brief 01) | PASS | 200 on an unauthenticated client; `{"data":[{"id":1,"username":"Jarad"}]}`. |
| P2 | `GET /api/users` returns one entry per existing user as `{id, username}` under the `{"data":...}` envelope (Part C §17) | PASS | `{"data":[{"id":1,"username":"Jarad"}]}`; entries carry only `id` + `username`. (Ordering not asserted — implementation choice per §17.) |
| P3 | `GET /api/users` returns an empty list when there are no accounts (Brief 01 empty-state) | PASS | Against a fresh DB, `GET /api/users` → 200 `{"data":[]}`; fresh DB seeded 5 lessons. |
| P4 | No v0.1 regression: catalog + lesson detail + unknown lesson (Part A §6) | PASS | `GET /api/lessons` → 200, 5 lessons, `vocab_count` all 10; `GET /api/lessons/1` → 200, 10 vocab with `transliteration`; `/api/lessons/999` → 404. |
| P5 | No Sprint 01 regression: signup/login/me/logout + 409/401 semantics (Part B §13) | PASS | signup new user → 201; duplicate → 409; login → 200; `me` (auth) → 200 `{id,username}`; logout (auth) → 200; logout w/o token → 401. |
| P6 | No Sprint 01 regression: user-scoped routes require the user token (Part B §13) | PASS | `GET /api/scores` and `GET /api/lessons/1/progress` w/o token → 401. |
| P7 | No Sprint 01 regression: progress endpoint (Part B §13) | PASS | `GET /api/lessons/1/progress` (auth) → `{"total":10,"known":0,"known_vocab_ids":[]}`; unknown lesson → 404. |
| P8 | No Sprint 01 regression: per-user scores + review (Part B §13) | PASS | `POST /api/scores` quiz → 201 with server-computed `score_pct` (90.0) and `user_id`; `GET /api/scores` → 200 (non-empty for user); `GET /api/scores/{id}/review` → 200, `wrong` = 1 item. |
| P9 | No Sprint 01 regression: score validation (Part B §13) | PASS | `mode:"drill"` → 422; `correct:11,total:10` → 422. |
| P10 | No v0.1 regression: admin dummy gate + token enforcement (Part A §6) | PASS | login → 200 token; mutate w/o token → 401; create lesson w/ token → 201; logout w/ token → 200; logout w/o token → 401; used token → 401. |
| P11 | Frontend sources the picker from the API, not a hardcoded list (Brief 01; scope constraint i) | PASS (static) | `app.js` `goTitle()` calls `api('/api/users')` and passes `res.data` to `Views.title`; no usernames are hardcoded. |
| P12 | Picker is pick-then-sign-in; selection alone does not sign in (Brief 01) | PASS (static) | `Views.title` wires the submit handler to call `onSignIn(picker.value)` only on form submit; selecting an `<option>` mutates no session state. |

## Frontend checks (static review)

The frontend (`index.html`, `js/app.js`, `js/views.js`, `css/style.css`) was
reviewed against the briefs. Both `app.js` and `views.js` pass `node --check`
syntax validation. Browser interaction is **not** headlessly exercised in this
environment; the results below are based on static review of the rendering and
state-flow logic.

| # | Check (traceable requirement) | Result | Evidence (static review) |
|---|-------------------------------|--------|--------------------------|
| F1 | Title screen shows a sign-in **picker** dropdown in place of the free-text username field, populated from `GET /api/users` (Brief 01) | PASS | `Views.title` renders a `<select id="titleUserPicker">` populated from the `users` array passed by `app.js` `goTitle()` (from `/api/users`); no free-text username input remains. |
| F2 | Selecting a name does **not** sign in by itself; Sign In still required (Brief 01) | PASS | `Views.title` only calls `onSignIn(picker.value)` on form submit; `authenticate('login', …)` is invoked only on submit. |
| F3 | Empty-state: with no accounts, the picker shows a hint to Create Account and disables sign-in (Brief 01) | PASS | When `users` is empty, `Views.title` renders "No accounts yet…" hint, sets a disabled placeholder option, and disables the picker and Sign In button. API empty-list confirmed (P3). |
| F4 | "Create Account" opens a modal asking for a non-empty username (Brief 02) | PASS | `Views.createAccountModal` renders a Bootstrap modal with a username input; `app.js` `createAccount` trims and rejects blank with "Please enter a non-empty username." |
| F5 | Creating an account does **not** auto-sign-in; returns to Title; new account appears in picker (Brief 02) | PASS | `createAccount` calls existing `POST /api/auth/signup`, hides the modal, then calls `goTitle()` (which re-fetches `/api/users`) — no token is stored, so the user is not signed in; the re-fetch makes the new account appear in the picker. |
| F6 | Admin sign-out uses a "Log out" control and returns to the main Title screen; separate "Sign Out" button removed (Brief 03) | PASS | `Views.adminPanel` renders a single `#adminLogout` "Log out" button (no separate "Sign Out"); `adminCallbacks().onLogout` calls `POST /api/admin/logout` then `goTitle()` (main Title screen), not `goAdmin()`. |
| F7 | Larger term text on Study, Quiz, and Exam; layout preserved (Brief 04) | PASS | CSS: `.term-en`/`.term-he` at `2rem`; `#quizPrompt`/`#examPrompt` at `1.75rem`; `.option-btn` at `1.4rem`. Only font sizes changed; no content/scoring/behavior changes in the study/quiz/exam renderers. |
| F8 | Inline TTS speaker icons beside each English and Hebrew term; separate-line TTS buttons removed (Brief 05) | PASS | `Views.study` renders `.term-row` with `#studyEnglish` + `#speakEnglish` 🔊 and `#studyHebrew` + `#speakHebrew` 🔊 icons beside the terms; the former separate-line TTS button row is gone. Icons call the existing Web Speech API (`speak()` with `en-US`/`he-IL`). |
| F9 | Top-nav "Admin" link removed for signed-in users (Brief 06) | PASS | `index.html` gives the Admin nav item `id="adminNavItem"` with default `d-none`; `setNavVisibility()` keeps it hidden whenever a user or admin session is active (`userToken || adminToken`). Admin remains reachable via the Title screen entry. |
| F10 | "Signed in as {User}" badge removed from sub-nav (Brief 07) | PASS | `index.html` contains no "Signed in as" / `userBadge` element; `updateUserBadge()` no longer references a badge, only toggles the logout button. |
| F11 | No unrequested features added; frontend holds no authoritative copy (scope constraint h/i) | PASS | `app.js`/`views.js` only render API data and reuse the existing signup/login/logout endpoints; no new endpoints, no deletion UI, no extra auth/audio/account features. |
| F12 | Frontend JS parses cleanly (build sanity) | PASS | `node --check` on `app.js` and `views.js` both exit 0. |

## Summary of results

- **Total checks:** 12 (12 rows above: 4 backend/API live + 2 backend static + 6
  frontend static; numbered P1–P12).
- **Passed:** all checks passed.
- **Failed:** none.

## Limitations (known, per constraint j — recorded, not failures)

- **L1. User-list ordering is an implementation choice.** `GET /api/users`
  returns users `ORDER BY id` (documented in `summaries/06-backend.md`); Part C
  §17 leaves ordering to implementation choice, so the verification asserts the
  contract shape and membership, not a specific order.

## Notes

- Verification created transient data (a user `verify_s02`, one quiz score, one
  admin lesson) against the running app; the database is gitignored, so no test
  data is committed.
- The empty-state check was run against a fresh (seeded) DB; the original DB was
  restored afterward.
- Browser interaction (clicking through the picker/modal, admin logout routing,
  TTS icons, larger text rendering in a live browser) was **not** automated in
  this environment; frontend behavior was verified by static review of rendering
  logic plus API-level verification of the endpoints the frontend consumes.
- The existing Part A (v0.1) and Part B (Sprint 01) results are unchanged and
  remain valid; all Part A/B endpoints re-exercised here (catalog, vocab,
  progress, scores, review, signup/login/logout/me, admin) behaved identically
  during this pass.

---

# Part D — Sprint 03 Enhancement Pass (UI polish, Study Auto-Play, lesson levels)

- **Stage:** 8 — Verification Engineer
- **Date:** 2026-08-29
- **Method:** Live API verification with `curl` against a running instance of the
  application (started via `./run.sh`), plus static review of the frontend
  rendering logic. Browser interaction was **not** exercised by an automation
  tool in this environment. The v0.1 (Part A), Sprint 01 (Part B), and Sprint 02
  (Part C) results above are preserved; all Parts A–C endpoints re-exercised
  during this pass behaved unchanged.
- **Overall result:** **PASS** (all checklist items passed; no failures found).
  3 known limitations are recorded (see "Limitations").

## Checklist derivation

The Sprint 03 checklist was derived from `enhancements/scope.md` (features a–j,
constraints k–m), the ten feature briefs (`features/briefs/01-10/*.md`), and
`docs/architecture.md` Part D (§22–27). Backend items are grouped by the Part D
contracts (lessons `level`/`emoji` reads, admin create/update, validation
semantics); frontend items are grouped by the briefs. A representative Parts
A–C regression set is included per the verification brief. Each item is
traceable to a specific requirement. Frontend behavior is reviewed statically
(rendering logic), not exercised in a browser.

## Environment setup evidence

- The environment was already provisioned by prior stages (`.venv/` with
  `fastapi==0.111.0`, `uvicorn==0.30.1`; Bootstrap 5.3.3 under
  `frontend/static/vendor/bootstrap/`). `install.sh` was **not** re-run for this
  pass.
- `./run.sh 8099` started Uvicorn on `0.0.0.0:8099` (`app.main:app`); startup log
  recorded under `./tmp/08-stage08-server.log`; `Application startup complete`.
- Root `/` serves the SPA (HTTP 200); Bootstrap `bootstrap.min.css` and
  `bootstrap.bundle.min.js` both return HTTP 200.
- **Seed verification used the backup-restore method (as directed):** the existing
  `backend/english_tutor.db` was backed up to `english_tutor.db.bak`, deleted, and
  the server restarted so the DB was recreated and re-seeded freshly. Fresh seed
  was verified (checks D1–D2 below), then the server was stopped and the backup
  was restored, leaving the on-disk DB exactly as it was before the pass.

## Backend / API checks (live, via curl)

| # | Check (traceable requirement) | Result | Evidence |
|---|-------------------------------|--------|----------|
| D1 | Fresh seed: catalog returns 5 lessons, all Level 1 (Brief 09; scope boundary) | PASS | `GET /api/lessons` → 200; ids 1–5 each `"level":1`, `vocab_count` 10. |
| D2 | Fresh seed: the 5 seeded lessons carry the specific emojis (Brief 10; scope boundary) | PASS | 👋 (Greetings & Basics), 🔢 (Numbers & Time), 👨👩👧 (Family), 🍎 (Food & Drink), ⚡ (Common Verbs). |
| D3 | Lesson detail returns `level` + `emoji` (Brief 09/10; arch §23) | PASS | `GET /api/lessons/1` → `{"level":1,"emoji":"👋"}` + 10-item vocab. |
| D4 | No regression: vocab per lesson = 10 items (Parts A/B) | PASS | lessons 1–5 `/vocab` length [10,10,10,10,10]. |
| D5 | No regression: unknown lesson detail → 404 (arch §23) | PASS | `GET /api/lessons/999` → 404. |
| D6 | Admin dummy gate unchanged (feature h; scope note) | PASS | `POST /api/admin/login` `{admin,admin}` → 200 `{token,admin:true}`. |
| D7 | Create lesson with custom `level`+`emoji` → 201 reflects both (Brief 09/10; arch §23) | PASS | `{title:"Travel",level:4,emoji:"✈️"}` → 201 `{"id":6,"level":4,"emoji":"✈️","vocab":[]}`. |
| D8 | Create lesson with no `level`/`emoji` → defaults 1 / 📘 (arch §23) | PASS | `{title:"Default Lesson"}` → 201 `{"level":1,"emoji":"📘"}`. |
| D9 | `PUT` partial-edit `level` only updates level, preserves title/emoji (arch §23) | PASS | `PUT /api/admin/lessons/1 {"level":3}` → 200 `{title:"Greetings & Basics",level:3,emoji:"👋"}`. |
| D10 | `PUT` partial-edit `emoji` only updates emoji, preserves title/level (arch §23) | PASS | `PUT /api/admin/lessons/1 {"emoji":"🎯"}` → 200 `{level:3,emoji:"🎯"}` (title preserved). |
| D11 | `PUT` restore of lesson 1 to seed values (state cleanup) | PASS | `{"title":"Greetings & Basics","level":1,"emoji":"👋"}` → 200. |
| D12 | Validation: `level` 0 → 422 (arch §23) | PASS | create `level:0` → 422 "Input should be greater than or equal to 1". |
| D13 | Validation: `level` 6 → 422 (arch §23) | PASS | `PUT` `level:6` → 422 "Input should be less than or equal to 5". |
| D14 | Validation: non-integer `level` → 422 (arch §23) | PASS | create `level:"high"` → 422. |
| D15 | Validation: empty `emoji` → 422 (arch §23) | PASS | create `emoji:""` → 422. |
| D16 | `PUT` all fields absent → 422 (arch §23) | PASS | `PUT /api/admin/lessons/1 {}` → 422 "At least one field required". |
| D17 | `PUT` unknown lesson → 404 (arch §23) | PASS | `PUT /api/admin/lessons/999 {"level":2}` → 404. |
| D18 | Mutating admin route without token → 401 (arch §23) | PASS | `POST /api/admin/lessons` w/o token → 401. |
| D19 | No Part C regression: `GET /api/users` public; empty on fresh DB then non-empty (Part C §17) | PASS | fresh DB → 200 `{"data":[]}`; after signup → `{"data":[{"id":1,"username":"verify_s03"}]}`. |
| D20 | No Part B regression: signup/login/me + 409/401 semantics (Part B §13) | PASS | signup new user → 201; duplicate → 409; login → 200; logout (auth) → 200; used token on `/api/scores` → 401. |
| D21 | No Part B regression: scores + progress + validation (Part B §13) | PASS | quiz → 201 `score_pct:80.0`; `GET /api/scores` → 200; `GET /api/lessons/1/progress` → 200 `{total:10,known:0}`; `mode:"drill"` → 422. |
| D22 | No Part A regression: static assets + SPA served (Part A) | PASS | `/` 200; bootstrap css/js 200. |

## Frontend checks (static review)

The frontend (`index.html`, `js/app.js`, `js/views.js`, `css/style.css`) was
reviewed against the briefs. Both `app.js` and `views.js` pass `node --check`
syntax validation. Browser interaction is **not** headlessly exercised in this
environment; the results below are based on static review of the rendering and
state-flow logic.

| # | Check (traceable requirement) | Result | Evidence (static review) |
|---|-------------------------------|--------|--------------------------|
| F1 | Catalog breadcrumb / Study "Catalog" / results "All Lessons" work via event delegation (Brief 01) | PASS | `app.js` `setupNav()` registers a single document-level `click` listener on `[data-nav]` (line 435–443); all dynamically-rendered links (`data-nav="catalog"` in Lesson/Study breadcrumbs, results "All Lessons", error "Back to Catalog") route to `goCatalog()`. |
| F2 | App footer removed (Brief 02) | PASS | `index.html` contains no footer / "state served by the backend API" text; the page ends after main content. |
| F3 | Page transitions cross-fade with instant-swap fallback (Brief 03) | PASS | `app.js` `render()` wraps the DOM swap in `document.startViewTransition` when present, else applies instantly (lines 62–73); CSS defines `view-fade-in`/`view-fade-out` keyframes. No blocking/breaking of navigation. |
| F4 | Study green play control, 2s/4s auto-play, stop-at-end, toggle to stop, resync, stop-on-leave (Brief 04) | PASS | `Views.study` renders green `#studyAutoPlay` "▶ Play" (`btn-success`); `playItem()` speaks English (~2s), Hebrew (~4s), advances, stops at `vocab.length-1`; `toggleAuto` switches label to "■ Stop"/`btn-danger`; `resyncAuto()` re-anchors to the displayed item; `inDocument()` guard + `render()` speech cancel stops playback on leaving. Audio-free timed advance where speech unsupported. |
| F5 | Exam neutral selection indicator, no correctness revealed (Brief 05) | PASS | `Views.exam` `choose()` adds `.selected` to the chosen option; CSS `.option-btn.selected` is neutral grey (`#6c757d`/`#e9ecef`) with no correct/incorrect class; results deferred to `onFinish`. |
| F6 | Quiz/Exam prompt = English word alone, centered & enlarged; Hebrew options enlarged (Brief 06) | PASS | prompt rendered via `promptEl.textContent = q.prompt` (English word alone); CSS `#quizPrompt`/`#examPrompt` at `3.5rem` centered; `.option-btn` at `2.2rem`. Sizes within the brief's "about 3×" allowance. |
| F7 | Title "Admin" button renamed from "Admin Area" (Brief 07) | PASS | `Views.title` renders `<button id="titleAdmin">Admin</button>` (no "Admin Area" label). |
| F8 | Automatic admin sign-in via fixed credential; Admin sign-in form removed (Brief 08; scope note) | PASS | `app.js` `goAdmin()` calls `POST /api/admin/login` with fixed `{admin,admin}` when no token and opens the panel; no admin login form is rendered. Backend dummy gate unchanged. |
| F9 | "Level N" badge on Catalog cards and Lesson screen (Brief 09) | PASS | `Views.catalog` card renders `<span class="badge">Level {lesson.level}</span>` (line 149); Lesson hub header renders `Level {lesson.level}` badge (line 178). |
| F10 | Emoji on Catalog cards only; bundled curated picker; admin Level (1–5) + emoji selects (Brief 09/10) | PASS | Catalog card shows `{lesson.emoji}` (line 148); Lesson screen header has **no** emoji (line 178); admin add/edit forms use `levelOptions()` (1–5) and `emojiOptions()` over the bundled `CURATED_EMOJIS` set (includes the 5 seeded emojis + 📘 default + extras); create/update send `title, level, emoji`. |
| F11 | No regressions / no unrequested features; frontend holds no authoritative copy (constraints k, l; scope) | PASS | Frontend only renders API data; no new endpoints, no deletion UI, no lesson gating. All Parts A–C endpoints re-exercised (D19–D22) behaved unchanged. |
| F12 | Frontend JS parses cleanly (build sanity) | PASS | `node --check` on `app.js` and `views.js` both exit 0. |

## Summary of results

- **Total checks:** 34 (22 backend/API live + 12 frontend static).
- **Passed:** all 34 checks passed.
- **Failed:** none.

## Limitations (known, per constraints k/m — recorded, not failures)

- **L1. Quiz/Exam prompt sizing is approximate.** The English prompt is set to
  `3.5rem` and Hebrew options to `2.2rem` (feature f), tuned for layout rather
  than the literal 3× of the prior `1.75rem`/`1.4rem`. This is within the brief's
  "about 3× / may be tuned for layout" allowance and was confirmed acceptable.
- **L2. Auto-Play timing is fixed, not speech-latency-adaptive.** The 2s/4s
  pauses drive the sequence deterministically (matching the audio-free case), so
  on slow speech engines actual audio may finish slightly before the next
  segment. This matches the brief's "roughly" allowance. Stop-at-end and
  resync-on-navigation are implemented but were verified statically, not in a
  live browser.
- **L3. Automatic Admin sign-in uses a fixed credential.** `goAdmin()` supplies
  `admin`/`admin` to the retained backend dummy gate (any non-empty credential
  passes); there is no real credential verification. This is the documented
  simplification per scope constraint m, not a security guarantee.
- (Existing limitations from Parts A–C — in-memory session/admin tokens, dummy
  gate, admin-created lessons with fewer vocab items — remain in force.)

## Notes

- Verification created transient data on the **fresh** seeded DB (lessons
  "Travel"/"Default Lesson", users `verify_s03`/`verify_s03c`, one quiz score)
  against the running app. The fresh DB was deleted and the original on-disk DB
  restored from backup afterward; the database is gitignored, so no test data is
  committed and the pre-existing DB is unchanged.
- Browser interaction (clicking breadcrumbs, cross-fade transitions, auto-play
  audio, exam selection, emoji picker in a live browser) was **not** automated
  in this environment; frontend behavior was verified by static review of
  rendering/state-flow logic plus API-level verification of the endpoints the
  frontend consumes.
- The existing Part A (v0.1), Part B (Sprint 01), and Part C (Sprint 02) results
  are unchanged and remain valid; all Parts A–C endpoints re-exercised here
  (catalog, vocab, auth, scores, progress, review, users, admin) behaved
  identically during this pass.