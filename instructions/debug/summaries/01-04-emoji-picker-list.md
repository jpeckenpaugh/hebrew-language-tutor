# Summary: Bug Investigator (Stage 1)

- **Date:** 2026-08-29
- **Author / Executor:** opencode (Bug Investigator role)
- **Instruction file:** `instructions/debug/01-investigate-bug.md`
- **Bug report:** `bugs/04-emoji-picker-list.md`
- **Commit:** `debug 01: analyze the five sprint-03 bugs`

## Work Completed

Analyzed `bugs/04-emoji-picker-list.md` against the Admin frontend code. No
application code was modified. Identified why the emoji picker offers only a
short list with no search.

## Root Causes Found

The emoji picker is a plain HTML `<select>` populated from a small hardcoded
constant — only **12** emojis in `CURATED_EMOJIS` (`frontend/js/views.js:28`) —
via `emojiOptions()` (`frontend/js/views.js:36-40`). Native `<select>` elements
provide no name-search/filter UI. The picker is used in the Add-Lesson form
(`frontend/js/views.js:666`) and each lesson edit row (`frontend/js/views.js:687`).

## Proposed Fixes

- Expand `CURATED_EMOJIS` (`frontend/js/views.js:28`) to a much longer curated
  list, associating each emoji with a name (curation at the implementer's
  discretion; no external dataset required).
- Replace the two `<select>` pickers and `emojiOptions()` with a searchable emoji
  picker (name-filter input + clickable grid). Frontend-only; backend already
  stores a single emoji string per lesson (`backend/app/routers/admin.py:50,80`).

## Outputs Produced / Modified

- `bugs/04-emoji-picker-list.md` — modified: `Status` set to `Analyzed`; appended
  `## Root Cause Analysis` and `## Proposed Fix`.
- `instructions/debug/summaries/01-04-emoji-picker-list.md` — new: this summary.

## Key Decisions

- No external emoji dataset is prescribed; the curated list + search filter are
  left to the implementer, per the Stage Manager's direction.

## Open Questions & Concerns

- Human must **approve** the proposed searchable-picker approach and the
  implementer's chosen curated emoji set before the fix stage runs.

## Status

- [x] Complete
- [ ] Needs review