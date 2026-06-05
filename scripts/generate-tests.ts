#!/usr/bin/env ts-node

import * as dotenv from 'dotenv';
dotenv.config({ path: require('path').join(__dirname, '../.env') });
import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const CONVENTIONS_PATH = path.join(
  __dirname,
  '../.github/instructions/e2e-tests.instructions.md'
);

function buildSystemPrompt(conventions: string): string {
  return `You are an expert QA Automation engineer specializing in Playwright TypeScript.
Your task is to generate complete, production-ready test files from User Stories.

## Project conventions (MUST follow):
${conventions}

## Critical rules:
- Output ONLY valid TypeScript code — no markdown fences, no explanation text
- Every test must be independent (no shared state between tests)
- Follow Arrange → Act → Assert pattern in every test
- Use Page Object Model for E2E: import from '../models/TodoPage'
- Use request fixture for API tests
- Include a JSDoc header with US reference and AC traceability
- Generate both happy path AND negative/edge case tests`;
}

function buildUserPrompt(
  userStory: string,
  testType: 'e2e' | 'api' | 'both'
): string {
  const typeInstruction = {
    e2e: 'Generate ONLY E2E Playwright tests (browser-level, using Page Object Model).',
    api: 'Generate ONLY API tests (using Playwright request fixture).',
    both: 'Generate BOTH E2E and API tests. Separate them with comments: // ===== E2E TESTS ===== and // ===== API TESTS =====',
  }[testType];

  return `${typeInstruction}

Here is the User Story to convert into tests:

---
${userStory}
---

Generate the complete Playwright TypeScript test file now.`;
}

async function generateTests(
  userStoryPath: string,
  testType: 'e2e' | 'api' | 'both'
) {
  if (!fs.existsSync(userStoryPath)) {
    console.error(`❌ User story file not found: ${userStoryPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(CONVENTIONS_PATH)) {
    console.error(`❌ Conventions file not found: ${CONVENTIONS_PATH}`);
    process.exit(1);
  }

  const userStory = fs.readFileSync(userStoryPath, 'utf-8');
  const conventions = fs.readFileSync(CONVENTIONS_PATH, 'utf-8');
  const usFilename = path.basename(userStoryPath, '.md');

  console.log(`\n🤖 Generating ${testType.toUpperCase()} tests for: ${usFilename}`);
  console.log('📡 Calling Claude Sonnet API...\n');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 4000,
    system: buildSystemPrompt(conventions),
    messages: [
      {
        role: 'user',
        content: buildUserPrompt(userStory, testType),
      },
    ],
  });

  const generatedCode = message.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as { type: 'text'; text: string }).text)
    .join('\n');

  const outputDir = path.join(__dirname, '../examples/generated-tests');
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${usFilename}_generated.spec.ts`);
  fs.writeFileSync(outputPath, generatedCode, 'utf-8');

  console.log(`✅ Tests generated: ${outputPath}`);
  console.log(`📊 Tokens: ${message.usage.input_tokens} in / ${message.usage.output_tokens} out`);
  console.log('\n⚠️  Review before committing:');
  console.log('   - Fill in any // TODO comments');
  console.log('   - Verify selectors match your app');
}

// ── CLI ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const userStoryFile = args[0];
const typeFlag = args.indexOf('--type');
const testType = (typeFlag !== -1 ? args[typeFlag + 1] : 'both') as
  'e2e' | 'api' | 'both';

if (!userStoryFile) {
  console.error(
    'Usage: npx ts-node scripts/generate-tests.ts <user-story.md> [--type e2e|api|both]'
  );
  process.exit(1);
}

generateTests(path.resolve(userStoryFile), testType).catch((err) => {
  console.error('❌ Generation failed:', err.message);
  process.exit(1);
});