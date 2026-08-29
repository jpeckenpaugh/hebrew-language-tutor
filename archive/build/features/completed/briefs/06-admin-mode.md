# Brief 06 — Admin Mode

## Purpose

Let an authorized user manage the product's lessons and vocabulary: modify
existing lessons/vocabulary and add new lessons and vocabulary.

## Expected Behavior

1. The product offers an "admin" area.
2. To use admin features, the user must sign in (authenticate).
3. After signing in, the user can view existing lessons and their vocabulary.
4. The user can modify existing lessons and existing vocabulary items
   (e.g., edit English/Hebrew text or lesson title).
5. The user can add new lessons and add new vocabulary items to lessons.
6. Changes are saved and reflected in the data served by the backend (see
   Brief 09), so study/quiz/exam and the catalog reflect updates.

## Inputs / Outputs

- **Inputs (user):** credentials to sign in; edits and additions to lessons
  and vocabulary.
- **Outputs (user):** confirmation that lessons/vocabulary were saved and the
  updated catalog/content.

## User-Visible Behavior

The user signs into an admin area, sees the existing lessons/vocabulary, edits
or adds entries, and saves. After saving, the updated data is visible in the
catalog and modes.

## Constraints

- Admin actions require sign-in; the product must not let an unauthenticated
  user modify data.
- Scope is limited to modifying existing and adding new lessons/vocabulary;
  deletion or other admin functions are not requested and must not be added.
- Any new lesson should still carry exactly 10 vocabulary items per lesson
  (consistent with Brief 01/02) unless the constraint is relaxed upstream.
- Data persists via the backend (see Briefs 07 and 09).

## Basic Acceptance Expectations

- Admin features are inaccessible without signing in.
- A signed-in user can edit an existing lesson/vocab and add a new
  lesson/vocab.
- Changes appear in the catalog and in the lesson's modes after saving.