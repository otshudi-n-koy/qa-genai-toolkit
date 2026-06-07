---
applyTo: "**/*.spec.ts"
---

# Test Conventions — qa-genai-toolkit

## Framework

Playwright Test with TypeScript. Chromium for E2E, `request` fixture for API tests.

## Project Structure

```
tests/
├── e2e/          # Browser-level tests (*.spec.ts)
├── api/          # API-level tests (*.spec.ts)
models/
└── TodoPage.ts   # Page Object for the Todo App
```

## Naming

| Element | Convention | Example |
|---------|-----------|---------|
| File | `{feature}-{action}.spec.ts` | `todo-create-task.spec.ts` |
| Suite | `Feature: {feature name}` | `Feature: Create Task` |
| Test | `should {expected behavior}` | `should create a task with a valid title` |
| Negative | `should not {action} when {condition}` | `should not create a task with empty title` |

## Required Structure

```typescript
/**
 * Suite: [Feature name]
 * Covers: [Acceptance criteria]
 */
test.describe('Feature: Name', () => {

  test.beforeEach(async ({ page }) => {
    // navigate, seed state if needed
  });

  test('should [expected behavior]', async ({ page/request }) => {
    // Arrange
    // Act
    // Assert
  });
});
```

## What to Test

### Happy paths
- Standard user flow completing the feature
- Boundary values (max length, min/max values)

### Edge cases & negative tests
- Empty or blank inputs → validation error visible
- Invalid data → appropriate error response
- Non-existent resources → 404

## What NOT to Test

- Implementation details (internal CSS classes)
- Third-party library behavior
- Static content that never changes