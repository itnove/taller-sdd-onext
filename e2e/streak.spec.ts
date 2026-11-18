import { expect, test } from '@playwright/test';

// Recorrido de la racha sobre el seed (HU-01 TASK-06). La base de e2e se regenera en cada ejecución
// (playwright.config.ts), así que el seed parte siempre del mismo estado relativo a hoy.

test('Irene hace check-in, llega a 7 días y ve la felicitación (CA-02, CA-04)', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Socio').selectOption({ label: 'Irene Soler' });
  const panel = page.getByRole('status', { name: 'Tu racha' });
  await expect(panel).toContainText('6');
  await expect(panel).not.toContainText('Enhorabuena');

  await page.getByRole('button', { name: 'Hacer check-in hoy' }).click();

  await expect(page.getByText('Check-in registrado.')).toBeVisible();
  await expect(panel).toContainText('7');
  await expect(panel).toContainText('¡Enhorabuena! Ya llevas una semana o más sin fallar.');
});

test('Pau ve una racha de tres dígitos (EC-06)', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Socio').selectOption({ label: 'Pau Roig' });

  await expect(page.getByRole('status', { name: 'Tu racha' })).toContainText('120');
});

test('Tomás, sin check-ins, ve "Empieza tu racha hoy" (CA-03)', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Socio').selectOption({ label: 'Tomás Abad' });

  await expect(page.getByRole('status', { name: 'Tu racha' })).toContainText(
    'Empieza tu racha hoy',
  );
});
