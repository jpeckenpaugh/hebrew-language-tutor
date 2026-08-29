# Summary: Bug Investigator (Stage 1)

- **Date:** 2026-08-29
- **Author / Executor:** opencode (Bug Investigator role)
- **Instruction file:** `instructions/debug/01-investigate-bug.md`
- **Bug report:** `bugs/01-tts-issue.md`
- **Commit:** `debug 01: analyze tts one-shot and exclamation-point bug`

## Work Completed

Analyzed `bugs/01-tts-issue.md` against the codebase and the app's SQLite DB.
No application code was modified. Identified **two independent root causes** and
proposed fixes for each, backed by specific `file:line` evidence.

## Root Causes Found

1. **TTS stops after first use** — `frontend/js/views.js:191-197`
   (`speak()`) calls `speechSynthesis.cancel()` immediately before
   `speak()`. This unconditional cancel-then-speak pattern triggers a
   well-documented Chromium Web Speech API stall; all subsequent utterances are
   silently dropped until a page reload.
2. **Hebrew reads "Exclamation Point"** — vocab id 1 in
   `backend/english_tutor.db` stores `"שלום!"` (a stray `!`), unlike the seed
   `backend/app/seed.py:5` (`"שלום"`). The stored value is served verbatim
   (`backend/app/routers/catalog.py:41,66`) and spoken verbatim by
   `frontend/js/views.js:194`, so the `!` is announced as "Exclamation Point".

## Proposed Fixes

- **Cause 1:** Rework `speak()` in `frontend/js/views.js` — guard `cancel()`
  (only cancel when speech is in progress), and/or queue the next utterance via
  the previous one's `onend`/`onerror`/`resume`; add `resume()` and an `onend`
  handler. Client-side only.
- **Cause 2:** Data cleanup — set vocab id 1 hebrew back to `"שלום"` in
  `backend/english_tutor.db`; optionally harden `speak()` to strip punctuation.

## Outputs Produced / Modified

- `bugs/01-tts-issue.md` — modified: `Status` set to `Analyzed`; appended
  `## Root Cause Analysis` and `## Proposed Fix` sections (original symptom and
  reproduction steps left intact).
- `instructions/debug/summaries/01-tts-issue.md` — new: this summary.

## Key Decisions

- Treated the two reported symptoms as separate root causes (per instructions:
  separate independent causes and state each clearly).
- Did not run the live browser app to reproduce (the TTS failure is a client-side
  Web Speech API defect not reachable from the backend server); evidence is
  static code + DB inspection, which is sufficient and unambiguous.

## Open Questions & Concerns

- Human must **approve the proposed fix** (both the Cause 1 speech-queueing
  approach and the Cause 2 DB data cleanup) before the fix stage runs.
- The data cleanup touches the tracked `backend/english_tutor.db`; confirm the
  DB file is the intended source of truth and that reverting vocab id 1 to
  `"שלום"` is acceptable.

## Status

- [x] Complete
- [ ] Needs review