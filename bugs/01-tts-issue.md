# Bug 01 — TTS works once then fails; Hebrew word reads "Exclamation Point"

## Status

Open — awaiting approval to fix.

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

## Root cause analysis

The TTS logic lives in one place: the `speak()` function in
`frontend/js/views.js`. Two independent bugs cause the two symptoms.

### (a) TTS works once, then silently fails for all subsequent words

`speak()` calls `window.speechSynthesis.cancel()` and then `speak()` in the
**same synchronous tick**:

- `frontend/js/views.js:193` — `window.speechSynthesis.cancel();`
- `frontend/js/views.js:194-196` — creates the utterance and calls
  `window.speechSynthesis.speak(utter)`.

This triggers a well-documented Chrome/Web Speech API bug: calling `cancel()`
followed by `speak()` back-to-back (especially when `cancel()` interrupts an
in-progress utterance) leaves the synthesis engine in a "stuck" state where
subsequent `speak()` calls are silently dropped (`onstart` never fires, no audio
is produced).

This matches the reported flow:

- English #1: `cancel()` on an empty queue is harmless → works.
- Hebrew #1: `cancel()` interrupts the still-playing English → speaks → works.
- Any word after that: `cancel()` leaves the engine stuck → all later `speak()`
  calls silently produce nothing.

The failure is silent because there are **no `onstart` / `onend` / `onerror`
handlers** and no queue management.

### (b) Hebrew word speaks only "Exclamation Point"

Two compounding causes:

1. **The trailing `!` is in the data.** The live database `vocab` table, id 1,
   contains `שלום!` (with a trailing exclamation mark). The seed file is clean:
   - `backend/app/seed.py:5` — `("hello", "שלום", "shalom")` (no `!`).
   - Live DB — `1|hello|שלום!|shalom` (has the `!`).
   The catalog router serves the DB row verbatim
   (`backend/app/routers/catalog.py:34-45`), and the frontend passes
   `item.hebrew` verbatim into the utterance
   (`frontend/js/views.js:202`, `:215`). So the spoken string is literally
   `שלום!`.

2. **No explicit voice selection.** The code only sets `utter.lang = 'he-IL'`
   (`frontend/js/views.js:195`) and never uses `getVoices()` or `utter.voice`
   (no matches in the codebase). In Chrome/Edge, setting `lang` does not
   reliably select a Hebrew voice; the browser often falls back to the default
   (English) voice. An English voice reading `שלום!` skips the Hebrew glyphs it
   cannot pronounce and reads the `!` aloud as "Exclamation Point" — exactly the
   reported symptom.

## Evidence / file references

- `frontend/js/views.js:191-197` — the `speak()` function (cancel-then-speak;
  no handlers; no voice selection).
- `frontend/js/views.js:209-216` — TTS buttons pass raw vocab strings verbatim.
- `frontend/js/views.js:202`, `:215` — Hebrew string used unsanitized.
- `backend/app/routers/catalog.py:34-45` — serves vocab DB rows verbatim.
- `backend/app/seed.py:5` — seed data is clean (no `!`).
- Live database `vocab` id 1 — contains trailing `שלום!`.

## Proposed fix

### In `frontend/js/views.js` (`speak()`)

1. **Stop `cancel()`-then-`speak()` from killing itself.** Do not call
   `cancel()` synchronously right before `speak()`; defer the new utterance so
   the engine settles:
   ```js
   function speak(text, lang) {
     if (!('speechSynthesis' in window)) return;
     window.speechSynthesis.cancel();
     window.setTimeout(() => {
       const utter = new SpeechSynthesisUtterance(text);
       utter.lang = lang;
       const voice = pickVoice(lang);
       if (voice) utter.voice = voice;
       utter.onerror = () => {};
       window.speechSynthesis.speak(utter);
     }, 50);
   }
   ```
   Better still, manage the queue via `onend` and only call `cancel()` when
   strictly necessary.

2. **Strip trailing punctuation before speaking** (defensive; the data also
   needs cleaning):
   ```js
   const clean = text.replace(/[!?.,;:'"()]+$/g, '').trim();
   ```

3. **Select a Hebrew voice explicitly** via `getVoices()` + `utter.voice`, with
   `onvoiceschanged` (or lazy re-query), since voices load asynchronously:
   ```js
   const voices = window.speechSynthesis.getVoices();
   const pick = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith(lang.slice(0, 2)));
   if (pick) utter.voice = pick;
   ```

### Data cleanup

- Correct the live database: change `שלום!` → `שלום` for `vocab` id 1.
- Ensure `backend/app/seed.py:5` stays clean (it already is).

## Follow-up

After applying the fix, re-test Lesson 1 / Vocab 1: confirm TTS continues to work
across multiple words in sequence for both English and Hebrew, and that the
Hebrew pronunciation speaks "Shalom" (not "Exclamation Point").