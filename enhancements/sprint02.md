# Sprint 02 — UI/UX Refinement for the English/Hebrew Tutor

This sprint improves the learner experience across the app. It is a
frontend-focused pass: it replaces the typed-username sign-in with a user
picker, decouples Create Account into a modal, makes Admin sign-out return to
the Title screen, increases term readability, moves TTS controls inline, and
removes unused/contradictory nav elements. It adds one small backend endpoint
(list users) to support the sign-in picker.

a.) Sign-in user picker. The Title screen shows a dropdown of existing user
    accounts (populated from the backend) so a returning user can pick their
    name instead of typing it.
b.) Create Account modal. "Create Account" opens a modal form asking for a
    username, decoupled from the sign-in field, so a new user can create an
    account independently of the picker.
c.) Consistent Admin sign-out. Signing out as Admin returns to the main Title
    screen (like the learner "Log out"), not the Admin Sign In screen. Add a
    "Log out" control in Admin mode's UI and remove the separate admin-only
    "Sign Out" button.
d.) Larger terms text. Increase the size of the English/Hebrew text on the
    Study, Quiz, and Exam screens for readability.
e.) Inline TTS icons. Replace the TTS buttons that sit on their own line in
    Study cards with small speaker icons placed next to the English and Hebrew
    terms.
f.) Remove the Admin nav item. The top navigation no longer shows an "Admin"
    link for signed-in users; Admin stays reachable only from the Title screen.
g.) Remove the "Signed in as" badge. The sub-nav no longer shows the
    "Signed in as {User}" text.
h.) Keep things simple. Do not add features not requested in this sprint.
i.) Backend support where needed. The only backend addition is an endpoint
    listing existing users (for item a.); all other items are frontend-only.
j.) Wherever this document notes a simplification, record it as a known
    limitation in the project documentation, not silently hidden.