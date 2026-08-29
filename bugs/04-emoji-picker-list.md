# Bug 04 — Emoji picker has only a short list and no search filter

## Status

Open.

## Summary

When adding a new lesson in the Admin area, the emoji picker offers only a very
short list of emojis. It needs a much longer list of emojis, with a search
filter by name.

## Symptom (reported by user)

1. Go to the Admin area and add (or edit) a lesson.
2. Open the emoji picker.
3. Only a short list of emojis is available, and there is no way to search/filter
   by name.
4. Expected: a much longer list of emojis with a search filter by name.

## Environment

- Web app: English/Hebrew Language Tutor (sprint-03).
- Emoji picker added to the Admin lesson add/edit UI in `frontend/`.
- Repro: Admin area → add/edit a lesson → open the emoji picker.

## Reproduction

- In the Admin area, add a new lesson and open the emoji picker.
- Observe the short, fixed emoji list with no search/filter capability.