# Feature: Lesson Level Indicator

- **Sprint:** 03
- **Scope item:** i.)
- **Status:** capability definition

## Capability

Each lesson carries a `level` field taking values 1–5, where higher numbers mean
more difficult lessons. The Level is shown on the Catalog lesson cards and on
the Lesson screen (e.g. a "Level N" badge). The Admin area can set the Level
(1–5, default 1) when adding or editing a lesson. The Level is exposed through
the lessons API. No lesson gating or unlocking is added.

## Scope Notes

- This feature includes the single backend addition of the `level` field on
  lessons (seed data and API exposure/acceptance), per scope constraint l.
- Level is display-only; no lesson gating or unlocking is added (constraint i. /
  boundary).
- The five seeded lessons are all assigned Level 1 (boundary).