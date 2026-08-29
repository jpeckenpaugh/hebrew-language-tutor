# Environment Notes — English/Hebrew Language Tutor

Stage 4 establishes a reproducible development/runtime environment for the
app. Product behavior and application features are defined by later stages
(5–7). These notes capture the runtime assumptions, prerequisites, and caveats
that the system relies on.

## Selected technical stack

- **Backend:** FastAPI (Python), running under Uvicorn.
- **Database:** SQLite (Python standard library — no extra driver/package).
- **Frontend:** Plain HTML/CSS/JS with Bootstrap CSS/JS hosted locally (fetched
  from the CDN during install, per concept).
- **Single source of truth:** the backend API serves application state
  (lessons, vocabulary, saved scores/attempts) — see feature brief 09.

## Prerequisites

- A **system-installed Python 3** interpreter (`python3`) on `PATH`.
  - Verified on this machine: `/usr/bin/python3` → **Python 3.9.6**.
  - The scripts use the system Python; they do not install a separate
    language toolchain.
- `curl` (or `wget`) available to fetch Bootstrap during `install.sh`.
- `git` available (repo checkout) — not otherwise required at runtime.

## Python / runtime assumptions

- Version target: **Python 3.9+** (the installed interpreter is 3.9.6).
- A virtual environment is created at `<repo-root>/.venv`; all Python
  dependencies are installed there. The system Python is left untouched.
- Dependencies are pinned in `requirements.txt`:
  - `fastapi` and `uvicorn[standard]`.
  - SQLite is used via the standard library (no package required).

## Environment setup / run

- `./install.sh`
  - Creates the `.venv` virtual environment.
  - Installs dependencies from `requirements.txt`.
  - Fetches Bootstrap 5.3.3 CSS/JS from the CDN and writes them to
    `frontend/static/vendor/bootstrap/` for local hosting.
- `./run.sh [PORT]`
  - Starts Uvicorn, defaulting to **port 8000**; pass a port as the first
    argument to override (e.g., `./run.sh 9000`).
  - Binds `0.0.0.0` by default; override with the `HOST` environment variable.
  - Runs the app module `app.main:app`. **Note:** the backend entry point
    (`app/main.py`) is produced by the Backend Engineer stage (Stage 6); until
    then, `run.sh` will not start a working server.

## Caveats / open items for downstream roles

- **`run.sh` assumes `app.main:app`.** The backend entry point does not exist
  yet — Stage 6 must create `backend/app/main.py` with an `app` object, and
  `run.sh` expects the working directory / module layout to match. Adjust the
  import target in `run.sh` if the Backend stage chooses a different layout.
- **Bootstrap local hosting** is set up by `install.sh`, but the Frontend stage
  (Stage 7) is responsible for referencing those locally-hosted files in its
  HTML and for building the actual frontend.
- **Static/vendor path convention** (`frontend/static/vendor/bootstrap`) is an
  assumption made here; if the Frontend stage uses a different layout, the
  download location in `install.sh` should be updated to match.
- **Admin sign-in** (brief 06) and **score/attempt identity** (brief 07) are
  open product questions from earlier stages; they do not block environment
  setup but must be resolved before backend engineering.
- **Dependency pinning** is fixed to specific versions for reproducibility;
  bump intentionally if newer versions are required.