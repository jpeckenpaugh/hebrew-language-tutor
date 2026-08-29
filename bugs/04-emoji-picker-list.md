# Bug 04 — Emoji picker has only a short list and no search filter

## Status

Approved.

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

## Root Cause Analysis

The emoji picker is a plain HTML `<select>` populated from a small hardcoded
constant, so it offers only that fixed, short list with no search/filter UI.
Native `<select>` elements provide no name-search or filter capability.

Evidence:

- `frontend/js/views.js:28` — `CURATED_EMOJIS = ['👋', '🔢', '👨‍👩‍👧', '🍎', '⚡', '📘', '🎯', '✈️', '🌍', '🕐', '🏠', '🍞']`
  — a hardcoded list of only **12** emojis.
- `frontend/js/views.js:36-40` — `emojiOptions(selected)` maps `CURATED_EMOJIS`
  to a single `<option>` per emoji, for use inside a `<select>`.
- The picker is a `<select>` in the Admin "Add New Lesson" form
  (`frontend/js/views.js:666`, `#newLessonEmoji`) and in each lesson's edit row
  (`frontend/js/views.js:687`, `lesson-emoji-select`). A native `<select>` offers
  no search-by-name filter.

## Proposed Fix

Replace the native `<select>` emoji pickers with a searchable picker, and greatly
expand the curated emoji set:

- Expand `CURATED_EMOJIS` (`frontend/js/views.js:28`) to a much longer curated
  list, associating each emoji with a name so filtering is possible. No external
  dataset is prescribed; curation is at the implementer's discretion.
- Replace `emojiOptions()` (`frontend/js/views.js:36-40`) and the two `<select>`
  pickers (`frontend/js/views.js:666`, `frontend/js/views.js:687`) with a picker
  widget that provides a **search/filter input by name** plus a clickable emoji
  grid to select one (storing the chosen emoji string, as the backend already
  stores a single emoji per lesson — `backend/app/routers/admin.py:50,80`).
- Add any needed styling for the picker grid to `frontend/css/style.css`.

Files to change: `frontend/js/views.js` (`CURATED_EMOJIS`, `emojiOptions()`,
`adminPanel()` pickers), optionally `frontend/css/style.css`. Frontend-only; no
backend change required.