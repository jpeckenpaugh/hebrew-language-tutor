# Sprint 01 — Enhancements to the English/Hebrew Language Tutor

This sprint extends the existing app (study/quiz/exam, scores, admin) with
learner identity, pronunciation support, and progress tracking. It builds on the
current build; it does not start fresh.

a.) Add an English transliteration (pronunciation guide) for each Hebrew
    vocabulary word, shown alongside the word while studying.
b.) Add simple Text-to-Speech for the English and Hebrew forms of vocabulary
    items, so the user can hear each term while studying.
c.) Add per-user accounts: a user creates or signs in with a non-empty username
    (no password).
d.) Save scores per user: each saved attempt is tied to the signed-in user, and
    the score history view shows only that user's attempts.
e.) Add a Title screen shown when the app opens, offering username sign-in and a
    separate Admin entry (the existing dummy admin gate is unchanged).
f.) Add a Logout control in the main UI so a student or admin can sign out and
    return to the Title screen to swap users.
g.) Allow the user to review the questions they answered incorrectly after
    finishing a quiz or exam, showing the correct answer for each.
h.) Track which vocabulary words a user has "known", deriving "known" from a
    word answered correctly on an exam, and reflect per-user progress.
i.) Keep things simple. Do not add features not requested in this sprint.
j.) Usernames, users, scores, and known-word status are stored in the backend
    (SQLite), which remains the single source of truth.
k.) Wherever this document notes a simplification (such as no student password),
    record it as a known limitation in the project documentation, not silently
    hidden.