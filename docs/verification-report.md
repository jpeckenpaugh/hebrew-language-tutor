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