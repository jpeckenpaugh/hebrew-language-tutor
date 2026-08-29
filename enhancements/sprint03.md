# Sprint 03 — UI Polish, Study Auto-Play, and Lesson Levels

This sprint is a mixed frontend-focused pass with one small backend addition. It
fixes a broken Catalog breadcrumb, removes the app footer, adds smooth
page-to-page transitions, adds an Auto-Play mode to Study, gives Exam answers a
visible (non-correctness-revealing) selection indicator, restyles the Quiz/Exam
question as a centered large word, renames the Title screen's Admin button and
makes Admin sign in automatic, adds a 1–5 Lesson Level indicator (the five
seeded lessons become Level 1), and adds an emoji for each lesson shown on the
Catalog cards and assignable from Admin. It builds on the current build; it does
not start fresh.

a.) **Fix Catalog breadcrumb navigation.** On the Lesson screen (and the Study
    and results screens), clicking the "Catalog" breadcrumb or the results
    "All Lessons" button must return to the Lesson Catalog. The current break is
    that dynamically-rendered `data-nav` links are never wired; fix it so all
    navigation links work after rendering (e.g. via event delegation), covering
    the breadcrumb, the Study view's Catalog link, and the results screen's
    "All Lessons" button.

b.) **Remove the app footer.** Delete the footer text
    "English / Hebrew Language Tutor — state served by the backend API" so the
    page ends after the main content.

c.) **Page transitions.** Add a smooth cross-fade when navigating between
    screens using the View Transitions API (`document.startViewTransition`),
    degrading gracefully to the current instant swap on browsers without
    support.

d.) **Study Auto-Play.** Add a green "play" button at the top right of the Study
    screen. Pressing it speaks the current English term, pauses roughly two
    seconds, speaks the Hebrew term, pauses roughly four seconds, then advances
    to the next vocabulary item and repeats. Playback stops at the end of the
    lesson; pressing the control again (now a stop control) halts playback. In
    browsers without speech support, advance on the same timing without audio.

e.) **Exam selection indicator.** In Exam mode, after selecting an answer, show
    a neutral (e.g. grey/highlighted) style on the chosen option so the user can
    see their selection was accepted. Do not reveal whether it was correct or
    incorrect (unlike Quiz mode).

f.) **Centered, enlarged Quiz/Exam question.** Replace the Quiz/Exam prompt
    "What is the Hebrew for: "…"?" with the English word alone, centered on the
    page. Enlarge the English word to about 3× its current size, and enlarge the
    Hebrew answer options to about 3× their current size, for readability.

g.) **Rename the Admin button.** On the Title screen the button labeled
    "Admin Area" reads "Admin".

h.) **Automatic Admin sign-in.** Clicking the "Admin" button on the Title screen
    signs the user in as Admin automatically, without prompting for a username
    or password. The existing dummy admin gate (any non-empty credential) still
    applies on the backend; the frontend supplies a fixed credential to obtain
    an admin token. Remove the Admin sign-in form.

i.) **Lesson Level indicator.** Add a `level` field to lessons, taking values
    1–5 where higher numbers mean more difficult lessons. The five seeded
    lessons are assigned Level 1. The Level is shown on the Catalog lesson cards
    and the Lesson screen (e.g. a "Level N" badge). The Admin area can set the
    Level (1–5, default 1) when adding or editing a lesson. The Level is exposed
    through the lessons API. No lesson gating/unlocking is added in this sprint.

j.) **Lesson emoji.** Add an `emoji` field to lessons, a single emoji used to
    illustrate the lesson. The five seeded lessons are back-filled with a
    suitable emoji (e.g. a waving hand for "Greetings and Basics", a family for
    a family/people lesson, an apple for food and drinks). The emoji is shown on
    the Catalog lesson cards. In the Admin area the user can search for an emoji
    and assign it to a lesson, so the emoji need not be typed by hand. The emoji
    is exposed through the lessons API and accepted when creating/updating a
    lesson.

k.) Keep things simple. Do not add features not requested in this sprint.

l.) Backend support where needed. The backend additions are the `level` column
    and `emoji` field on `lessons` (with seed data and API
    exposure/acceptance) and any support the View Transitions implementation
    requires; all other items are frontend-only.

m.) Wherever this document notes a simplification (such as auto admin sign-in
    retaining the dummy gate, Level being display-only with no gating, or the
    emoji search being a frontend picker), record it as a known limitation in
    the project documentation, not silently hidden.

Note on seed-data verification: the SQLite database is created and seeded
automatically on startup and does not need to be preserved. To verify the new
seed data (lesson levels and emojis), stop the server, delete the on-disk
database, and restart so it is recreated and re-seeded freshly.