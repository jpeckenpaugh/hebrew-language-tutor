# Bug 01 — TTS works once then fails; Hebrew word reads "Exclamation Point"

## Status

Resolved.

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

## Finding / Resolution

A human applied the Cause 2 data cleanup manually:

- Deleted `backend/english_tutor.db` (the local SQLite store, gitignored and
  regenerated at startup) and re-seeded from `backend/app/seed.py`.
- Confirmed the exclamation point is gone and TTS now works correctly.
- Verified TTS across **5 consecutive vocab items** on Lesson 01, English and
  Hebrew, all behaving as expected.

This confirms that **Cause 2 (the stray `!` in the data) was the true root cause**
of the reported failure. With clean data, the `cancel()`-before-`speak()`
pattern in `frontend/js/views.js:191-197` does **not** independently break TTS —
the "stall" observed was a downstream consequence of the bad utterance, not an
independent code bug.

## Proposed Fix (revised — fail-safe hardening)

### Cause 2 (data) — RESOLVED

No code change needed. The DB was cleaned and re-seeded by the human, and TTS is
verified working. This portion of the bug is closed.

### Cause 1 — reframed as fail-safe hardening (recoverability)

Because one bad/unpronounceable TTS entry was able to silently disable all TTS
for the rest of the session, we want TTS to be **recoverable** — a single failed
utterance should not crash the TTS session. This is defense-in-depth, not a
required bug fix (clean data works), but it prevents recurrence if bad data is
ever re-introduced (e.g. via the admin add/update handlers in
`frontend/js/app.js:331-340,352-358`).

Implement in `frontend/js/views.js` `speak()` (the `speak()` helper only;
client-side, no backend change):

- **Guard `cancel()`** so it only runs when speech is actually in progress,
  instead of unconditionally cancelling before every utterance.
- **Attach `onend`/`onerror` handlers** on the utterance so a failed or
  interrupted utterance is observed and the engine is not left stuck.
- **Strip trailing punctuation** before speaking (defensive), so stray
  punctuation is never read aloud if it reappears in data.
- The exact technique (e.g. deferring the new utterance, calling `resume()`,
  or queuing on `onend`) is at the implementer's discretion, so that a single
  bad entry no longer disables TTS for the rest of the session.

> Human gate: approve the revised fail-safe hardening before the fix stage runs.
> The Cause 2 data cleanup is already done and does not need a code change.

## Fix Implementation (Stage 2)

Implemented the approved fail-safe hardening in `frontend/js/views.js` `speak()`
(lines 191-211), client-side only; no backend change.

**Changes made:**
- Guarded `cancel()` so it only runs when an utterance is actually in progress
  (tracked via a `currentUtter` variable), instead of cancelling unconditionally
  before every utterance — avoiding the Chromium cancel-then-speak stall.
- Attached `onend`/`onerror` handlers on the utterance; each clears `currentUtter`
  and calls `speechSynthesis.resume()` so the engine is recovered even after a
  failed or interrupted utterance. A single bad entry can no longer disable TTS
  for the rest of the session.
- Strips trailing punctuation (`! ? . , ؛ ، ; :`) from the text before speaking,
  so a stray `!` (if it ever reappears in data) is never read aloud.

**Automated verification result:** PASS
- `node --check frontend/js/views.js` — JS syntax valid.
- `./run.sh` (uvicorn on port 8099) — app starts and serves
  `GET /api/lessons/1/vocab` with clean data (`id 1 hebrew = "שלום"`, no `!`),
  confirming the data-side of the bug stays resolved.

**Human confirmation pending:** not yet tested in a real browser. Please verify
TTS across multiple consecutive vocab items (English and Hebrew) and confirm no
utterance reads "Exclamation Point". Stage 3 will mark this `Resolved` after
your confirmation.

## Verification (Stage 3)

- **Confirmed by:** Jarad
- **Confirmation date:** 2026-08-29
- **Outcome:** Resolved — "Testing shows TTS issues are resolved." Verified TTS
  across multiple consecutive vocab items (English and Hebrew) in a real
  browser; no word reads "Exclamation Point".