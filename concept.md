Create a simple English/Hebrew Language Tutor Web App.

The Web App should have a clean/simple HTML/CSS/JS frontend and a FastAPI Backend that uses SQLite for the Database.

a.) Keep things simple.  Do not add or include features that are not requested.
b.) Use Bootstrap CSS/JS as the baseline (fetch the files from the CDN and host them locally).
c.) Add 5 basic language lessons, with 10 vocab items for each lesson.
d.) Each lesson should have study, quiz, and exam modes.  Quiz should allow the user to have immediate feedback on their answers and exam mode shows the results at the end of the exam.  Use multiple choice for both quiz and exam modes.
e.) Application state, including lessons should be sourced from the backend API.
f.) Include basic Navigation and Score/Attempt persistence in the API/DB.  Scores are recorded globally per lesson with no user identity: the scores table has no user foreign key, and history is displayed per-lesson for the current app/browser.
g.) Create a simple "Admin" mode that allows a user to sign in and modify existing as well as add new Lessons/Vocab.  Admin sign-in is a dummy gate: it only requires a non-empty credential (no real password verification), documented as a known simplification.  State-changing admin endpoints check that the client holds a "signed-in" token.
h.) Wherever this document notes a simplification (such as the dummy admin gate), it must be recorded as a known limitation in the project documentation, not silently hidden.
