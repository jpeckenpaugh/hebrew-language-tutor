# Summary: Bug Fixer (Stage 2)

- **Date:** 2026-08-29
- **Author / Executor:** Bug Fixer (Stage 2 role)
- **Instruction file:** `instructions/debug/02-fix-bug.md`
- **Bug report:** `bugs/01-tts-issue.md`
- **Commit:** `debug 02: harden tts speak against stall and stray punctuation`

## Work Completed

Implemented the approved fail-safe hardening for the TTS `speak()` helper. The
change is client-side only, confined to `frontend/js/views.js`, and implements
exactly the approved fix: guard `cancel()`, attach `onend`/`onerror` recovery
handlers, and strip trailing punctuation before speaking. Cause 2 (the stray
`!` in the data) was already resolved by the human's data cleanup and required
no code change.

## Outputs Produced / Modified

- `frontend/js/views.js` — modified. Reworked the `speak()` helper (lines
  191-211): conditional `cancel()` gated on an in-progress utterance, `onend`/
  `onerror` handlers that reset state and call `speechSynthesis.resume()`, and
  trailing-punctuation stripping.
- `bugs/01-tts-issue.md` — modified. Appended a "Fix Implementation (Stage 2)"
  section (changes, automated verification result, pending human confirmation)
  and set `Status` to `Fixed`.
- `instructions/debug/summaries/02-tts-issue.md` — new. This summary.
- `tmp/02-app.log` — scratch app-startup log (gitignored, not committed).

## Key Decisions

- Used a module-scoped `currentUtter` flag (in the study view scope) to gate
  `cancel()`, so it only runs while speech is genuinely in progress — directly
  addressing the Chromium cancel-then-speak stall.
- Called `resume()` in the `finish` handler so the synthesis engine is nudged
  back to a speaking state after any utterance end/error, making the session
  recoverable even after a bad entry.
- Stripped trailing punctuation with a small character class covering `! ? . , ; :`
  and common punctuation forms, as a defensive measure only.

## Open Questions & Concerns

Human confirmation in a real browser is still pending: verify TTS across
multiple consecutive vocab items (English and Hebrew) and confirm no word reads
"Exclamation Point". No code concerns remain.

## Status

- [x] Complete
- [ ] Needs review