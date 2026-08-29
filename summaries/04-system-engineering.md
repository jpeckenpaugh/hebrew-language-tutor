# Summary: System Engineer (Stage 4)

- **Date:** 2026-08-28
- **Author / Executor:** opencode (Stage 4 role)
- **Instruction file:** `instructions/04-system-engineering.md`

## Work Completed

Defined a reproducible development/runtime environment for the English/Hebrew
Language Tutor. Selected the environment around the already-approved stack
(FastAPI backend, SQLite, plain HTML/CSS/JS frontend with Bootstrap hosted
locally), created a pinned dependency manifest, and wrote scripts to provision
the environment from scratch and to start the application. Also recorded the
runtime assumptions and caveats in environment notes. No product behavior, API
endpoints, or UI code was implemented.

## Outputs Produced

- `requirements.txt` — pinned Python deps: `fastapi`, `uvicorn[standard]`.
- `install.sh` — creates `.venv`, installs deps, fetches Bootstrap from the
  CDN and hosts it locally under `frontend/static/vendor/bootstrap/`.
- `run.sh` — starts the app via Uvicorn; defaults to port 8000, accepts a
  port as the first argument, honors a `HOST` env var.
- `environment-notes.md` — prerequisites, Python/runtime assumptions, setup
  usage, and caveats.
- `summaries/04-system-engineering.md` (this file).

## Key Decisions

- **System-installed Python:** use `python3` already on the machine (verified
  here as Python 3.9.6) rather than pinning/installing a specific toolchain.
  A `.venv` isolates dependencies without touching the system interpreter.
- **Bootstrap downloaded in `install.sh`** per concept requirement to fetch
  from CDN and host locally; files land under
  `frontend/static/vendor/bootstrap/`.
- **`run.sh` port parameter:** defaults to `8000`, overridable via `./run.sh
  <PORT>`; host overridable via `HOST` env var.
- **Minimal pinned deps:** only what the stack requires; SQLite needs no
  package (stdlib).

## Open Questions & Concerns

- **Backend entry point (`app.main:app`):** `run.sh` targets
  `app.main:app`. The backend files do not exist yet — Stage 6 must produce
  that module/object (or the target must be updated to match Stage 6's chosen
  layout).
- **Static/vendor path convention:** the Bootstrap download location assumes
  `frontend/static/vendor/bootstrap/`. If Stage 7 uses a different layout,
  `install.sh` must be updated to match.
- **Admin sign-in (brief 06) and score/attempt identity (brief 07):** open
  product questions from earlier stages. They do not block environment setup
  but must be resolved before backend engineering.
- **Python 3.9.6** is the verified local interpreter; newer 3.x should also
  work, but the manifest is pinned for reproducibility.

## Status

- [x] Complete
- [ ] Needs review