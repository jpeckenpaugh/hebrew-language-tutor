# Stage 2 — Bug Fix

## Role / Purpose

Implement the fix approved in the bug report. This stage works only from the
report's confirmed root cause and proposed fix. It changes application code,
runs an automated verification of the fix, and updates the report's status — but
it does **not** move the report or claim human confirmation.

## Inputs

- `bugs/NN-<slug>.md` — the bug report with `Status: Approved` (root cause and
  proposed fix confirmed by a human).
- The codebase files identified in the report.

## Outputs

- Code changes implementing the approved fix.
- Updated `bugs/NN-<slug>.md` — a note of what changed, the automated
  verification result, and `Status` set to `Fixed`.
- `instructions/debug/summaries/02-<slug>.md`.

## Instructions

1. Read `bugs/NN-<slug>.md` in full. Implement **only** the proposed fix; do
   not extend scope.
2. Apply the changes following the repo's existing code conventions, staying
   within the files identified in the report.
3. Run an automated verification of the fix per the report's Follow-up steps,
   using the running application (`./install.sh`, `./run.sh`). Capture any logs
   or scratch output under `./tmp/`.
4. If automated verification fails, iterate on the fix until it passes.
5. Record in the report: what changed (files + lines), the automated
   verification result, and that human confirmation is still pending.
6. Set the report's `Status` to `Fixed`. Do NOT move the report.
7. Write your summary file (see below).

## What NOT to do

- Do NOT fix without an approved root cause / proposed fix (`Status: Approved`).
- Do NOT add features or behavior beyond the approved fix.
- Do NOT regress unrelated existing behavior.
- Do NOT redesign unrelated architecture.
- Do NOT mark the bug `Resolved` or move it to `bugs/resolved/` — that is
  Stage 3's job, after human confirmation.

## Summary

Write `instructions/debug/summaries/02-<slug>.md` using
`instructions/debug/summaries/00-template.md`. Summarize the fix at a high level
and note the automated verification result and anything the human should test
before confirming resolution.

As the final step, commit your changes to the current branch and push to
`origin`, using a message in the form `debug 02: <brief summary>`.