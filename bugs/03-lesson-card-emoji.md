# Bug 03 — Lesson card emoji is small and on the same line as the lesson name

## Status

Analyzed.

## Summary

The emojis added to the Lesson Catalog cards are rendered small and on the same
line as the lesson names. They should be larger and appear above the text line,
more like the styling of the Study/Quiz/Exam cards.

## Symptom (reported by user)

1. Open the Lesson Catalog.
2. The emoji on each lesson card is small and sits on the same line as the
   lesson name.
3. Expected: the emoji is larger and appears above the text line (similar to the
   Study/Quiz/Exam card layout).

## Environment

- Web app: English/Hebrew Language Tutor (sprint-03).
- Emoji field added to lessons and shown on Catalog cards in `frontend/`.
- Repro: open the Lesson Catalog.

## Reproduction

- Open the Lesson Catalog and view the lesson cards.
- Observe that the emoji is small and inline with the lesson name, rather than
  larger and above the text.

## Root Cause Analysis

The Catalog card renders the lesson emoji **inline inside the `<h5 class="card-title">`**
element, so it inherits the card-title font size and sits on the same line as the
lesson name. The Study/Quiz/Exam cards use a different layout — a large block icon
on its own line above the label — which is the styling the user wants to match.

Evidence:

- `frontend/js/views.js:148` (`catalog()` card markup) —
  `'<h5 class="card-title mb-0">' + esc(lesson.emoji || '') + ' ' + esc(lesson.title) + '</h5>'`.
  The emoji is concatenated into the same `h5` as the title, so it is rendered at
  `h5` (small) size on the same line.
- Compare `frontend/js/views.js:207` (`lessonHub()` Study/Quiz/Exam mode card) —
  `'<div class="display-6 mb-2">' + mode.icon + '</div>'` followed by
  `'<h5>' + mode.label + '</h5>'` (views.js:208). Here the icon is rendered as a
  large `display-6` block on its own line **above** the label. This is the layout
  the user expects for the Catalog cards.

The emoji itself is correctly stored and served (`backend/app/routers/catalog.py`,
confirmed via `GET /api/lessons` returning `emoji` for each lesson); only its
rendering in the Catalog card is wrong.

## Proposed Fix

Restructure the Catalog card markup in `catalog()` (`frontend/js/views.js:144-156`)
so the emoji is rendered as a larger block on its own line above the lesson title,
mirroring the Study/Quiz/Exam card layout at `frontend/js/views.js:207-208`. For
example, replace the single `h5` that mixes emoji+title with a `display-6` (or
similarly large) emoji block followed by the `<h5>` title. Keep the `Level` badge
and the item count as they are.

Files to change: `frontend/js/views.js` (`catalog()`, ~lines 144-156); optionally
`frontend/css/style.css` for any sizing/tuning.