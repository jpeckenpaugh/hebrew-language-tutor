# Brief 04 — Larger Terms Text

## Purpose

Improve readability by displaying the English and Hebrew term text notably
larger and more readable on the Study, Quiz, and Exam screens (Sprint 01
feature 03 Learn/Study, and v0.1 Quiz/Exam modes). This is a visual change to
existing screens; no content or behavior changes.

## Expected Behavior

1. On the Study screen, each vocabulary item's English and Hebrew text is shown
   larger than it is today.
2. On the Quiz and Exam screens, the term text is likewise shown larger.
3. The concrete size is not fixed here; it is chosen during implementation to be
   clearly larger and more readable than the current size.
4. Layout must remain usable and consistent — larger text should not break or
   crowd the existing screens.

## Inputs / Outputs

- **Inputs (user):** viewing the existing Study, Quiz, or Exam screens.
- **Outputs (user):** the same content displayed with larger, more readable term
  text.

## User-Visible Behavior

On Study, Quiz, and Exam screens the English and Hebrew terms appear noticeably
larger and easier to read than before. All other elements and behavior remain
the same.

## Constraints

- Only the term text on Study, Quiz, and Exam is enlarged; do not alter content,
  scoring, or behavior of these modes.
- Do not regress existing behavior on these screens.
- The final size is an implementation choice, but it must be a clear readability
  improvement.

## Basic Acceptance Expectations

- The English/Hebrew term text on Study, Quiz, and Exam screens is visibly
  larger and more readable than in the current build.
- No content, scoring, or other behavior on those screens changes.