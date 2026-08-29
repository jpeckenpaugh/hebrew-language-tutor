# Feature: Lesson Emoji

- **Sprint:** 03
- **Scope item:** j.)
- **Status:** capability definition

## Capability

Each lesson carries an `emoji` field, a single emoji used to illustrate the
lesson. The emoji is shown on the Catalog lesson cards. In the Admin area the
user can pick an emoji for a lesson from a bundled, curated emoji list (a small
local set in the frontend), so the emoji need not be typed by hand. The emoji is
exposed through the lessons API and accepted when creating or updating a lesson.

## Scope Notes

- This feature includes the single backend addition of the `emoji` field on
  lessons (seed data and API exposure/acceptance), per scope constraint l.
- The emoji picker is a small bundled frontend set, not an open-ended search
  (constraint k).
- The five seeded lessons are back-filled with these specific emojis, matched to
  the seeded lesson names, to keep seed data reproducible (boundary):
  - **Greetings & Basics** — 👋 (waving hand)
  - **Numbers & Time** — 🔢 (numbers)
  - **Family** — 👨‍👩‍👧 (family)
  - **Food & Drink** — 🍎 (apple)
  - **Common Verbs** — ⚡ (high voltage / action)