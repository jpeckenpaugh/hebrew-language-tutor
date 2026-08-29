# Bug 03 — Lesson card emoji is small and on the same line as the lesson name

## Status

Open.

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