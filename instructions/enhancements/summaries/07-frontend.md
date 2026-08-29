# Summary: Frontend Engineer (Stage 7)

- **Date:** 2026-08-29
- **Author / Executor:** Frontend Engineer (Stage 7 role)
- **Instruction file:** `instructions/enhancements/07-frontend.md`
- **Scope reference:** `enhancements/scope.md`
- **Commit:** `stage 07: implement Sprint 03 frontend enhancements`

## Work Completed

Implemented all Sprint 03 frontend enhancements (features a–h) plus the
frontend-side of the lesson `level`/`emoji` fields (features i, j) against the
`docs/architecture.md` Part D contract, extending the existing v0.1 / Sprint 01 /
Sprint 02 interface without recreating it or regressing out-of-scope behavior.

## Outputs Produced / Modified

- `frontend/index.html` (modification) — removed the app footer (feature b).
- `frontend/js/app.js` (modification) — event-delegated navigation for all
  `[data-nav]` links (feature a), View Transitions cross-fade render wrapper with
  speech cancellation on navigation (features c, d), automatic admin sign-in via
  a fixed credential to the retained dummy gate (feature h), and admin
  create/update lesson payloads now include `level`/`emoji` (features i, j).
- `frontend/js/views.js` (modification) — "Level N" badge + emoji on Catalog
  cards (i, j); "Level N" badge on the Lesson hub (i); Study auto-play green
  play/stop control with 2s/4s timing, resync on navigation, stop on leave (d);
  neutral Exam selection highlight (e); enlarged/centered Quiz/Exam English prompt
  + enlarged Hebrew options (f); Title "Admin" button rename (g); removed the
  Admin sign-in form (h); Admin lesson add/edit forms gained a Level select
  (1–5, default 1) and a bundled curated emoji picker (i, j). Added the bundled
  `CURATED_EMOJIS` set and `levelOptions`/`emojiOptions` helpers.
- `frontend/css/style.css` (modification) — enlarged/centered Quiz/Exam prompt
  (~3.5rem) and options (~2.2rem) (f); neutral `.selected` Exam option style (e);
  View Transitions cross-fade with instant-swap fallback (c).
- `instructions/enhancements/summaries/07-frontend.md` (this summary).

## Key Decisions

- **Event delegation (feature a).** Replaced the init-time `wireNav()` (which
  only bound static navbar links) with a single delegated document-level
  `[data-nav]` click listener. This makes every dynamically-rendered link — the
  Lesson/Study breadcrumbs, the results screen's "All Lessons" button, and the
  error view's "Back to Catalog" — work after the page renders. Removed the dead
  per-view `preventDefault()`-only handlers and the redundant `showError` binding.
- **View Transitions (feature c).** Wrapped the central `render()` in
  `document.startViewTransition` when available, else instant swap. Browsers
  without support are unaffected (feature c degrades gracefully).
- **Study Auto-Play (feature d).** Fixed ~2s/4s `setTimeout` sequence speaking
  English then Hebrew at each segment start; identical timed advance (no audio)
  when speech is unsupported. A single control toggles play/stop. Manual
  prev/next resyncs to the displayed item; `render()` cancels
  `speechSynthesis` and the timer guards on `document.body.contains` so leaving
  the lesson stops playback. Operates within the current lesson only.
- **Exam selection (feature e).** Kept the existing lock-on-select-and-advance
  flow (re-selection is "not required" per brief) and added a neutral
  `.selected` highlight to the chosen option — no correctness revealed.
- **Enlarged/centered question (feature f).** Prompt is now the English word
  alone (`promptEl.textContent = q.prompt`), centered and ~3.5rem; options ~2.2rem
  centered. Sizes tuned for layout per brief ("about 3×", exact size flexible).
- **Automatic admin sign-in (feature h).** `goAdmin()` now calls the retained
  dummy gate (`POST /api/admin/login`) with a fixed `admin`/`admin` credential
  when no admin token is held, then opens the panel; the Admin sign-in form
  (`Views.adminLogin`) was removed. Recorded as a documented simplification.
- **Admin Level/emoji (i, j).** Add-lesson form gained a Level select (default 1)
  and emoji picker; per-lesson edit rows gained Level and emoji selects feeding a
  single Save. Both use `levelOptions`/`emojiOptions` over the small bundled
  `CURATED_EMOJIS` set (the 5 seeded emojis + 📘 default + extras), per constraint k.
  Emoji is rendered on Catalog cards only (not the Lesson screen), per Brief 10.

## Open Questions & Concerns

- **Feature f sizing is approximate.** Used ~3.5rem prompt / ~2.2rem options,
  centered, honoring the brief's "tuned for layout" allowance rather than the
  literal 3× of the prior 1.75rem/1.4rem. Acceptable per the granted discretion;
  the verification stage should confirm readability across viewport widths.
- **Auto-Play timing is fixed, not speech-latency-adaptive.** The 2s/4s pauses
  drive the sequence deterministically (matching the audio-free case), so actual
  audio may finish slightly before the next segment on slow speech engines. This
  matches the brief's "roughly" allowance. Verify stop-at-end and resync-on-
  navigation behaviors in a real browser.
- **Fixed admin credential (`admin`/`admin`).** Sent through the retained dummy
  gate; any non-empty password passes. This is the documented simplification
  (scope constraint m). Verify the gate returns 400 only on empty credentials,
  which the frontend never sends.
- **Emoji back-fill on existing DB.** The seeded lessons already carry their
  specific emojis via the Stage 6 title back-fill; admin-created rows default to
  📘 until edited. The frontend always sends a chosen emoji from the curated set.
- None else. All API contracts consumed by the frontend (`GET /api/lessons` and
  `/api/lessons/{id}` with `level`/`emoji`, admin login, lesson create/update with
  `level`/`emoji`) were verified against the running backend, and all changed view
  functions passed a jsdom smoke test (22 checks).

## Status

- [x] Complete
- [ ] Needs review