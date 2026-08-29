# Bug 01 — TTS works once then fails; Hebrew word reads "Exclamation Point"

## Status

Analyzed.

## Summary

The text-to-speech (TTS) feature, implemented with the browser's Web Speech API,
works the first time it is used and then silently stops for all subsequent
words. Additionally, the Hebrew pronunciation for the first vocabulary word
speaks only "Exclamation Point" instead of the Hebrew text.

## Symptom (reported by user)

1. Signed in and went to Lesson 1, Vocab 1 (Hello / Shalom).
2. TTS worked correctly the first time for BOTH the English and Hebrew
   pronunciations.
3. After playing one Hebrew TTS word, none of the other words' TTS works.
4. Returning to the first word "Shalom" and pressing the "Hebrew" TTS button
   again only speaks "Exclamation Point" — it reads the exclamation mark that
   is in the word rather than the Hebrew text.

## Environment

- Web app: English/Hebrew Language Tutor (sprint-01).
- TTS: Web Speech API (`window.speechSynthesis`) in the browser.
- Repro: signed-in, Lesson 1, Vocab 1.

## Root Cause Analysis

This report contains **two independent root causes** that manifest together in
the study view. Both are reproducible from the artifacts below.

### Cause 1 — TTS silently stops after the first use

**Root cause:** the `speak()` helper in `frontend/js/views.js:191-197` calls
`window.speechSynthesis.cancel()` immediately before
`window.speechSynthesis.speak(utter)` in the same synchronous tick:

```
frontend/js/views.js:193  window.speechSynthesis.cancel();
frontend/js/views.js:196  window.speechSynthesis.speak(utter);
```

This unconditional cancel-then-speak pattern is a well-documented Chromium /
Web Speech API defect: calling `cancel()` (especially while the engine is idle
or as the previous utterance is winding down) leaves the synthesis engine in a
stalled state, so subsequent `speak()` calls are queued but never begin —
producing a silent failure. Because every TTS button handler routes through
`speak()` (`frontend/js/views.js:209-216`), the stall affects **every** word
after the first utterance until a full page reload.

**Evidence:** `frontend/js/views.js:191-197` (the cancel+speak sequence),
`frontend/js/views.js:209-216` (all buttons call `speak()`). No `onend` /
`onerror` handler and no `speechSynthesis.resume()` call exists anywhere in the
frontend, so there is no code path that recovers the engine from the stall.

### Cause 2 — Hebrew reads "Exclamation Point"

**Root cause:** the Hebrew value stored for vocab id 1 in the app's SQLite DB
`backend/english_tutor.db` is `"שלום!"` — it contains a literal `!` appended.
The canonical seed data (`backend/app/seed.py:5`) defines this word as
`("hello", "שלום", "shalom")` with **no** exclamation mark, so the DB value was
changed at runtime (via the admin add/update handlers in
`frontend/js/app.js:331-340` / `frontend/js/app.js:352-358`, or directly).

This stored value is served verbatim to the frontend (`backend/app/routers/catalog.py:41,66`)
and passed verbatim as `text` to `SpeechSynthesisUtterance` by `speak()`
(`frontend/js/views.js:194`). The browser's TTS then announces the `!` as
"Exclamation Point"; when no `he-IL` voice is available, the fallback voice can
read only the recognizable punctuation, producing just "Exclamation Point".

**Evidence:**
- `sqlite3 backend/english_tutor.db "SELECT id, english, hebrew FROM vocab WHERE id=1;"`
  → `1|hello|שלום!|shalom` (confirmed `!` present).
- `backend/app/seed.py:5` → `("hello", "שלום", "shalom")` (no `!`).
- `frontend/js/views.js:194` → `new SpeechSynthesisUtterance(text)` with the
  un-sanitized `item.hebrew`.
- `backend/app/routers/catalog.py:41,66` → serves `hebrew` unchanged.

## Proposed Fix

### Fix for Cause 1 (`frontend/js/views.js:191-197`)

- Remove the unconditional `cancel()`-before-`speak()` pattern that triggers the
  Chromium speech-synthesis stall.
- Recommended approach: guard `cancel()` so it only runs when speech is actually
  in progress, and/or defer the new utterance to the previous utterance's
  `onend`/`onerror`/`resume` callback; also attach an `onend` handler and call
  `speechSynthesis.resume()` before speaking to clear a possible paused state.
- Files to change: `frontend/js/views.js` (the `speak()` helper only). No
  backend change needed; this is client-side.

### Fix for Cause 2 (data cleanup + optional hardening)

- **Data cleanup (required):** correct the stored Hebrew for vocab id 1 in
  `backend/english_tutor.db` back to `"שלום"` (drop the stray `!`), matching the
  seed. E.g.
  `sqlite3 backend/english_tutor.db "UPDATE vocab SET hebrew='שלום' WHERE id=1;"`
- **Optional hardening:** sanitize the text passed to TTS in `speak()`
  (`frontend/js/views.js:194`) by stripping punctuation before speaking, so stray
  punctuation is never read aloud even if it reappears in data.
- Files to change: `backend/english_tutor.db` (data), and optionally
  `frontend/js/views.js`.

> Human gate: approve the Cause 1 fix approach (guarded/queued speech) and the
> Cause 2 data cleanup before the fix stage runs.