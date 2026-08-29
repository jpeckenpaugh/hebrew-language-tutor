# Stage 1 — Concept / Seed

## Role / Purpose

Define the product at a high level. This is the first stage of the pipeline. Its
job is to capture what the product is, who it is for, what it does, and the
initial constraints — in plain words, with no technical detail.

## Inputs

- Stakeholder discussion / agreed product constraints.
- Nothing upstream in the pipeline (this is the seed stage).

## Outputs

- `concept.md` — a concise concept document stating:
  - Product purpose (what it does and why it exists).
  - The target user.
  - Major capabilities.
  - Initial constraints / boundaries.

## Instructions

1. Gather the product discussion and any agreed constraints.
2. Write a single, concise concept document to `concept.md` (overwrite it if it
   already exists).
3. State the product purpose clearly and in plain language.
4. Identify who the product is for.
5. List the major capabilities the product must provide.
6. Record the initial constraints and boundaries (including any explicit
   "keep it simple / do not add unrequested features" guidance).
7. Keep the document short and readable; it is the reference for every
   downstream stage.
8. Write your summary file (see below).

## What NOT to do

- Do NOT specify API routes, packages, schemas, or any code structure.
- Do NOT design the architecture or technical implementation.
- Do NOT add features that were not requested.
- Do NOT produce code or configuration of any kind.
- Do NOT move into implementation details; stay at the product level.
- Do NOT silently change or drop agreed constraints.

## Summary

Write `summaries/01-write-concept.md` using `summaries/00-template.md`.
Record a high-level overview of the concept and any open questions or concerns
about the product scope that the next stages (or a human) should address.