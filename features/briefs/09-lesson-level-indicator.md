# Brief 09 — Lesson Level Indicator

## Purpose

Let lessons carry a difficulty level (1–5) that is displayed in the Catalog and
on the Lesson screen and can be set by the Admin area, with no gating or
unlocking.

## Expected Behavior

1. Each lesson has a `level` field taking values 1–5, where higher numbers mean
   more difficult lessons.
2. The five seeded lessons are all assigned Level 1.
3. The Level is shown on the Catalog lesson cards (e.g. a "Level N" badge).
4. The Level is shown on the Lesson screen (e.g. a "Level N" badge).
5. The Admin area can set the Level (1–5, default 1) when adding or editing a
   lesson.
6. The Level is exposed through the lessons API and accepted when creating or
   updating a lesson.
7. No lesson gating or unlocking is added.

## Inputs / Outputs

- **Inputs (user):** a Level value (1–5) set in the Admin area when adding or
  editing a lesson.
- **Outputs (user):** a "Level N" indicator on the Catalog lesson cards and the
  Lesson screen; the Level served through the lessons API.

## User-Visible Behavior

The user sees a Level on each Catalog lesson card and on the Lesson screen.
Admin sees a Level field (defaulting to 1) when adding or editing a lesson.
The level is display-only; lessons are not gated or unlocked by level.

## Constraints

- Includes the backend addition of the `level` field on lessons (seed data and
  API exposure/acceptance), per scope constraint l.
- Level is display-only; no gating/unlocking logic (per scope boundary).
- The five seeded lessons are assigned Level 1.
- Valid values are 1–5, default 1.
- Do not regress existing lesson/catalog behavior.

## Basic Acceptance Expectations

- Lessons report a Level 1–5, with the five seeded lessons at Level 1.
- "Level N" appears on Catalog cards and the Lesson screen.
- Admin can set the Level (1–5, default 1) when adding/editing a lesson.
- The lessons API exposes and accepts the Level; no unlocking occurs.