import { expect, test, type Page } from '@playwright/test';

// Recorrido de la congelación sobre el seed (HU-02 TASK-07). Las fechas se calculan con el día de Madrid del
// momento de la prueba, igual que la API (DEC-07); la base de e2e se regenera en cada ejecución.

const madridToday = (): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date());

function addDays(day: string, days: number): string {
  const date = new Date(`${day}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

const ddmmyyyy = (day: string) => day.split('-').reverse().join('/');

async function freeze(page: Page, start: string, end: string) {
  await page.getByLabel('Desde').fill(start);
  await page.getByLabel('Hasta').fill(end);
  await page.getByRole('button', { name: 'Congelar' }).click();
}

test('Lucía congela hoy y mañana y ve su racha congelada (CA-04, CA-09)', async ({ page }) => {
  const today = madridToday();
  const tomorrow = addDays(today, 1);
  await page.goto('/');
  await page.getByLabel('Socio').selectOption({ label: 'Lucía Ferrer' });
  await expect(page.getByText('Te quedan 7 días para congelar este año.')).toBeVisible();

  await freeze(page, today, tomorrow);

  await expect(
    page.getByText(`Racha congelada del ${ddmmyyyy(today)} al ${ddmmyyyy(tomorrow)}.`),
  ).toBeVisible();
  const panel = page.getByRole('status', { name: 'Tu racha' });
  await expect(panel).toContainText('5');
  await expect(panel).toContainText(`Racha congelada hasta el ${ddmmyyyy(tomorrow)}`);
});

test('Tomás congela la semana que viene y la cancela (CA-04, CA-07)', async ({ page }) => {
  const start = addDays(madridToday(), 7);
  const end = addDays(start, 1);
  await page.goto('/');
  await page.getByLabel('Socio').selectOption({ label: 'Tomás Abad' });
  await freeze(page, start, end);
  const list = page.getByRole('list', { name: 'Tus congelaciones' });
  await expect(list).toContainText(`Del ${ddmmyyyy(start)} al ${ddmmyyyy(end)}`);

  await list.getByRole('button', { name: /^Cancelar/ }).click();

  await expect(page.getByText('Congelación cancelada.')).toBeVisible();
  await expect(page.getByText('No tienes ninguna congelación.')).toBeVisible();
  await expect(page.getByText('Te quedan 7 días para congelar este año.')).toBeVisible();
});

test('empezar ayer da un error junto a "Desde" y no se pierde lo escrito (CA-01)', async ({
  page,
}) => {
  const yesterday = addDays(madridToday(), -1);
  await page.goto('/');
  await page.getByLabel('Socio').selectOption({ label: 'Pau Roig' });

  await freeze(page, yesterday, madridToday());

  await expect(page.getByRole('alert')).toHaveText(
    'No se puede congelar hacia atrás: el inicio tiene que ser hoy o después.',
  );
  await expect(page.getByLabel('Desde')).toHaveValue(yesterday);
});
