# Enhancement 01 — English Transliteration for Hebrew Vocabulary

## Purpose

Add an English-script transliteration (pronunciation guide) to each existing
Hebrew vocabulary item, so learners who do not yet read the Hebrew alphabet can
sound out the words while studying.

## Background / Motivation

The proof-of-concept experiment (`proof-of-concept/scripts.js`) already includes
a `tr` (transliteration) field per vocabulary item. The decomposed client/server
build dropped this field — its `vocab` schema and seed data hold only
`english` and `hebrew`. This enhancement restores that capability in the primary
build.

## Expected Behavior

1. Every vocabulary item gains a transliteration field (e.g., `transliteration`
   or `pronunciation`).
2. The value is an English-script rendering of the Hebrew word's pronunciation
   (e.g., Hebrew "שלום" → transliteration "shalom").
3. The transliteration is stored as part of the vocabulary data and served by
   the backend API alongside `english` and `hebrew`.
4. The transliteration is displayed in study mode alongside the English and
   Hebrew forms.
5. Admin can add or edit the transliteration for a vocabulary item.

## Inputs / Outputs

- **Inputs (data):** existing 5 lessons × 10 items (50 items) of English/Hebrew
  vocabulary, which must each be extended with a transliteration.
- **Outputs (user):** vocabulary items that include an English-script
  pronunciation guide, displayed in study mode and available via the API.

## User-Visible Behavior

In study mode, each vocabulary card shows the English word, the Hebrew word,
and an English-script transliteration beneath it. The transliteration is a
static text display; it does not imply audio (see Enhancement 02 for
Text-to-Speech, which is a separate feature).

## Constraints

- Must cover all existing 50 seeded items; admin-added items should also
  support the field.
- Backward compatible: the field should be optional at the data level so older
  records without a transliteration do not break rendering.
- Transliteration is a plain-text pronunciation guide (no phonetic IPA alphabet
  unless we choose to add it).
- Content remains sourced from the backend (consistent with concept item e).

## Basic Acceptance Expectations

- Every seeded vocabulary item has a transliteration.
- `GET /api/lessons/{id}` (and the `/vocab` variant) returns the transliteration.
- Study mode displays the transliteration legibly.
- Admin can add/edit transliteration and the change persists and is re-served.

## Open Questions

- Field naming: `transliteration` vs. `pronunciation` vs. `tr` (POC's name)?
- Should quiz/exam multiple-choice distractors or prompts ever use
  transliteration, or is it display-only for study mode?
- Should transliteration be required or optional for new/admin vocabulary?
- Hebrew transliteration is not standardized — which convention do we follow
  (e.g., the POC's existing values, a consistent scheme)?