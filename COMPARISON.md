# Comparison: Two Experiments in This Repository

This repository contains **two experiments** for the same product — an
English/Hebrew vocabulary tutor. They were built through different processes
and with different architectures, and they are kept side by side deliberately,
so the tradeoffs are visible and comparable.

- **Experiment A — Decomposed client/server app** (the primary build).
- **Experiment B — Proof-of-concept static SPA** (the single-pass baseline).

The root [`README.md`](README.md) documents Experiment A. This document explains
both experiments and compares them in detail.

---

## Experiment A — Decomposed client/server app

- **Process:** built through a **9-stage decomposed role pipeline** — Concept,
  Feature Decomposition, Feature Briefs, System Engineering, Architecture,
  Backend, Frontend, Verification, and Documentation. Each stage wrote to the
  `instructions/`, `features/`, `docs/`, and `summaries/` folders and handed off
  to the next.
- **Architecture:** a real client/server application. A **FastAPI** backend with
  **SQLite** persistence is the single source of truth for lessons, vocabulary,
  and saved scores. The frontend is a plain HTML/CSS/JS single-page app
  (Bootstrap 5.3.3, hosted locally) that reads and writes everything through the
  backend API.
- **Features:** the full concept — lesson catalog, study/quiz/exam modes, score
  and attempt persistence with a scores history view, full navigation, and a
  dummy-gated **admin mode** for adding/editing lessons and vocabulary.
- **Code volume:** roughly 1,450 lines of application code, plus environment
  scripts, tests/verification, and extensive documentation.

## Experiment B — Proof-of-concept static SPA

- **Process:** a single-pass build with no staged pipeline. The intent was to
  establish a "built in one pass" simplified baseline for the same app.
- **Architecture:** a pure static site. Vocabulary is hardcoded as a JavaScript
  array in `scripts.js`; there is no server, no database, and no API. It is
  served by Python's built-in `http.server`.
- **Features:** the core learning experience only — lesson catalog, study, quiz
  (immediate feedback), and exam (deferred results). It does **not** include
  admin mode, score persistence, or a scores history view.
- **Code volume:** roughly 370 lines of application code, plus a short README.

---

## Head-to-head comparison

| Dimension | Proof-of-concept (B) | Decomposed client/server (A) |
|-----------|----------------------|------------------------------|
| **Architecture** | Pure static SPA; vocab hardcoded in `scripts.js`; no server logic | Client/server; FastAPI + SQLite is the single source of truth |
| **Data source** | Embedded JS array in the client | Database served via API; frontend holds no authoritative copy |
| **Concept coverage** | Implements the study/quiz/exam core (concept a–e) | Implements the full concept (a–g): adds admin + score persistence |
| **Admin mode** | None | Login gate + lesson/vocab add & edit |
| **Score persistence** | None (in-memory `score` variable only) | Saved to SQLite, viewable per-lesson history |
| **Navigation** | Home ↔ lesson ↔ mode | Full SPA nav: catalog, scores, admin, breadcrumbs |
| **Data richness** | Includes transliteration (pronunciation guide) per item | No transliteration field (schema is english/hebrew only) |
| **Code volume** | ~370 lines | ~1,450 lines (≈4×) |
| **Run mechanism** | `python3 -m http.server` (port 8080) | Uvicorn + venv (port 8000), with `install.sh` provisioning |
| **Error handling / escaping** | Minimal; `innerHTML` templates, no escaping | Escaping, 422/404 paths, 401 re-auth, loading/error states |
| **Verification** | Manual only | Curl-based API verification + static review, documented |

---

## Pros and cons

### Experiment A — Decomposed client/server app

**Pros**
- **Feature-complete:** implements the entire concept, including admin mode and
  score/attempt persistence.
- **Single source of truth:** state lives in a database behind an API, so it
  persists and is served consistently to the frontend.
- **Robust:** input validation, explicit error paths (404/422/401), HTML
  escaping, and separation of concerns (controller vs. pure rendering).
- **Traceable:** every stage produced artifacts, the verification report ties
  each check to a requirement, and known limitations are documented rather than
  hidden.
- **Extensible:** admin can add/edit lessons and vocabulary through the API.

**Cons**
- **More complex:** requires a virtual environment, database, and API layer just
  to run.
- **More code and tooling:** roughly 4× the application code of the baseline.
- **Process cost:** the staged pipeline is heavy relative to a small app.
- **More moving parts** to maintain, and a few rough edges (see observations).

### Experiment B — Proof-of-concept static SPA

**Pros**
- **Very simple:** zero dependencies, no build step, no database. Runs with a
  single `python3` command.
- **Fast to build:** a fraction of the code and effort.
- **Easy to reason about:** the entire app fits in one file.
- **Richer per-item data:** includes transliteration for pronunciation.

**Cons**
- **Feature-incomplete:** omits admin mode and score persistence, which the
  concept explicitly requires.
- **No single source of truth:** vocabulary is hardcoded in the client, so
  edits require changing code rather than data.
- **Less robust:** no escaping, minimal error handling; `innerHTML` templates
  would be an injection risk if fed user data.
- **No persistence:** scores are lost on reload.
- **Not traceable:** no requirements, architecture, or verification artifacts.

---

## Key observations

1. **The proof-of-concept is feature-incomplete, not just smaller.** It omits
   admin mode and score/attempt persistence (concept items f and g) entirely —
   it implements only the study/quiz/exam core. So the "one-pass" baseline is a
   partial implementation, not a full one.
2. **The role-built app is genuinely more robust, not just bigger.** The
   escaping, validation, error paths, and separation of concerns are direct
   products of the architecture and briefs stages. The POC's `innerHTML`
   templates would be an XSS risk if fed user data.
3. **Tradeoff — process cost vs. simplicity.** The decomposed app is ~4× the
   code and requires a venv + DB, all to support admin and persistence the
   concept requested. If "keep it simple" were read as "no backend beyond
   serving files," the POC's model is leaner — but that reading drops required
   features, so the decomposed app is the correct interpretation of the concept.
4. **Transliteration was dropped in the decomposed build.** The POC includes
   pronunciation guides, which are pedagogically valuable; the decomposed app's
   schema has no transliteration field. Worth flagging as a possible enhancement.
5. **Admin-created lessons start with 0 vocabulary items.** A newly created
   lesson has no vocabulary until items are added one at a time, and there is no
   UI affordance to bulk-add items — so populating a new lesson is tedious.
6. **Minor dead code / edge cases:** a breadcrumb "Catalog" handler in the
   study view is a dead handler, and if a lesson were shrunk below 4 items the
   question builder could produce fewer than four multiple-choice options.

---

## When to use which

- Choose **Experiment B (static POC)** when you want a fast, throwaway sketch to
  validate the UX or demonstrate the concept with minimal effort and no backend.
- Choose **Experiment A (decomposed client/server)** when you need the full
  feature set — persistence, admin, a real API — and value robustness,
  traceability, and extensibility over simplicity.