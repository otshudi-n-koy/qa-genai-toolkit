---
description: "Generate a complete Playwright test suite (E2E + API) from a User Story."
---

# New Test Suite from User Story

Generate Playwright TypeScript tests for the Todo App based on a User Story.

## Inputs

- **User story file**: ${input:userStoryFile:Path to the user story (e.g. examples/user-stories/US_001_create_task.md)}
- **Test type**: ${input:testType:E2E, API, or Both}
- **Priority**: ${input:priority:Test priority — Critical, High, or Normal}

## Steps

1. Read `.github/instructions/e2e-tests.instructions.md` for conventions
2. Read the user story from `${input:userStoryFile}`
3. For each acceptance criterion, generate:
   - One happy path test
   - One negative / edge case test
   - One API test if an endpoint is involved

## Traceability (required in output)

| AC | Test name | Type |
|----|-----------|------|
| AC1 | should... | E2E |
| AC1 | POST /api/... | API |

## Output

- Complete `*.spec.ts` file ready for `tests/e2e/` or `tests/api/`
- List of Page Object methods to add in `models/TodoPage.ts`
- Assumptions made during generation