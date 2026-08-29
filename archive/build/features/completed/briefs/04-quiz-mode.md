# Brief 04 — Quiz Mode

## Purpose

Let the user test their knowledge of a lesson's vocabulary with immediate
feedback on each answer, as a low-stakes practice mode.

## Expected Behavior

1. For a chosen lesson, the user can enter "quiz" mode.
2. Quiz presents multiple-choice questions built from the lesson's vocabulary.
3. A question shows a prompt (English or Hebrew) and several answer choices,
   one of which is correct.
4. After the user answers, the product immediately tells them whether the
   answer was correct or incorrect and shows the correct answer.
5. The user proceeds question by question through the quiz.
6. Because feedback is immediate, results are not withheld until the end.

## Inputs / Outputs

- **Inputs (user):** selection of one answer choice per question.
- **Outputs (user):** immediate correct/incorrect feedback plus the correct
  answer for each question.

## User-Visible Behavior

The user answers each question and sees immediate feedback (correct or
incorrect) before moving on. Quiz questions use the same vocabulary set as
study and exam for the lesson (see Brief 02).

## Constraints

- Questions must be multiple choice.
- Feedback is immediate, per-question (distinct from exam mode, which defers
  results to the end).
- Questions derive from the selected lesson's 10 vocabulary items.
- Score/attempts, if any, follow the persistence rules in Brief 07.

## Basic Acceptance Expectations

- Every quiz question has multiple choices with exactly one correct answer.
- Each answer produces immediate correct/incorrect feedback showing the right
  answer.
- The user can complete the quiz and leave.