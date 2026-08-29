# Sprint 03 — Agreed Scope

This document records the agreed scope for the Sprint 03 enhancement pass,
drawn from `enhancements/sprint03.md`. It is a mixed frontend-focused pass with
one small backend addition, extending the existing English/Hebrew Tutor (v0.1 +
Sprint 01 + Sprint 02 build). Every item in the sprint concept is categorized
below as a **feature**, a **constraint**, or a **boundary**; nothing is dropped.

Each item is listed by its letter from the sprint concept file, with its
high-level intent stated in plain, non-technical language.

## Features

- **a.) Fix Catalog breadcrumb navigation.** On the Lesson screen, and the Study
  and results screens, the "Catalog" breadcrumb and the results screen's "All
  Lessons" button must return to the Lesson Catalog. Intent: repair broken
  navigation so every dynamically-rendered link works after the page renders,
  covering the breadcrumb, the Study view's Catalog link, and the results
  screen's "All Lessons" button.

- **b.) Remove the app footer.** Delete the footer text "English / Hebrew
  Language Tutor — state served by the backend API" so the page ends after the
  main content. Intent: clean up the page by removing the footer line.

- **c.) Page transitions.** Add a smooth cross-fade when navigating between
  screens, degrading gracefully to the current instant swap on browsers without
  support. Intent: polish the feel of navigation with a gentle transition where
  the browser supports it, without breaking browsers that do not.

- **d.) Study Auto-Play.** Add a green "play" button at the top right of the
  Study screen. Pressing it speaks the current English term, pauses roughly two
  seconds, speaks the Hebrew term, pauses roughly four seconds, then advances to
  the next vocabulary item and repeats. Playback stops at the end of the current
  lesson; pressing the control again (now a stop control) halts playback. In
  browsers without speech support, playback advances on the same timing without
  audio. Intent: let the user listen to a lesson hands-free, item by item,
  within the current lesson only.

- **e.) Exam selection indicator.** In Exam mode, after selecting an answer,
  show a neutral (e.g. grey/highlighted) style on the chosen option so the user
  can see their selection was accepted. Intent: give Exam a visible selection
  indicator without revealing correctness (unlike Quiz mode).

- **f.) Centered, enlarged Quiz/Exam question.** Replace the Quiz/Exam prompt
  "What is the Hebrew for: "…"?" with the English word alone, centered on the
  page, enlarged to about 3× its current size; enlarge the Hebrew answer options
  to about 3× their current size for readability. Intent: improve readability of
  the question and options by making them much larger and centered.

- **g.) Rename the Admin button.** On the Title screen the button labeled
  "Admin Area" reads "Admin". Intent: shorten the label.

- **h.) Automatic Admin sign-in.** Clicking the "Admin" button on the Title
  screen signs the user in as Admin automatically, without prompting for a
  username or password, and removes the Admin sign-in form. Intent: streamline
  Admin access; the existing dummy gate still applies on the backend, and the
  frontend simply supplies a fixed credential to obtain an admin token.

- **i.) Lesson Level indicator.** Add a `level` field to lessons, taking values
  1–5 where higher numbers mean more difficult lessons; the five seeded lessons
  are assigned Level 1. The Level is shown on the Catalog lesson cards and the
  Lesson screen (e.g. a "Level N" badge). The Admin area can set the Level (1–5,
  default 1) when adding or editing a lesson, and the Level is exposed through
  the lessons API. No lesson gating or unlocking is added. Intent: let lessons
  carry a difficulty level for display and admin editing, with no unlocking
  logic.

- **j.) Lesson emoji.** Add an `emoji` field to lessons, a single emoji used to
  illustrate the lesson. The five seeded lessons are back-filled with a suitable
  emoji (see below). The emoji is shown on the Catalog lesson cards. In the
  Admin area the user can pick an emoji for a lesson from a bundled, curated
  emoji list (a small local set in the frontend), so the emoji need not be typed
  by hand. The emoji is exposed through the lessons API and accepted when
  creating or updating a lesson. Intent: give each lesson a single visual emoji
  for the Catalog and admin assignment.

## Constraints

- **k.) Keep things simple.** Do not add features not requested in this sprint.
  Intent: scope discipline — only the items above are in scope; nothing extra is
  introduced. The emoji picker is a small bundled frontend set, not an open-ended
  search.

- **l.) Backend support where needed.** The backend additions are the `level`
  and `emoji` fields on lessons (with seed data and API exposure/acceptance).
  The View Transitions implementation (item c) is **frontend-only** and requires
  no backend support. All other items are frontend-only. Intent: constrain the
  backend change to the two lesson fields and keep the rest of the pass in the
  frontend.

- **m.) Record simplifications.** Wherever this document notes a simplification
  (auto admin sign-in retaining the dummy gate, Level being display-only with no
  gating, or the emoji search being a frontend picker), record it as a known
  limitation in the project documentation, not silently hidden. Intent: be
  transparent about any simplifications made in this pass.

## Boundaries

- The pass extends the existing application; it must not regress or change
  out-of-scope existing behavior.
- The only backend additions are the `level` and `emoji` fields on lessons
  (item l); the View Transitions API and all other items are frontend-only.
- The five seeded lessons are all assigned **Level 1** (item i).
- The five seeded lessons are back-filled with these specific emojis (item j),
  matched to the seeded lesson names, to keep seed data reproducible:
  - **Greetings & Basics** — 👋 (waving hand)
  - **Numbers & Time** — 🔢 (numbers)
  - **Family** — 👨‍👩‍👧 (family)
  - **Food & Drink** — 🍎 (apple)
  - **Common Verbs** — ⚡ (high voltage / action)
- Auto-Play (item d) operates within the current lesson only; it does not chain
  across lessons.
- No lesson gating/unlocking is added (item i).
- No features beyond those listed are in scope (item k).