# Brief 08 — Navigation

## Purpose

Provide basic navigation so the user can move between the product's sections,
lessons, and modes.

## Expected Behavior

1. The user can reach the lesson catalog from anywhere.
2. Within a lesson, the user can switch between its study, quiz, and exam
   modes.
3. The user can move from any mode back to the catalog or to another lesson.
4. Navigation is simple and consistent; the user always knows where they are
   and can get where they want without reloading the app manually.
5. Admin area is reachable as its own section.

## Inputs / Outputs

- **Inputs (user):** clicks/actions selecting a section, lesson, or mode.
- **Outputs (user):** the corresponding screen (catalog, lesson modes, admin).

## User-Visible Behavior

The user sees a simple navigation structure (e.g., a header/menu) allowing
movement between the catalog, lessons, their modes, and admin. Selecting a
destination shows the appropriate screen.

## Constraints

- Navigation is "basic"; do not add complex routing features beyond moving
  between sections/lessons/modes.
- Every mode/section must be reachable through navigation.
- The app must render navigation sourced from backend data where applicable
  (see Brief 09).

## Basic Acceptance Expectations

- The user can reach the catalog, each lesson's three modes, and admin.
- Navigating between screens works without a manual page reload.
- The current location is clear to the user.