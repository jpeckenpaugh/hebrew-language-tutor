# Brief 02 — Vocabulary Data

## Purpose

Define the source vocabulary content the learning, quiz, and exam modes draw
from. The product manages vocabulary for each lesson so all modes use the same
consistent word set.

## Expected Behavior

1. Each lesson owns exactly 10 vocabulary items.
2. Each vocabulary item pairs an English word with its Hebrew translation.
3. Vocabulary items belong to exactly one lesson.
4. The same vocabulary set is the source for study, quiz, and exam modes of
   that lesson (they must not diverge).
5. Vocabulary items are identifiable so they can be referenced by quiz/exam
   questions and updated by admin (see Brief 06).

## Inputs / Outputs

- **Inputs (user):** the vocabulary content as seeded data (5 lessons × 10
  items = 50 items total).
- **Outputs (user):** the list of English/Hebrew vocabulary items for the
  selected lesson, served via the backend API (see Brief 09).

## User-Visible Behavior

The user encounters the vocabulary as flashcards/items in study mode and as
answer content in quiz and exam modes. The exact same items appear in all
three modes for a lesson.

## Constraints

- 10 items per lesson; 5 lessons.
- Each item has both an English and a Hebrew form.
- Content is sourced from the backend (see Brief 09); not hard-coded in the
  frontend.
- No item types beyond basic English/Hebrew vocabulary.

## Basic Acceptance Expectations

- Every lesson shows 10 distinct vocabulary items.
- Each item has an English word and a Hebrew translation.
- Study, quiz, and exam for a lesson use the identical word set.