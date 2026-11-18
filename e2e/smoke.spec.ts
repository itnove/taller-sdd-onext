import { expect, test } from '@playwright/test';

test('la página carga con los socios del seed', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'GymApp' })).toBeVisible();
  const options = page.getByLabel('Socio').locator('option');
  await expect(options).toHaveText(['Irene Soler', 'Lucía Ferrer', 'Pau Roig', 'Tomás Abad']);
});
