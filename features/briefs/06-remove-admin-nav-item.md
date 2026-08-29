# Brief 06 — Remove Admin Nav Item

## Purpose

Remove the "Admin" link from the top navigation for signed-in users (v0.1 Brief
08, Navigation). Admin remains reachable only from the Title screen, so the
in-app top nav no longer advertises Admin.

## Expected Behavior

1. The top navigation no longer shows an "Admin" link for signed-in users.
2. Admin is reachable only from the Title screen via the existing Admin entry
   (unchanged).
3. The top navigation otherwise keeps its current items and behavior.

## Inputs / Outputs

- **Inputs (user):** viewing the top navigation while signed in.
- **Outputs (user):** a top navigation without an "Admin" link.

## User-Visible Behavior

While signed in, the top navigation no longer includes an "Admin" link. To reach
Admin, the user signs out (or starts from the Title screen) and uses the Admin
entry there. No other navigation changes.

## Constraints

- Remove only the Admin link from the top nav; keep all other nav items and
  behavior.
- Admin stays reachable from the Title screen; do not remove the Title screen
  Admin entry.
- Do not regress other navigation behavior.

## Basic Acceptance Expectations

- The signed-in top navigation shows no "Admin" link.
- Admin is still reachable from the Title screen.
- All other top navigation items remain present and functional.