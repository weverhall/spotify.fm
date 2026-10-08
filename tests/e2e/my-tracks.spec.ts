import { test, expect } from '@playwright/test';

test('user tracks page redirects to home when not logged in', async ({ page }) => {
  await page.goto('/my-tracks');

  await expect(page).toHaveURL('/');
});

test('login redirects to Spotify with expected scope', async ({ request }) => {
  const response = await request.get('/api/auth/login', { maxRedirects: 0 });
  const location = new URL(response.headers()['location']);

  expect(response.status()).toBe(307);
  expect(location.origin).toBe('https://accounts.spotify.com');
  expect(location.searchParams.get('scope')).toBe('user-top-read');
  expect(location.searchParams.get('state')).toBeTruthy();
});
