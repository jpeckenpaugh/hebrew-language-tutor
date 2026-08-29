# Brief 01 — Catalog Breadcrumb Navigation

## Purpose

Repair broken navigation so every dynamically-rendered link that points back to
the Lesson Catalog works after the page renders, so the user can always return
to the catalog from a lesson or its results.

## Expected Behavior

1. On the Lesson screen, the "Catalog" breadcrumb returns the user to the Lesson
   Catalog.
2. On the Study view, the "Catalog" link returns the user to the Lesson Catalog.
3. On the results screen, both the "Catalog" breadcrumb and the "All Lessons"
   button return the user to the Lesson Catalog.
4. All of these links work after the page has rendered (dynamically-rendered
   links must be functional, not merely present).
5. No change is made to the catalog behavior itself — the fix is limited to
   making these navigation links work.

## Inputs / Outputs

- **Inputs (user):** a click on the "Catalog" breadcrumb/link or the results
  screen's "All Lessons" button.
- **Outputs (user):** the Lesson Catalog screen.

## User-Visible Behavior

The user can click "Catalog" (from the Lesson screen, Study view, or results
screen) or "All Lessons" (from the results screen) and reliably land on the
Lesson Catalog. This restores the existing expected navigation described in
Brief 08 (Navigation) rather than introducing new navigation.

## Constraints

- Repair navigation only; do not alter catalog layout, content, or behavior.
- Do not regress other existing navigation (between modes, lessons, and admin).

## Basic Acceptance Expectations

- From the Lesson screen, Study view, and results screen, the "Catalog"
  breadcrumb/link opens the Lesson Catalog.
- From the results screen, the "All Lessons" button opens the Lesson Catalog.
- The catalog still behaves as before once reached.