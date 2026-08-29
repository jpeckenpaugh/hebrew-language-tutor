# Brief 03 — Learn / Study Mode

## Purpose

Let the user learn a lesson's vocabulary by presenting each English/Hebrew
item for study before or alongside testing.

## Expected Behavior

1. For a chosen lesson, the user can enter "study" mode.
2. Study mode presents the lesson's 10 vocabulary items (English with its
   Hebrew translation) one at a time or in a browseable list.
3. The user can move forward/backward through the items and read each
   word/translation pair.
4. Study mode is for reading/learning; it does not score or test the user.
5. When finished, the user can navigate to quiz or exam mode for the same
   lesson (see Brief 08).

## Inputs / Outputs

- **Inputs (user):** a lesson selection and the intention to study it.
- **Outputs (user):** the lesson's 10 vocabulary items shown as
  English/Hebrew pairs.

## User-Visible Behavior

The user sees the lesson's vocabulary displayed for study and can page through
the items. No answer entry, scoring, or feedback occurs here.

## Constraints

- Only the vocabulary belonging to the selected lesson is shown.
- Study mode performs no scoring or persistence of results.
- No additional learning aids (e.g., audio, flashcards games) beyond displaying
  the vocabulary, unless stated upstream.

## Basic Acceptance Expectations

- Study mode shows all 10 items for the selected lesson.
- Each item shows both English and Hebrew.
- The user can step through items and exit to another mode.