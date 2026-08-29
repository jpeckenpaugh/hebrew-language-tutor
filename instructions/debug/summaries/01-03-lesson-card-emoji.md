# Summary: Bug Investigator (Stage 1)

- **Date:** 2026-08-29
- **Author / Executor:** opencode (Bug Investigator role)
- **Instruction file:** `instructions/debug/01-investigate-bug.md`
- **Bug report:** `bugs/03-lesson-card-emoji.md`
- **Commit:** `debug 01: analyze the five sprint-03 bugs`

## Work Completed

Analyzed `bugs/03-lesson-card-emoji.md` against the frontend view code. No
application code was modified. Identified why the Catalog-card emoji renders
small and inline with the lesson name.

## Root Causes Found

The Catalog card renders the emoji **inside the `<h5 class="card-title">`**
(`frontend/js/views.js:148`), so it inherits the small card-title font size and
sits on the same line as the title. The Study/Quiz/Exam cards instead render a
large `display-6` block icon on its own line above the label
(`frontend/js/views.js:207-208`) — the layout the user wants to match. The emoji
value itself is stored/served correctly (confirmed via `GET /api/lessons`).

## Proposed Fixes

- Restructure the Catalog card markup in `catalog()` (`frontend/js/views.js:144-156`)
  to render the emoji as a larger block above the `<h5>` title, mirroring the
  mode-card layout at `frontend/js/views.js:207-208`. Optional CSS tuning.

## Outputs Produced / Modified

- `bugs/03-lesson-card-emoji.md` — modified: `Status` set to `Analyzed`; appended
  `## Root Cause Analysis` and `## Proposed Fix`.
- `instructions/debug/summaries/01-03-lesson-card-emoji.md` — new: this summary.

## Key Decisions

- Confirmed the data side is correct (emoji is stored and served); the defect is
  purely presentational in the Catalog card template.

## Open Questions & Concerns

- Human must **approve** the proposed markup change before the fix stage runs.
- None otherwise.

## Status

- [x] Complete
- [ ] Needs review