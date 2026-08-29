# Brief 05 — Text-to-Speech

## Purpose

Let the user hear the English and Hebrew forms of a vocabulary item spoken aloud
while studying, supporting pronunciation.

## Expected Behavior

1. While studying a vocabulary item, the user can trigger audio.
2. The product speaks the English form of the item aloud.
3. The product speaks the Hebrew form of the item aloud.
4. The user can hear the terms during study mode; audio is not required in quiz or
   exam modes.

## Inputs / Outputs

- **Inputs (user):** a request to hear a vocabulary item's audio while studying.
- **Outputs (user):** spoken audio of the English and Hebrew forms.

## User-Visible Behavior

In study mode, the user can play audio to hear how an item's English and Hebrew
forms sound. This is new relative to v0.1, which had no audio.

## Constraints

- Audio is limited to the English and Hebrew forms of vocabulary items.
- Audio is offered while studying; it must not interfere with quiz/exam behavior.
- Do not add unrequested audio features (e.g., speed controls, multiple voices).

## Basic Acceptance Expectations

- The user can play audio for an item's English and Hebrew forms in study mode.
- Audio playback does not alter scoring or other modes.
