# Brief 04 — Study Auto-Play

## Purpose

Let the user listen to a lesson hands-free, item by item, within the current
lesson only.

## Expected Behavior

1. The Study screen shows a green "play" control at the top right.
2. Pressing play starts playback of the current vocabulary item: it speaks the
   current English term, pauses roughly two seconds, speaks the Hebrew term,
   pauses roughly four seconds, then advances to the next item and repeats.
3. Playback continues until the end of the current lesson, then stops.
4. While playing, the control becomes a stop control; pressing it halts
   playback.
5. In browsers without speech support, playback advances on the same 2s/4s
   timing without audio (the pauses still govern item-advance timing).
6. If the user manually navigates (e.g. pages to another item) during playback,
   playback resyncs to the currently displayed item before continuing.
7. If the user leaves the Study lesson, playback stops.

## Inputs / Outputs

- **Inputs (user):** pressing the play/stop control; optionally manual
  navigation within the lesson.
- **Outputs (user):** audible English/Hebrew for each item (where supported) and
  automatic advance to the next item; audio-free timed advance where unsupported.

## User-Visible Behavior

The user presses a green play button and the lesson plays item by item with a
roughly 2s/4s rhythm, advancing on its own. The control toggles to stop while
playing. Manual navigation resyncs playback to the shown item; leaving the
lesson stops it.

## Constraints

- Operates within the current lesson only; it does not chain across lessons.
- A single control toggles between play and stop states.
- Timing is approximate ("roughly" 2s/4s); exact duration may vary by speech
  synthesis latency.
- Do not change Study's existing item display, scoring, or navigation behavior
  beyond adding the control and playback.

## Basic Acceptance Expectations

- A green play control appears at the top right of Study.
- Playback speaks English then Hebrew per item, advances automatically, and
  stops at the lesson's end.
- The control toggles to stop and halts playback when pressed again.
- On no-speech browsers, items advance on the same 2s/4s timing without audio.
- Manual navigation resyncs playback; leaving the lesson stops it.