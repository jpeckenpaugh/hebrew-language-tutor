# Debug Role Pipeline Orchestration

Bugs discovered after an enhancement pass (or during development) are handled
through a sequence of clearly separated roles. Each role reads the artifacts
produced by upstream roles, does a bounded amount of work, writes its own
artifacts, and hands off to the next role.

The role instructions live in the `instructions/debug/` folder. Bug reports
live in the top-level `bugs/` folder, with resolved bugs moved to
`bugs/resolved/`.

## Folder / file layout

```
.
├── bugs/                            Bug reports
│   ├── 01-<slug>.md                 an open bug report (Stage 1 source)
│   └── resolved/
│       └── NN-<slug>.md             a confirmed-resolved bug (moved by Stage 3)
├── instructions/
│   └── debug/
│       ├── 00-README.md             (this file)
│       ├── 01-investigate-bug.md    Stage 1 — root-cause analysis
│       ├── 02-fix-bug.md            Stage 2 — implement the approved fix
│       ├── 03-verify-bug.md         Stage 3 — human confirmation + archive
│       └── summaries/
│           ├── 00-template.md       debug summary template
│           └── NN-<slug>.md         (each role's summary)
└── tmp/                             gitignored scratch/log folder (see below)
```

Both `bugs/` and `bugs/resolved/` are tracked by git (they are the paper trail).

## Roles in order

| Order | Role                 | Instruction file            | Produces / Modifies                                    |
|-------|----------------------|-----------------------------|--------------------------------------------------------|
| 1     | Bug Investigator     | `01-investigate-bug.md`     | updates `bugs/NN-<slug>.md` with root cause + proposed fix |
| 2     | Bug Fixer            | `02-fix-bug.md`             | code changes implementing the approved fix             |
| 3     | Bug Verifier         | `03-verify-bug.md`          | human-confirmed `Status: Resolved`; moves report to `bugs/resolved/` |

## Handoffs

Each role is the sole owner of its stage. A role must not reach backwards and
redo an upstream role's work, and must not reach forwards and do the next
role's work. The outputs of one role become the inputs of the next:

```
bugs/NN-<slug>.md -> (01: root cause + proposed fix) ->
human approves -> (02: implemented fix) ->
human confirms -> (03: resolved + moved to bugs/resolved/)
```

## Bug report status lifecycle

A bug report's `Status` field transitions as it moves through the pipeline:

```
Open -> Analyzed -> Approved -> Fixed -> Resolved
```

- **Open** — reported, awaiting investigation.
- **Analyzed** — Stage 1 appended the Root Cause Analysis and Proposed Fix.
- **Approved** — a human accepted the proposed fix (gate between Stage 1 and 2).
- **Fixed** — Stage 2 implemented and auto-verified the fix.
- **Resolved** — a human confirmed the fix after testing; Stage 3 moved the report
  to `bugs/resolved/NN-<slug>.md`.

Two human gates exist in the pipeline:
1. **Approve the fix** — before Stage 2 runs.
2. **Confirm resolution** — during Stage 3, after human testing.

## Temporary files and logs

Temporary files, server/test logs, and scratch output produced while a role
works (such as capturing the running server's output during verification) are
written to the project's `./tmp/` folder. `./tmp/` is gitignored (except its
`.gitkeep` placeholder) and lives inside the worktree, so writes there are
auto-writable and never committed. Do **not** write temporary files or logs to
the OS temp directory (e.g. `/tmp`) or into the project tree.

## Summary requirement

Every role must write a single markdown summary of its completed work into the
`instructions/debug/summaries/` folder, named `NN-<slug>.md` to match its stage
number and the bug it worked on (for example
`instructions/debug/summaries/02-tts-issue.md`). Use
`instructions/debug/summaries/00-template.md` as the basis.

## Per-stage commits

Each stage commits its work as the **final step** of the stage, after producing
all of its artifacts and writing its summary. Nothing is committed until the
stage is fully done.

- Commit all of the stage's changes (artifacts plus summary) to the current
  branch and push to `origin`.
- Use a commit message in the form `debug <NN>: <brief summary>` (for example
  `debug 02: fix tts cancel-and-speak bug`).
- Do not commit work that is incomplete or from another stage.

## Verification of the pipeline

- Each role works only from the artifacts listed under "Inputs" in its
  instruction file.
- Each role produces only the artifacts listed under "Outputs".
- Each role writes its summary before handing off.
- No role performs the work of another role.
- No role deletes or regresses unrelated existing behavior.
- Each stage commits and pushes its work as its final step (see "Per-stage
  commits").