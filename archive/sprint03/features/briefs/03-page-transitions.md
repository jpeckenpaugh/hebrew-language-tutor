# Brief 03 — Page Transitions

## Purpose

Polish the feel of navigation by cross-fading between screens where the browser
supports it, while degrading gracefully to the current instant swap elsewhere.

## Expected Behavior

1. Navigating between screens uses a smooth cross-fade transition.
2. On browsers that support the transition, screens fade from one to the next.
3. On browsers without support, navigation falls back to the current instant
   swap with no error.
4. The transition must not delay, block, or break navigation in any browser.

## Inputs / Outputs

- **Inputs (user):** any navigation action between screens.
- **Outputs (user):** the destination screen, shown via cross-fade (supported) or
  instant swap (unsupported).

## User-Visible Behavior

The user sees a gentle fade when moving between screens on capable browsers, and
the current immediate screen swap on browsers without support. Navigation always
succeeds.

## Constraints

- Frontend-only; requires no backend support.
- Must not break navigation in browsers that do not support the transition.
- Do not change which screens exist or how navigation targets are chosen.

## Basic Acceptance Expectations

- Screen-to-screen navigation shows a cross-fade on supported browsers.
- Browsers without support still navigate correctly (instant swap, no errors).