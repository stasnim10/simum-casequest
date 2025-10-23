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

test('Voice toggles visible on case simulator', async ({ page }) => {
  await page.goto('https://www.casequestapp.com/#/case');
  await page.waitForTimeout(1000); // Wait for React to render
  await expect(page.getByLabel('Voice Input')).toBeVisible({ timeout: 10000 });
  await expect(page.getByLabel('Voice Output')).toBeVisible({ timeout: 10000 });
});
