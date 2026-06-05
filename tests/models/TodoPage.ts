import { type Page, type Locator } from '@playwright/test';

export class TodoPage {
  private readonly page: Page;

  // ── Sélecteurs ──────────────────────────────────────────────────────────
  private readonly titleInput: Locator;
  private readonly dueDateInput: Locator;
  private readonly prioritySelect: Locator;
  private readonly addTaskButton: Locator;
  private readonly validationError: Locator;
  private readonly taskCounter: Locator;

  constructor(page: Page) {
    this.page         = page;
    this.titleInput   = page.locator('[data-testid="task-title-input"]');
    this.dueDateInput = page.locator('[data-testid="task-due-date-input"]');
    this.prioritySelect  = page.locator('[data-testid="task-priority-select"]');
    this.addTaskButton   = page.locator('[data-testid="add-task-button"]');
    this.validationError = page.locator('[data-testid="validation-error"]');
    this.taskCounter     = page.locator('[data-testid="active-task-count"]');
  }

// ── Navigation ────────────────────────────────────────────────────────
  async navigate() {
    await this.page.goto(process.env.BASE_URL ?? 'http://localhost:3000');
  }

  // ── Actions ───────────────────────────────────────────────────────────
  async addTask(title: string) {
    await this.titleInput.fill(title);
    await this.addTaskButton.click();
  }

  async addTaskWithDetails(
    title: string,
    dueDate?: string,
    priority?: 'low' | 'medium' | 'high'
  ) {
    await this.titleInput.fill(title);

    if (dueDate) {
      await this.dueDateInput.fill(dueDate);
    }

    if (priority) {
      await this.prioritySelect.selectOption(priority);
    }

    await this.addTaskButton.click();
  }

  async filterByStatus(status: 'all' | 'active' | 'completed') {
    await this.page
      .locator(`[data-testid="filter-${status}"]`)
      .click();
  }

  // ── Queries ───────────────────────────────────────────────────────────
  getTaskByTitle(title: string): Locator {
    return this.page
      .locator(`[data-testid="task-item"]:has-text("${title}")`);
  }

  getTaskDueDate(title: string): Locator {
    return this.getTaskByTitle(title)
      .locator('[data-testid="task-due-date"]');
  }

  getTaskPriority(title: string): Locator {
    return this.getTaskByTitle(title)
      .locator('[data-testid="task-priority"]');
  }

  getValidationError(): Locator {
    return this.validationError;
  }

  async getActiveTaskCount(): Promise<number> {
    const text = await this.taskCounter.textContent();
    return parseInt(text?.replace(/\D/g, '') ?? '0', 10);
  }
}