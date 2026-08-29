# Bug 02 — Page transitions do not fade; screens glitch on load

## Status

Open.

## Summary

The recently-added page-to-page cross-fade transitions do not work. Navigating
between screens shows no smooth fade — pages "just sort of load then glitch a
bit", with no smooth transition.

## Symptom (reported by user)

1. Navigate between screens in the app (e.g. Catalog to a Lesson, or between
   study/quiz/exam screens).
2. Instead of a smooth cross-fade, the page appears to load abruptly and glitch,
   with no pleasant transition effect.

## Environment

- Web app: English/Hebrew Language Tutor (sprint-03).
- Transitions implemented with the View Transitions API (`document.startViewTransition`)
  in `frontend/js/app.js`.
- Repro: navigate between any screens.

## Reproduction

- Open the app and move between two screens (e.g. Catalog → Lesson, or
  Study/Quiz/Exam).
- Observe that no smooth fade occurs; the page loads with a glitch rather than
  a cross-fade.