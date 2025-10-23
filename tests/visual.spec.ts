import { test, expect } from '@playwright/test';

const BASE = 'https://www.casequestapp.com';

async function goAndSettle(page, path) {
  await page.goto(`${BASE}${path}`);
  // Give motion a moment to settle and avoid flakes
  await page.waitForTimeout(350);
}

test.describe('Visual baselines', () => {
  test('Learn grid', async ({ page }) => {
    await goAndSettle(page, '/#/learn');
    await expect(page).toHaveScreenshot('learn-grid.png', { fullPage: true, maxDiffPixelRatio: 0.01 });
  });

  test('Dashboard', async ({ page }) => {
    await goAndSettle(page, '/#/dashboard');
    await expect(page).toHaveScreenshot('dashboard.png', { fullPage: true, maxDiffPixelRatio: 0.01 });
  });

  test('Case simulator', async ({ page }) => {
    await goAndSettle(page, '/#/case');
    await expect(page).toHaveScreenshot('case-simulator.png', { fullPage: true, maxDiffPixelRatio: 0.01 });
  });

  test('Case simulator with voice mode', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('cq_voice_consent', '1');
    });
    await goAndSettle(page, '/#/case');
    await page.getByLabel('Voice Input').check();
    await page.getByLabel('Voice Output').check();
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot('case-simulator-voice.png', { fullPage: true, maxDiffPixelRatio: 0.01 });
  });

  test('Market sizing module', async ({ page }) => {
    await goAndSettle(page, '/#/market-sizing');
    await expect(page).toHaveScreenshot('market-sizing.png', { fullPage: true, maxDiffPixelRatio: 0.01 });
  });

  test('Lesson L1', async ({ page }) => {
    await goAndSettle(page, '/#/lesson/l1');
    await expect(page).toHaveScreenshot('lesson-l1.png', { fullPage: true, maxDiffPixelRatio: 0.01 });
  });
});
