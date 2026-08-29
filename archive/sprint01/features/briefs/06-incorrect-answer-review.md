# Brief 06 — Incorrect-Answer Review

## Purpose

Let the user, after finishing a quiz or exam, review the questions they answered
incorrectly, with the correct answer shown for each, to support learning from
mistakes.

## Expected Behavior

1. When a user finishes a quiz or exam, the product identifies the questions they
   answered incorrectly.
2. The user can view a review of those incorrect questions.
3. For each incorrect question, the correct answer is shown.
4. The review is available after the quiz/exam is complete.
5. Questions answered correctly are not part of the incorrect review.

## Inputs / Outputs

- **Inputs (user):** completion of a quiz or exam; a request to review incorrect
  answers.
- **Outputs (user):** a list of the incorrectly answered questions with their
  correct answers.

## User-Visible Behavior

After finishing a quiz or exam, the user can see which questions they got wrong,
each with the correct answer displayed. This extends the existing end-of-exam
results (v0.1) to include an itemized review of wrong answers.

## Constraints

- The review includes only incorrectly answered questions from that quiz/exam.
- The correct answer is shown for each incorrect question.
- Quiz mode's immediate per-question feedback (v0.1) is unchanged.
- The review is tied to the signed-in user's attempt (per Briefs 03/07).
- Do not add unrequested review features (e.g., retake, explanations).

## Basic Acceptance Expectations

- After a quiz/exam, incorrect questions are listed with their correct answers.
- Correctly answered questions are not shown in the review.
- Existing quiz/exam results behavior still works.
