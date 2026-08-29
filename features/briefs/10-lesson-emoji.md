# Brief 10 — Lesson Emoji

## Purpose

Give each lesson a single visual emoji shown on the Catalog lesson cards, chosen
by the Admin from a small bundled curated set.

## Expected Behavior

1. Each lesson has an `emoji` field, a single emoji used to illustrate the
   lesson.
2. The emoji is shown on the Catalog lesson cards only (not on the Lesson
   screen).
3. In the Admin area, the user picks an emoji for a lesson from a bundled,
   curated emoji list (a small local set in the frontend), so the emoji need not
   be typed by hand.
4. The emoji is exposed through the lessons API and accepted when creating or
   updating a lesson.
5. The five seeded lessons are back-filled with these specific emojis, matched
   to the seeded lesson names:
   - **Greetings & Basics** — 👋 (waving hand)
   - **Numbers & Time** — 🔢 (numbers)
   - **Family** — 👨‍👩‍👧 (family)
   - **Food & Drink** — 🍎 (apple)
   - **Common Verbs** — ⚡ (high voltage / action)

## Inputs / Outputs

- **Inputs (user):** an emoji selection made in the Admin area when adding or
  editing a lesson.
- **Outputs (user):** the selected emoji on the corresponding Catalog lesson
  card; the emoji served through the lessons API.

## User-Visible Behavior

The user sees a single emoji on each Catalog lesson card. In Admin, when adding
or editing a lesson, the user picks an emoji from a small curated list rather
than typing it. The chosen emoji appears on the catalog card after saving.

## Constraints

- Includes the backend addition of the `emoji` field on lessons (seed data and
  API exposure/acceptance), per scope constraint l.
- The emoji picker is a small bundled frontend set, not an open-ended search
  (constraint k).
- Emoji is shown on Catalog cards only; do not expand to the Lesson screen.
- The five seeded lessons are back-filled with the specific emojis listed above
  to keep seed data reproducible.
- Do not regress existing lesson/catalog/admin behavior.

## Basic Acceptance Expectations

- Each lesson reports an `emoji` via the lessons API.
- The emoji appears on each Catalog lesson card.
- The five seeded lessons show the specific emojis listed above.
- Admin can pick an emoji from a bundled curated list when adding/editing a
  lesson, and the saved emoji appears on the catalog card.