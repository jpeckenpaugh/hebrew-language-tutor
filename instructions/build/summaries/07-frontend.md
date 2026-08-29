# Summary: Frontend Engineer (Stage 7)

- **Date:** 2026-08-29
- **Author / Executor:** Frontend Engineer (AI)
- **Instruction file:** `instructions/07-frontend.md`

## Work Completed

Built the browser interface for the English/Hebrew Language Tutor as a
single-page application under `frontend/`, consuming the Stage 6 backend API
exactly as defined in `docs/architecture.md` §6. The app sources all
application state (catalog, lesson vocabulary, saved scores) from the backend
and never holds its own authoritative copy. Implemented all user-visible modes
from the feature briefs: lesson catalog, study, quiz (immediate feedback),
exam (deferred results), saved-scores history, and the admin area (login +
lesson/vocab edit & add). Bootstrap 5.3.3 is used as the baseline UI framework.

## Outputs Produced

- `frontend/index.html` — SPA shell + Bootstrap navbar navigation
- `frontend/css/style.css` — app-specific styles (Bootstrap is a vendor asset)
- `frontend/js/app.js` — controller: navigation, API client, mode/admin flows
- `frontend/js/views.js` — pure rendering of catalog/study/quiz/exam/scores/admin
- `frontend/static/vendor/bootstrap/` — already provisioned, referenced as-is

## Key Decisions

- **File layout** follows `docs/architecture.md` §2 exactly (`index.html`,
  `css/style.css`, `js/app.js`, `js/views.js`).
- **Controller/render split:** `app.js` owns fetch calls, navigation, admin
  token handling, and quiz/exam score submission; `views.js` is pure rendering
  that never fetches or fabricates data — it receives data + callbacks.
- **Question construction** is client-side per the shared contract: the correct
  answer is the asked vocab item and the 3 distractors are drawn from the same
  lesson's other items. The prompt is English and choices are Hebrew.
- **Admin token** is kept only in memory (matching the backend's per-process
  token store). On any 401, the app clears the token and re-prompts for sign-in.
- **Score persistence:** quiz and exam both `POST /api/scores` on completion,
  then show a results screen. A failed save still shows results (best-effort);
  saved history is visible via `GET /api/scores`.

## Open Questions & Concerns

- **Tokens invalidate on server restart:** because the backend holds tokens in
  memory, a restart makes any held token stale. The frontend handles this by
  re-prompting on 401; no other action is needed.
- **Quiz/exam prompt direction:** questions ask English → Hebrew (the natural
  study direction). The briefs allow either; this is an assumption the
  verification stage should confirm is acceptable.
- **Admin count badges** (`N items ▾`) refresh on the next full panel render;
  after adding a vocab item the expanded list reloads but the badge updates on
  re-render. Cosmetic only.
- **No-deletion:** consistent with the non-goals, the admin UI intentionally
  offers no delete actions.

## Status

- [x] Complete
- [ ] Needs review