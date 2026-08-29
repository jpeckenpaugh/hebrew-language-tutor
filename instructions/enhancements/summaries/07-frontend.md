# Summary: Frontend Engineer (Stage 7)

- **Date:** 2026-08-29
- **Author / Executor:** opencode (Stage 7 role)
- **Instruction file:** `instructions/enhancements/07-frontend.md`
- **Scope reference:** `enhancements/scope.md`
- **Commit:** `stage 07: implement sprint 02 UI/UX refinements in the frontend`

## Work Completed

Implemented the Sprint 02 (Part C) frontend refinements on the existing
`frontend/` code, covering all seven features. No backend changes were made;
the only consumed backend addition is the already-shipped `GET /api/users`
endpoint (Stage 6). Existing v0.1 and Sprint 01 behavior was preserved outside
the in-scope changes.

## Outputs Produced / Modified

- `frontend/js/views.js` (modified)
  - `title()` now renders a sign-in **picker** fed by `GET /api/users` instead
    of the free-text username field; with no users it shows a "No accounts yet —
    use Create Account" hint and disables sign-in (feature 01).
  - Added `createAccountModal()` — a Bootstrap modal form asking for a non-empty
    username, wired to a submit callback (feature 02).
  - `study()` redesigned so the English and Hebrew terms each carry a small
    inline speaker icon (TTS) beside them; the separate-line TTS buttons are
    removed (feature 05). Terms are rendered with the larger `.term-en`/`.term-he`
    classes (feature 04).
  - Admin panel button relabeled from "Sign Out" to "Log out" (feature 03).
- `frontend/js/app.js` (modified)
  - `goTitle()` now fetches `GET /api/users` and passes the list to the picker
    view; on failure it falls back to the empty-list state.
  - Added `showCreateModal()` / `createAccount()`: opens the Bootstrap modal,
    calls the existing `POST /api/auth/signup`, and on success hides the modal
    and re-renders the Title screen (re-fetching the picker) **without auto
    sign-in** (feature 02).
  - Admin `onLogout` now calls `POST /api/admin/logout` and routes to `goTitle()`
    (the main Title screen) instead of the Admin sign-in screen (feature 03).
  - Removed the "Signed in as {User}" badge update logic (feature 07); the badge
    element was removed from the HTML.
  - Added `setNavVisibility()` which hides the top-nav Admin link whenever any
    session (learner or admin) is active (feature 06).
- `frontend/index.html` (modified)
  - Removed the `userBadge` "Signed in as" span (feature 07).
  - Gave the top-nav Admin link `id="adminNavItem"` and default `d-none`, toggled
    by `setNavVisibility()` (feature 06).
- `frontend/css/style.css` (modified)
  - Larger term text on Study (`term-en`/`term-he`) and on Quiz/Exam
    (`#quizPrompt`/`#examPrompt`, `.option-btn`) — feature 04.
  - Inline speaker icon styling (`.term-row`, `.tts-icon`) — feature 05.

## Key Decisions

- **Admin nav visibility (feature 06):** per human direction, the top-nav Admin
  link is hidden whenever any session (learner or admin) is active, keeping Admin
  reachable only from the Title screen.
- **Picker refresh (feature 02):** after a successful account creation the Title
  screen re-fetches `GET /api/users` immediately, so the new account appears in
  the picker right away rather than only after a manual refresh.
- **Create Account modal (feature 02):** implemented as a Bootstrap modal
  rendered into the DOM (appended to `document.body`), consistent with the
  Bootstrap 5.3 baseline already loaded in `index.html`.
- **No auto sign-in:** account creation now only creates the identity and returns
  the user to the Title screen, decoupled from sign-in as required.
- **Larger text sizes (feature 04):** Study terms `2rem`, quiz/exam prompt
  `1.75rem`, quiz/exam options `1.4rem` — chosen to be clearly larger while
  keeping the existing layouts usable.

## Open Questions & Concerns

- **Modal feedback for duplicate usernames:** a duplicate username surfaces the
  backend's `409 {"detail": "Username already exists"}` inside the modal; this is
  the standard error path and requires no special handling, but a verification
  pass should confirm the message renders clearly.
- **Empty-state sign-in:** when no accounts exist the Sign In control is disabled
  and a hint points to Create Account; this satisfies Brief 01's acceptance
  expectations (no empty/disabled list with no guidance).
- **Browser TTS support:** the inline icons rely on the Web Speech API
  (`speechSynthesis`), which was already the case in Sprint 01; browsers without
  support simply show a no-op icon (existing behavior preserved).
- **Verification focus:** the verification stage should confirm (a) pick-then-
  sign-in does not sign in on selection alone, (b) admin "Log out" returns to the
  main Title screen, and (c) the picker populates from `GET /api/users` on a cold
  load.

## Status

- [x] Complete
- [ ] Needs review