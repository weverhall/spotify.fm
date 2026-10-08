import { test, expect } from '@playwright/test';

test('has spotify login link', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: /log in with spotify/i })).toHaveAttribute(
    'href',
    '/api/auth/login'
  );
});

test('search shows only matching tracks', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Global Trending Tracks' })).toBeVisible();

  const rows = page.getByRole('row').filter({ has: page.getByRole('cell') });
  const trackName = (await rows.first().getByRole('link').nth(1).textContent())!.trim();

  await page.getByRole('textbox', { name: 'Search tracks' }).fill(trackName);

  await expect(rows.first()).toContainText(trackName);
  await expect(rows.filter({ hasNotText: trackName })).toHaveCount(0);
});
