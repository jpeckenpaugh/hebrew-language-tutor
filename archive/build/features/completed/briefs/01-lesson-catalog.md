# Brief 01 — Lesson Catalog

## Purpose

Give the user a browsable set of language lessons so they can pick what to
study. The product must provide exactly 5 basic lessons, each with 10
vocabulary items.

## Expected Behavior

1. The product exposes a catalog of 5 lessons.
2. Each lesson has a name/title and is identified uniquely so it can be
   selected, opened, and referenced by other modes.
3. The catalog is presented as a list or grid the user can browse.
4. Each lesson in the catalog is associated with exactly 10 vocabulary items
   (see Brief 02).
5. Selecting a lesson takes the user to that lesson's available modes
   (study, quiz, exam).

## Inputs / Outputs

- **Inputs (user):** a selection of one of the 5 lessons.
- **Outputs (user):** the 5-lesson catalog and, after selection, the chosen
  lesson's modes.

## User-Visible Behavior

The user sees 5 lessons on a catalog screen and can click any one to open it.
The list of lessons comes from the backend (see Brief 09); the user does not
edit the catalog here.

## Constraints

- Exactly 5 lessons exist.
- Every lesson has exactly 10 vocabulary items.
- Only the 3 modes (study, quiz, exam) are offered per lesson; no additional
  modes.
- Keep the feature simple; do not add unrequested capabilities.

## Basic Acceptance Expectations

- The catalog shows 5 distinct lessons.
- Each lesson can be selected and opens its modes.
- Each lesson reports exactly 10 vocabulary items.