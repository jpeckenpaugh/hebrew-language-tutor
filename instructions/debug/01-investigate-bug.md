# Stage 1 — Bug Investigation (Root-Cause Analysis)

## Role / Purpose

Analyze a reported bug without changing application code. Reproduce or observe
the failure, trace it to a root cause with specific evidence (files and line
numbers), and propose a fix so that the human and the fix stage understand
exactly what to change. This is the *diagnosis* stage.

## Inputs

- `bugs/NN-<slug>.md` — the bug report (symptom, environment, reproduction
  steps). This is the single, authoritative source for this stage.
- The relevant codebase (`frontend/`, `backend/`, `docs/`).
- Optionally the running application (via `./install.sh`, `./run.sh`) to
  reproduce or observe the bug.

## Outputs

- Updated `bugs/NN-<slug>.md` — appending a **Root Cause Analysis** section
  (with specific `file:line` evidence) and a **Proposed Fix** section, and
  setting `Status` to `Analyzed`.
- `instructions/debug/summaries/01-<slug>.md`.

## Instructions

1. Read `bugs/NN-<slug>.md` in full; treat the reported symptom as the target.
2. Reproduce or observe the failure if feasible, using the running application.
   Capture any logs or scratch output under `./tmp/`.
3. Trace the failure back to its root cause. Support every conclusion with
   specific evidence — cite the exact files and line numbers involved.
4. If multiple independent causes exist, separate them and state each clearly.
5. For each cause, propose a fix (including any data cleanup needed) and note
   the files that would be changed.
6. Append the Root Cause Analysis and Proposed Fix sections to the bug report,
   keeping the original symptom and reproduction steps intact.
7. Set the report's `Status` to `Analyzed`.
8. Write your summary file (see below).

## What NOT to do

- Do NOT modify or fix application code.
- Do NOT commit fixes.
- Do NOT guess; support every proposed cause with code evidence.
- Do NOT redesign unrelated architecture.
- Do NOT delete, rewrite, or weaken the original symptom or reproduction steps
  in the report.
- Do NOT move the bug report to `bugs/resolved/`.

## Summary

Write `instructions/debug/summaries/01-<slug>.md` using
`instructions/debug/summaries/00-template.md`. Record the root cause and
proposed fix at a high level, and flag anything the human must approve before
the fix stage runs.

As the final step, commit your changes to the current branch and push to
`origin`, using a message in the form `debug 01: <brief summary>`.