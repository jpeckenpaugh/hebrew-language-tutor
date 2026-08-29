# Summary: Frontend Engineer (Stage 7)

- **Date:** 2026-08-29
- **Author / Executor:** Frontend Engineer (stage 07)
- **Instruction file:** `instructions/enhancements/07-frontend.md`
- **Scope reference:** `enhancements/scope.md`
- **Commit:** `stage 07: add title screen, learner sessions, pronunciation aids, review, and progress to the UI`

## Work Completed

Extended the existing v0.1 single-page frontend to consume the Sprint 01 backend
contract (Stage 6) and implement the in-scope enhancements. The interface was
**modified**, not recreated, and all existing v0.1 screens/mechanics were kept
intact. Application state continues to come from the backend API; the frontend
holds no authoritative copy.

Implemented:
- **Title screen & session control (Briefs 01/02)** — the app now opens to a
  Title screen (username sign-in / create account / Admin entry) instead of the
  catalog. A user session token is stored in memory and sent as
  `Authorization: Bearer <user-token>` on user-scoped calls, in a namespace
  separate from the v0.1 admin token. A navbar "Log out" control (plus a
  signed-in-as badge) returns the user to the Title screen for both student and
  admin. The dummy admin gate is unchanged.
- **Pronunciation guide (Brief 04)** — study mode now displays the English
  `transliteration` alongside the Hebrew word.
- **Text-to-speech (Brief 05)** — study mode offers 🔊 English / 🔊 Hebrew
  buttons using the browser Web Speech API (`SpeechSynthesis`); entirely
  client-side, no backend audio endpoint.
- **Incorrect-answer review (Brief 06)** — quiz/exam completion now POSTs the
  per-item `answers` payload, and the results screen offers "Review N Incorrect"
  (when there are wrong answers) which fetches `GET /api/scores/{id}/review` and
  lists each wrong item with its correct answer.
- **Known-word progress (Brief 07)** — the lesson hub now fetches
  `GET /api/lessons/{id}/progress` and renders a per-user progress bar
  ("N of M known").
- **Per-user score history (Brief 03)** — unchanged view, now naturally filtered
  to the signed-in user by the backend.
- **Admin transliteration support** — the admin add/edit vocab forms now collect
  and submit `transliteration`, matching the Stage 6 `VocabCreate`/`VocabUpdate`
  contracts (required to avoid 422 on vocab create).

## Outputs Produced / Modified

- `frontend/index.html` (modified) — added navbar user badge + logout control.
- `frontend/css/style.css` (modified) — `.on-title .navbar` rule to hide the
  main navbar on the Title screen.
- `frontend/js/app.js` (modified) — user session state/token handling in the API
  client (token chosen by path: admin vs user), Title/auth/logout/review
  orchestration, per-item `answers` on `POST /api/scores`, progress fetch on the
  lesson hub, 401 → return-to-title handling, admin vocab transliteration.
- `frontend/js/views.js` (modified) — new `title` and `review` views; study view
  transliteration + TTS; lesson hub progress bar; results-screen review button;
  admin vocab transliteration inputs.

All four files are modifications to existing v0.1 frontend artifacts; no new
files were created.

## Key Decisions

- **Token selection by path.** `api()` attaches the user token for non-admin
  paths and the admin token for `/api/admin/*`, keeping the two Stage 6
  namespaces distinct without changing the existing admin call sites.
- **Title screen as app entry.** `init()` now calls `goTitle()`; the navbar is
  hidden via a body class on the Title screen and shown once signed in or in the
  Admin area.
- **Review gating.** The review button only appears when the attempt had wrong
  answers and a score id was returned; the local result is still shown if saving
  fails.
- **Progress best-effort.** If the progress fetch fails, the hub still renders
  (progress is optional). A 401 anywhere in a user-scoped flow returns to the
  Title screen, per the in-memory token concern flagged by Stage 6.

## Open Questions & Concerns

- **Empty transliterations** on a couple of non-seed vocab items (flagged by
  Stage 6) render as blank in study mode and are left blank in admin edit fields;
  admin should populate them. The frontend tolerates empty strings.
- **In-memory session tokens** do not survive a server restart; on such a 401 the
  frontend returns to the Title screen (handled), but the user must sign in again.
- **Review flow relies on `POST /api/scores` returning the new score `id`;**
  confirmed present in the Stage 6 contract and live API.
- **Verification should confirm** the quiz/exam → answers → review/progress chain
  end to end with two users to prove per-user isolation, and that study/quiz do
  not create known-word rows (exam-only per Brief 07).

## Status

- [x] Complete
- [ ] Needs review