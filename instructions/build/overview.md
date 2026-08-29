7. Detailed Role Definitions
7.1 Concept / Seed
Purpose: Define the product at a high level.
Inputs: Jarad and Lior discussion; agreed product constraints.
Outputs: A concise concept artifact stating product purpose, user, major capabilities, and initial constraints..
Boundaries: No API routes, packages, schemas, or code structure.
7.2 Feature Decomposition
Purpose: Break the approved concept into manageable product capabilities.
Inputs: Approved concept.
Outputs: A feature list such as Lesson Catalog, Vocabulary Data, Learn Mode, Quiz Mode, Exam Mode, Score/Attempt Persistence, and Navigation..
Boundaries: Defines what capabilities exist, not how they are technically implemented.
7.3 Feature Brief Writer
Purpose: Describe each feature behaviorally and explicitly.
Inputs: Approved concept; feature list.
Outputs: A short brief per feature covering purpose, expected behavior, inputs/outputs, user-visible behavior, constraints, and basic acceptance expectations..
Boundaries: No filenames, Python classes, SQL queries, or implementation code.
7.4 System Engineer
Purpose: Define a reproducible development/runtime environment.
Inputs: Approved feature briefs; selected technical stack.
Outputs: requirements.txt; Python/runtime assumptions; install.sh; run.sh; environment notes.
Boundaries: Owns setup and environment. Does not define product behavior or implement application features.
7.5 Architect
Purpose: Translate product requirements into a technical specification: the shape of the code without the code itself.
Inputs: Concept; feature briefs; environment definition.
Outputs: Project/file structure; module boundaries; data model and SQLite schema; API contracts; backend/frontend responsibilities; component interactions.
Boundaries: Does not implement application code and should not silently rewrite product requirements.
7.6 Backend Engineer
Purpose: Implement the backend according to approved specifications.
Inputs: Feature briefs; architecture specification; environment definition.
Outputs: FastAPI application; SQLite persistence; API endpoints; backend application logic.
Boundaries: Does not redefine requirements, redesign unrelated architecture, or independently change frontend contracts.
7.7 Frontend Engineer
Purpose: Implement the browser interface against approved product behavior and API contracts.
Inputs: Feature briefs; architecture specification; backend/API contract.
Outputs: HTML; CSS; JavaScript; Bootstrap interface.
Boundaries: Does not redesign APIs, silently change requirements, or redefine architecture.
7.8 Verification Engineer
Purpose: Perform bounded observation and evidence gathering after implementation.
Inputs: Completed application; environment scripts; approved specifications; predefined verification checklist.
Outputs: A pass/fail verification report with recorded failures and evidence..
Boundaries: Does not repair code, modify requirements, redesign architecture, or autonomously loop.
7.9 Project Manager / Documentation
Purpose: Close out the development pass and document what actually happened.
Inputs: Original concept; feature briefs; implementation; verification report.
Outputs: README.md; implementation summary; status; known issues; verification results; possible next actions.
Boundaries: Documents the state of the project; does not retroactively repair or redefine upstream work.

