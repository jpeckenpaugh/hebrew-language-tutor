# Summary: Enhancement Intake (Stage 1)

- **Date:** 2026-08-29
- **Author / Executor:** opencode (Stage 1 — Enhancement Intake)
- **Instruction file:** `instructions/enhancements/01-enhancement-intake.md`
- **Scope reference:** `enhancements/scope.md`
- **Commit:** `stage 01: agree sprint 03 scope`

## Work Completed

Agreed the scope of the Sprint 03 enhancement pass by translating the sprint
concept (`enhancements/sprint03.md`) into a concise, non-technical scope
document. Every item (a–m) in the sprint concept was read in full and
categorized as a feature, constraint, or boundary; nothing was dropped.

## Outputs Produced / Modified

- `enhancements/scope.md` — **new** scope document. Categorizes all 13 sprint
  items (a–m): features a–j, constraints k–m, and boundaries on the pass.

## Key Decisions

- Confirmed via Stage Manager resolutions and captured in scope:
  - Emoji picker (item j) is a **bundled, curated frontend list**, not
    open-ended free-entry, per item k simplicity.
  - The five seeded lessons are pinned to specific emojis (Greetings & Basics 👋,
    Numbers & Time 🔢, Family 👨‍👩‍👧, Food & Drink 🍎, Common Verbs ⚡) for
    reproducible seed data.
  - View Transitions (item c) is **frontend-only**; no backend support required.
    Item l's only real backend additions are the `level` and `emoji` lesson
    fields.
  - Auto-Play (item d) operates **within the current lesson only**; it does not
    chain across lessons.
- Backend additions are limited to `lessons.level` and `lessons.emoji`; all
  other items are frontend-only.

## Open Questions & Concerns

- Downstream stages should treat the emoji list as a small, curated frontend set
  and the five emoji back-fill values as fixed seed data.
- Confirm in the architecture stage that the `lessons` schema change (add
  `level` and `emoji`) is additive and does not regress existing fields.
- Otherwise none.

## Status

- [x] Complete
- [ ] Needs review