# Summary: Bug Investigator (Stage 1)

- **Date:** 2026-08-29
- **Author / Executor:** opencode (Bug Investigator role)
- **Instruction file:** `instructions/debug/01-investigate-bug.md`
- **Bug report:** `bugs/02-page-transitions.md`
- **Commit:** `debug 01: analyze the five sprint-03 bugs`

## Work Completed

Analyzed `bugs/02-page-transitions.md` against the frontend code and the running
app. No application code was modified. Traced the missing cross-fade to the
interaction between the `#loading` spinner and the View Transitions API.

## Root Causes Found

The View Transitions cross-fade is configured correctly (`frontend/js/app.js:62-73`
`render()` + `frontend/css/style.css:112-130`) but is masked by the loading
spinner: every navigation runs `showLoading(true)` → `render()` →
`showLoading(false)` (in `.finally`). Because `document.startViewTransition(apply)`
defers `apply` but `showLoading(false)` runs synchronously in the same microtask,
the spinner (a sibling of `#content`, `frontend/index.html:34-36`) is toggled
*outside* the transition's captured snapshot, flashing abruptly over the
cross-fade. Combined with the very short 0.18s fade, the effect reads as a
"load then glitch." The `if (document.startViewTransition)` fallback (instant
swap) is expected behavior on unsupported browsers, not the bug.

## Proposed Fixes

- Coordinate the loading state with the transition in `frontend/js/app.js`
  (hide the spinner before `render()`, move the toggle into `apply()`, or
  reserve the spinner for initial page load only).
- Optionally lengthen the fade in `frontend/css/style.css:124-130` (~0.3-0.4s).

## Outputs Produced / Modified

- `bugs/02-page-transitions.md` — modified: `Status` set to `Analyzed`; appended
  `## Root Cause Analysis` and `## Proposed Fix` (original symptom/repro intact).
- `instructions/debug/summaries/01-02-page-transitions.md` — new: this summary.

## Key Decisions

- Identified the loading-spinner/transition interaction as the primary cause (the
  feature-detect fallback for unsupported browsers is not a defect).
- Ran the app (`./run.sh` on port 8099) to confirm it serves correctly; the
  transition behavior itself is browser-visual and was assessed statically.

## Open Questions & Concerns

- Human must **approve** the proposed fix (coordinating spinner/transition and
  optionally lengthening the fade) before the fix stage runs.
- Browser-visual confirmation of the fade would be ideal.

## Status

- [x] Complete
- [ ] Needs review