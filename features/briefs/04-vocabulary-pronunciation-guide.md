# Brief 04 — Vocabulary Pronunciation Guide

## Purpose

Add an English transliteration (pronunciation guide) to each Hebrew vocabulary
word, shown alongside the word while the user studies, so learners can see how to
pronounce the Hebrew term.

## Expected Behavior

1. Each Hebrew vocabulary word has an English transliteration.
2. The transliteration is shown alongside the Hebrew word while the user studies
   (in study mode).
3. The transliteration is provided for every vocabulary item, not just some.
4. The existing English and Hebrew forms shown in study remain; the
   transliteration is shown in addition to them.

## Inputs / Outputs

- **Inputs (user):** opening study mode for a lesson.
- **Outputs (user):** the vocabulary items with their Hebrew word, English form,
  and the English transliteration visible while studying.

## User-Visible Behavior

While studying a lesson, each Hebrew word now shows an accompanying English
transliteration as a pronunciation guide. The existing English/Hebrew content is
unchanged; the transliteration is added alongside the word.

## Constraints

- Every Hebrew vocabulary word has a transliteration shown during study.
- The transliteration is a display aid; it does not replace the English or Hebrew
  forms.
- Do not change quiz/exam content or scoring behavior.
- Do not add unrequested pronunciation features beyond the transliteration.

## Basic Acceptance Expectations

- Every vocabulary item in study mode shows an English transliteration next to the
  Hebrew word.
- The existing English/Hebrew forms still display correctly.
- Quiz/exam behavior is unchanged.
