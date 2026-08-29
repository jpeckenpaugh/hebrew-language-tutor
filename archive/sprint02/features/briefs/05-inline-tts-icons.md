# Brief 05 — Inline TTS Icons

## Purpose

Keep text-to-speech available in Study cards (Sprint 01 Brief 05, Text-to-Speech)
but present it more lightly, as small speaker icons placed next to the English
and Hebrew terms rather than as buttons sitting on their own line. This is a
presentation change to the existing Study card layout.

## Expected Behavior

1. In Study cards, the TTS affordance for each vocabulary item remains available.
2. The English term has a small speaker icon placed next to it; the Hebrew term
   has a small speaker icon placed next to it.
3. Selecting an icon triggers spoken audio for that term (English icon speaks
   the English form; Hebrew icon speaks the Hebrew form).
4. The former separate TTS buttons on their own line are removed and replaced by
   these inline icons.

## Inputs / Outputs

- **Inputs (user):** clicking the speaker icon beside the English or Hebrew term
  in a Study card.
- **Outputs (user):** spoken audio of that term.

## User-Visible Behavior

In Study mode, each term has a small inline speaker icon beside it instead of
full-width TTS buttons on their own line. Clicking an icon plays the spoken form
of the term. The rest of the Study experience is unchanged.

## Constraints

- TTS remains limited to the English and Hebrew forms of vocabulary items
  (consistent with Sprint 01 Brief 05).
- Audio is offered while studying; it must not interfere with quiz/exam behavior.
- The change is limited to how the TTS control is presented (icons vs. buttons);
  do not add unrequested audio features (e.g., speed controls, multiple voices).

## Basic Acceptance Expectations

- A small speaker icon appears next to each English and Hebrew term in Study
  cards.
- Clicking each icon plays the correct spoken term.
- The old separate-line TTS buttons are gone from Study cards.