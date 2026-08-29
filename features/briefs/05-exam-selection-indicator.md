# Brief 05 — Exam Selection Indicator

## Purpose

Give Exam mode a visible selection indicator so the user can see their chosen
answer was accepted, without revealing correctness (unlike Quiz mode).

## Expected Behavior

1. In Exam mode, when the user selects an answer, the chosen option is shown
   with a neutral style (e.g. grey/highlighted) so the selection is visible.
2. The user may re-select during the exam; the neutral style follows the latest
   chosen option. Locking the selection is not required.
3. The indicator must not reveal whether the selected answer is correct or
   incorrect (results remain hidden until the exam ends, per Brief 05 of the
   existing build).

## Inputs / Outputs

- **Inputs (user):** selection of one answer option (possibly changed later).
- **Outputs (user):** a neutral visual indicator on the currently selected
  option.

## User-Visible Behavior

The user clicks an answer and sees it highlighted in a neutral way. If they
click another option, the highlight moves to the new selection. No correctness
is shown.

## Constraints

- The indicator is neutral; it must not reveal correct/incorrect status.
- Results are still shown only at the end of the exam.
- Do not change Exam's deferred-results behavior or its vocabulary source.

## Basic Acceptance Expectations

- Selecting an answer visibly marks it with a neutral style.
- Re-selecting moves the indicator to the latest option.
- No correctness feedback appears before the exam ends.