# Enhancement 02 — Text-to-Speech for English and Hebrew Terms

## Purpose

Add simple Text-to-Speech (TTS) so the user can hear the pronunciation of both
the English and Hebrew forms of vocabulary items, reinforcing study.

## Background / Motivation

The current app displays vocabulary as text only. Hearing pronunciation — in
particular for Hebrew, whose writing system is unfamiliar to many learners —
would meaningfully improve the study experience. This is a simple, low-cost
addition and complements Enhancement 01 (transliteration), which is a visual
pronunciation guide.

## Expected Behavior

1. In study mode, each vocabulary item offers a "listen" control (e.g., a
   speaker button) for the English term and a separate control for the Hebrew
   term.
2. Activating the control plays the spoken pronunciation of that term using a
   Text-to-Speech engine.
3. The feature works for the terms served by the backend; it does not require
   audio files to be stored or managed.
4. The controls are unobtrusive and do not disrupt the existing study/quiz/exam
   flows.

## Inputs / Outputs

- **Inputs (user):** a click/tap on the listen control for a term.
- **Outputs (user):** audible pronunciation of the selected English or Hebrew
  term.

## User-Visible Behavior

In study mode, each vocabulary card shows the English word and Hebrew word with
a small speaker button next to each. Clicking it speaks the word. The user can
hear either language for any item.

## Constraints

- **Keep it simple** (concept item a): a lightweight, browser- or
  Web-API-based TTS solution is preferred over managing/ hosting audio assets.
- No server-side audio generation is required initially; client-side
  speech synthesis is the simplest path.
- Must not add significant latency or block the existing UI.
- Must work for both Latin-script English and Hebrew-script Hebrew (i.e., the
  speech engine must be configured with the correct language code per term).

## Basic Acceptance Expectations

- Each vocabulary item exposes a Hebrew listen control and an English listen
  control in study mode.
- Clicking a control produces audible speech of the correct term in the correct
  language.
- The controls work for all 50 seeded items and for admin-added items.
- The feature does not interfere with quiz/exam modes or navigation.

## Open Questions

- **Mechanism:** browser-native `speechSynthesis` API (zero assets, simplest)
  vs. a hosted TTS service (higher quality, needs network/keys)? The constraint
  above leans toward browser-native.
- Language selection: how do we tag each term's language (English vs. Hebrew)
  so the speech engine uses the right voice — derived from the field, or an
  explicit attribute?
- Should TTS appear only in study mode, or also (optionally) in quiz/exam?
- Browser support and voice availability differ; what is the fallback if
  `speechSynthesis` is unavailable or a Hebrew voice is missing?