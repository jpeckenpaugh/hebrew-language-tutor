# Stage 1 — Enhancement Intake

## Role / Purpose

Agree the scope of the enhancement pass. This is the first stage of the
enhancement pipeline. Its job is to identify which proposed enhancements from
the `enhancements/` folder are in scope for this pass and to record that
agreement in plain words, with no technical detail.

Unlike the original build (which started from a clean concept), this workflow
extends an existing application. There is no new product concept to write —
instead, the agreed scope is drawn from the enhancement proposals.

## Inputs

- All enhancement proposals in `enhancements/*.md`.
- The existing application and its constraints (see `concept.md`, the v0.1
  build artifacts under `features/completed/`, and `docs/architecture.md`) as
  context for what is being extended.
- Stakeholder guidance on which enhancements to prioritize.

## Outputs

- `enhancements/scope.md` — a concise scope document stating:
  - Which enhancements (by proposal file) are in scope for this pass.
  - The high-level intent of each in-scope enhancement.
  - Any constraints or boundaries on the pass.

## Instructions

1. Read every enhancement proposal in `enhancements/*.md` (do not skip any).
2. Determine which enhancements are in scope for this pass, based on the
   proposals present and stakeholder guidance.
3. Write `enhancements/scope.md` listing the in-scope proposals by their file
   names (e.g., `enhancements/01-<proposal>.md`).
4. For each in-scope proposal, record its high-level intent in plain language.
5. Record any constraints or boundaries on the pass (for example, scope limits,
   or that no out-of-scope existing behavior should be changed).
6. Keep the document short and readable; it is the reference for every
   downstream stage.
7. Write your summary file (see below).

## What NOT to do

- Do NOT specify API routes, packages, schemas, or any code structure.
- Do NOT design the architecture or technical implementation.
- Do NOT add enhancements that are not present in `enhancements/*.md`.
- Do NOT produce code or configuration of any kind.
- Do NOT rewrite the existing product concept or drop existing product
  constraints.
- Do NOT silently change or drop agreed constraints.

## Summary

Write `instructions/enhancements/summaries/01-enhancement-intake.md` using
`instructions/enhancements/summaries/00-template.md`. Record the agreed scope at
a high level and any open questions or concerns about scope that the next
stages (or a human) should address.

As the final step, commit your changes to the current branch and push to
`origin`, using a message in the form `stage 01: <brief summary>`.