# Brief 05 — Exam Mode

## Purpose

Let the user take a formal, multiple-choice exam on a lesson's vocabulary
where results are revealed only at the end, rather than after each question.

## Expected Behavior

1. For a chosen lesson, the user can enter "exam" mode.
2. Exam presents multiple-choice questions built from the lesson's vocabulary.
3. The user answers each question; no correctness feedback is shown during the
   exam.
4. The user cannot see the result of a question until the exam is complete.
5. At the end of the exam, the product shows the results (e.g., score and/or
   which answers were correct).

## Inputs / Outputs

- **Inputs (user):** selection of one answer choice per exam question, then
  submission/end of the exam.
- **Outputs (user):** the exam results shown at the end of the exam.

## User-Visible Behavior

The user works through questions without per-question feedback, then sees the
overall results when the exam ends. Exam questions use the same vocabulary set
as study and quiz for the lesson (see Brief 02).

## Constraints

- Questions must be multiple choice.
- Results are shown at the end, not per-question (distinct from quiz mode).
- Questions derive from the selected lesson's 10 vocabulary items.
- Score/attempts, if any, follow the persistence rules in Brief 07.

## Basic Acceptance Expectations

- Every exam question has multiple choices with exactly one correct answer.
- No correctness feedback appears before the exam ends.
- Results are displayed when the exam is complete.