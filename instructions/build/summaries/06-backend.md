# Summary: Backend Engineer (Stage 6)

- **Date:** 2026-08-29
- **Author / Executor:** Backend Engineer (AI)
- **Instruction file:** `instructions/06-backend.md`

## Work Completed

Implemented the full FastAPI backend per `docs/architecture.md`: the SQLite
persistence layer with idempotent seeding, every API endpoint defined in the
architecture's section 6 API contracts, and the dummy admin auth gate. The
backend serves as the single source of truth for lessons, vocabulary, and saved
scores/attempts. The frontend static files are mounted (served at `/`) when the
`frontend/` directory exists.

## Outputs Produced

- `backend/app/__init__.py`
- `backend/app/main.py` — FastAPI `app`, CORS, router mounting, static mount, calls `init_db()`
- `backend/app/db.py` — SQLite connection, schema (`lessons`, `vocab`, `scores`), idempotent seeding
- `backend/app/models.py` — Pydantic schemas for all request/response contracts
- `backend/app/seed.py` — 5 lessons × 10 English/Hebrew vocab pairs (50 items)
- `backend/app/routers/catalog.py` — `GET /api/lessons`, `GET /api/lessons/{id}`, `GET /api/lessons/{id}/vocab`
- `backend/app/routers/scores.py` — `POST /api/scores`, `GET /api/scores`
- `backend/app/routers/admin.py` — login/logout gate + lesson/vocab mutating routes
- `backend/english_tutor.db` — runtime SQLite file (gitignored)
- `run.sh` — modified to `cd` into `backend/` before starting Uvicorn
- `.gitignore` — added `backend/english_tutor.db`, `__pycache__/`, `*.pyc`

## Key Decisions

- **Run-script conflict (`run.sh`):** `run.sh` launches `uvicorn app.main:app`.
  Because the `app` package lives under `backend/`, `run.sh` now executes
  `cd "$ROOT_DIR/backend"` before launching Uvicorn. This keeps the
  architecture-declared module layout and the `app.main:app` import target
  intact, and resolves the import path without relocating modules.
- **DB path:** `db.py` derives the database location from the package file
  (`backend/english_tutor.db`), so it is consistent regardless of the working
  directory Uvicorn starts in.
- **Auth gate:** an in-memory set of issued opaque tokens (secrets), checked on
  every mutating admin route. Tokens are held only in memory, so **they become
  invalid on server restart** — the frontend should re-prompt for sign-in on a
  401. No real credential verification is performed (per design).
- **Seed content:** `seed.py` is backend-authored plausible content (5 lessons
  × 10 pairs) since upstream only specified the shape/quantity. It is idempotent
  (skips when lessons already exist) so restarts do not duplicate data.
- **Static serving:** `main.py` mounts the `frontend/` directory at `/` with
  `html=True` when present. If `frontend/` is absent (Stage 7 not yet done), the
  mount is skipped; API routes remain unaffected.

## Open Questions & Concerns

- **Frontend (Stage 7):** the frontend must render only what the API returns and
  construct quiz/exam questions client-side from the served vocab. It must send
  `Authorization: Bearer <token>` on mutating admin calls and handle 401s by
  re-prompting for sign-in (token lifetime is per-process memory).
- **Admin token lifecycle:** a server restart invalidates all tokens; any stale
  token the frontend holds will 401. No persistent session store is present by
  design.
- **Static mount timing:** the frontend is only served once `frontend/` exists.
  Until Stage 7, hitting `/` may 404 (or return the bootstrap vendor dir), but
  the `/api/*` endpoints are fully functional.
- **New lessons start empty:** per the contract, `POST /api/admin/lessons`
  creates a lesson with no vocab; items are added via the vocab endpoint. A new
  lesson may therefore have fewer than 10 items until admin adds them (relaxes
  the "10 per lesson" seed guarantee only for admin-created lessons).

## Status

- [x] Complete
- [ ] Needs review