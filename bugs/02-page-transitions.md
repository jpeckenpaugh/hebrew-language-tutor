# Bug 02 — Page transitions do not fade; screens glitch on load

## Status

Fixed.

## Summary

The recently-added page-to-page cross-fade transitions do not work. Navigating
between screens shows no smooth fade — pages "just sort of load then glitch a
bit", with no smooth transition.

## Symptom (reported by user)

1. Navigate between screens in the app (e.g. Catalog to a Lesson, or between
   study/quiz/exam screens).
2. Instead of a smooth cross-fade, the page appears to load abruptly and glitch,
   with no pleasant transition effect.

## Environment

- Web app: English/Hebrew Language Tutor (sprint-03).
- Transitions implemented with the View Transitions API (`document.startViewTransition`)
  in `frontend/js/app.js`.
- Repro: navigate between any screens.

## Reproduction

- Open the app and move between two screens (e.g. Catalog → Lesson, or
  Study/Quiz/Exam).
- Observe that no smooth fade occurs; the page loads with a glitch rather than
  a cross-fade.

## Root Cause Analysis

The View Transitions cross-fade is configured correctly but is masked by the
loading spinner, which is shown for **every** navigation and toggled *outside*
the view transition's captured snapshot. The result is a spinner "pop" plus a
very short 180&nbsp;ms fade — read by the user as a "load then glitch" rather
than a smooth cross-fade.

Evidence:

- `frontend/js/app.js:54-56` — `showLoading(on)` toggles the `#loading` spinner,
  which lives in `#app` as a sibling of `#content` (`frontend/index.html:34-36`),
  i.e. **outside** the region being swapped by the transition.
- `frontend/js/app.js:62-73` — `render()` calls `document.startViewTransition(apply)`
  where `apply` swaps `#content`. `startViewTransition` defers `apply` to a later
  animation frame, so it returns immediately.
- Every navigation calls `showLoading(true)` → `render(...)` → `showLoading(false)`
  (in `.finally`), e.g. `frontend/js/app.js:99,102,117` (`goTitle`),
  `frontend/js/app.js:205,208,214` (`goCatalog`), `frontend/js/app.js:220,226,231`
  (`openLesson`), `frontend/js/app.js:236,249,253` (`openMode`),
  `frontend/js/app.js:287,292,298` (`goScores`), `frontend/js/app.js:326,329,338`
  (`renderAdminPanel`).
- Because `render()` returns immediately and `showLoading(false)` in `.finally`
  runs in the same microtask, the spinner is hidden **before** the transition's
  "old" snapshot is captured; the spinner's show/hide is never part of the view
  transition, so it flashes abruptly on top of the cross-fade.
- `frontend/css/style.css:112-130` — the fade itself is only `0.18s`
  (`view-fade-in`/`view-fade-out`), very fast, so even where it runs it is barely
  perceptible.

The `if (document.startViewTransition)` guard (`frontend/js/app.js:68`) correctly
falls back to an instant swap on unsupported browsers; that is expected behavior,
not the bug.

## Proposed Fix

Coordinate the loading state with the view transition so the cross-fade is the
only visible change, and make the fade perceptible:

- In `frontend/js/app.js`, stop showing the `#loading` spinner for intra-app
  navigation that `render()` transitions (reserve it for the initial page load),
  **or** hide the spinner before calling `render()` (call `showLoading(false)`
  prior to the transition so the spinner is not captured), **or** move the
  spinner toggle into the `apply()` callback so it is inside the transition.
  This applies to every `showLoading(true)` / `render()` / `showLoading(false)`
  call site listed above.
- Optionally lengthen the fade in `frontend/css/style.css:124-130` (e.g. to
  ~0.3–0.4s) so the cross-fade is clearly perceptible.

Files to change: `frontend/js/app.js`, `frontend/css/style.css`.

## Fix Implementation (Stage 2)

Implemented the approved fix: suppress the `#loading` spinner for intra-app
`render()` transitions (keeping it for the initial page load) and lengthen the
cross-fade so it is clearly perceptible.

**Changes made:**
- `frontend/js/app.js` — added a `spinnerEnabled` flag (default `true`). The
  initial page load still shows the `#loading` spinner; `render()` sets
  `spinnerEnabled = false` after the first screen renders, and `showLoading(true)`
  is a no-op once disabled. Every intra-app navigation
  (`goTitle`/`goCatalog`/`openLesson`/`openMode`/`goScores`/`renderAdminPanel`)
  therefore no longer flashes the spinner on top of the transition, so the
  cross-fade is the only visible change.
- `frontend/css/style.css` — lengthened the view-transition fades
  (`::view-transition-old(root)` / `::view-transition-new(root)`) from `0.18s`
  to `0.3s` so the cross-fade is perceptible.

**Automated verification result:** PASS
- `node --check frontend/js/app.js` — JS syntax valid.
- `./run.sh` (uvicorn on port 8000) — app starts and serves the updated
  `frontend/js/app.js` and `frontend/css/style.css`.
- Headless-Chrome runtime check: signed in as a learner and opened a lesson;
  sampled `#loading` continuously during navigation — the spinner was **never**
  shown after the initial load. Confirmed the served CSS animates at `0.3s`.

**Human confirmation pending:** verify in a real browser that screen changes now
cross-fade smoothly (no spinner "pop" or glitch). Stage 3 will mark this
`Resolved` after your confirmation.