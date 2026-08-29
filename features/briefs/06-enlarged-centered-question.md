# Brief 06 — Enlarged Centered Question

## Purpose

Improve readability of the Quiz/Exam question and options by making the prompt
larger and centered, and the Hebrew answer options much larger.

## Expected Behavior

1. In both Quiz and Exam modes, the prompt "What is the Hebrew for: …?" is
   replaced by the English word alone.
2. The English word is centered on the page and enlarged to about 3× its current
   size.
3. The Hebrew answer options are enlarged to about 3× their current size for
   readability.
4. This applies to both Quiz and Exam modes.

## Inputs / Outputs

- **Inputs (user):** none (a presentation change to existing Quiz/Exam content).
- **Outputs (user):** a centered, enlarged English question word and enlarged
  Hebrew answer options.

## User-Visible Behavior

In Quiz and Exam, the user sees the English word alone (not wrapped in the
question sentence), centered and noticeably larger, with Hebrew answer options
similarly enlarged. All existing quiz/exam behavior (scoring, feedback timing,
results) is unchanged.

## Constraints

- Applies to both Quiz and Exam modes.
- Enlargement is approximate ("about 3×"); exact size may be tuned for layout.
- Do not change the vocabulary content, question wording source, or mode
  behavior — only the presentation of the prompt and options.

## Basic Acceptance Expectations

- Quiz and Exam show the English word alone, centered and enlarged.
- Hebrew answer options are visibly enlarged.
- Existing quiz/exam behavior is otherwise unchanged.