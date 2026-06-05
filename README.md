# qa-genai-toolkit

> QA Automation toolkit demonstrating Generative AI integration in software testing workflows — agents, prompt engineering, and LLM-assisted test generation.

**Author:** N'Koy Otshudi — [nkoyotshudi.fr](https://nkoyotshudi.fr)  
**Stack:** Playwright · TypeScript · Anthropic Claude Sonnet · GitHub Actions  
**Certification context:** ISTQB CT-GenAI (in progress)

---

## What this project demonstrates

This repo shows how a QA Automation engineer integrates Generative AI into the testing workflow — not just for code generation, but as a **structured, repeatable practice** aligned with ISTQB CT-GenAI principles:

| CT-GenAI Chapter | What's demonstrated here |
|---|---|
| Ch.1 — GenAI Foundations | LLM integration via Anthropic API, agent/tool-use patterns |
| Ch.2 — Quality Attributes | Prompt design for accuracy, consistency, relevance |
| Ch.3 — Test Design | US → test case generation with non-determinism awareness |
| Ch.5 — Prompt Engineering | System prompts, conventions injection, instruction files |
| Ch.7 — AI in Test Process | Structured human review after generation |

---

## Core workflow

User Story (Markdown)
│
▼
npm run generate
(Claude Sonnet API)
│
▼
Generated test scaffold
│
▼
QA Engineer review & refinement
│
▼
Final spec.ts committed to tests/

**Measured result on a production project:** 80%+ productivity gain on 117 automated tests using this approach.

---

## Project structure

qa-genai-toolkit/
├── .github/
│   ├── agents/
│   │   └── qa-autotest-writer.agent.md       # VS Code Copilot agent
│   ├── instructions/
│   │   └── e2e-tests.instructions.md          # Auto-applied to *.spec.ts
│   └── prompts/
│       └── new-test-from-user-story.prompt.md # Parameterized prompt
├── tests/
│   ├── e2e/                                   # Playwright E2E tests
│   ├── api/                                   # Playwright API tests
│   └── models/
│       └── TodoPage.ts                        # Page Object Model
├── scripts/
│   └── generate-tests.ts                      # US → tests via Claude API
├── examples/
│   ├── user-stories/
│   │   └── US_001_create_task.md              # Sample input
│   └── generated-tests/                       # Script output (scaffold)
├── playwright.config.ts
└── .env.example

---

## Getting started

```bash
# 1. Clone and install
git clone https://github.com/otshudi-n-koy/qa-genai-toolkit.git
cd qa-genai-toolkit
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env: add your ANTHROPIC_API_KEY

# 3. Install Playwright browsers
npx playwright install chromium

# 4. Generate tests from a user story
npm run generate examples/user-stories/US_001_create_task.md --type both

# 5. Run the test suite
npm run test:e2e
npm run test:api
```

---

## AI Agents (VS Code Copilot)

The `.github/agents/` folder contains a **specialized QA agent** for VS Code Copilot.

To use it:
1. Open VS Code with GitHub Copilot enabled
2. Open Copilot Chat
3. Select `@qa-autotest-writer`
4. Describe the feature to test — the agent applies project conventions automatically

The agent reads `.github/instructions/e2e-tests.instructions.md` before generating — same rules as the `generate-tests.ts` script. **Conventions defined once, shared across all AI tools.**

---

## Related projects

- [qa-mcp-playwright](https://github.com/otshudi-n-koy/qa-mcp-playwright) — MCP Playwright + Jira integration *(coming soon)*
- [qa-genai-evaluator](https://github.com/otshudi-n-koy/qa-genai-evaluator) — LLM output evaluation framework *(coming soon)*

---

## References

- [ISTQB CT-GenAI Syllabus](https://istqb.org)
- [Anthropic API Documentation](https://docs.anthropic.com)
- [Playwright Documentation](https://playwright.dev)