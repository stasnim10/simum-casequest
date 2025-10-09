import { test, expect } from '@playwright/test';

const routes = [
  { path: '/#/learn', selector: 'h2, [data-testid="lesson-card"]' },
  { path: '/#/dashboard', selector: 'text=Next Best Lesson' },
  { path: '/#/case', selector: 'text=Case Simulator' },
  { path: '/#/lesson/l1', selector: 'text=Start Quiz' },
];

for (const { path, selector } of routes) {
  test(`UI regression check for ${path}`, async ({ page }) => {
    await page.goto(`https://www.casequestapp.com${path}`);
    await expect(page.locator(selector).first()).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: `screenshots${path.replaceAll('/', '_')}.png`, fullPage: true });
  });
}
