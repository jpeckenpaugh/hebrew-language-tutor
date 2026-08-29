# Brief 07 — Remove "Signed in as" Badge

## Purpose

Reduce clutter in the sub-navigation by removing the "Signed in as {User}" text
that currently appears there. The user's identity is no longer shown in the
sub-nav.

## Expected Behavior

1. The sub-navigation no longer shows the "Signed in as {User}" text.
2. The sub-navigation keeps its other items and behavior unchanged.

## Inputs / Outputs

- **Inputs (user):** viewing the sub-navigation while signed in.
- **Outputs (user):** a sub-navigation without the "Signed in as {User}" badge.

## User-Visible Behavior

The "Signed in as {User}" badge is gone from the sub-navigation, reducing
clutter. No other element of the sub-navigation or the app changes.

## Constraints

- Remove only the "Signed in as" badge from the sub-navigation; keep all other
  sub-nav items and behavior.
- Do not regress other navigation or session behavior.

## Basic Acceptance Expectations

- The sub-navigation shows no "Signed in as {User}" text.
- All other sub-navigation items remain present and functional.