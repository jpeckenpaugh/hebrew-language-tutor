# Bug 01 — TTS works once then fails; Hebrew word reads "Exclamation Point"

## Status

Open.

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