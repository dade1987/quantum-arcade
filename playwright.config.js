import { defineConfig, devices } from '@playwright/test';

/**
 * Configurazione dei test end-to-end.
 *
 * I test girano contro il server Laravel, che serve sia il gioco sia le API:
 * è esattamente la configurazione di produzione (un dominio solo), quindi
 * quello che passa qui passa anche online.
 */
export default defineConfig({
  testDir: './tests/js/e2e',
  timeout: 40_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,           // il database è uno solo: i test si pestano i piedi
  workers: 1,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'tests/report', open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:8010',
    locale: 'it-IT',
    timezoneId: 'Europe/Rome',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    // 1. crea l'account di collaudo e salva la sessione
    { name: 'setup', testMatch: /00-setup\.spec\.js/ },

    // 2. percorso utente: parte da zero, senza sessione
    {
      name: 'percorso',
      testMatch: /0[13]-.*\.spec\.js/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 } },
    },

    // 3. audit grafico: usa la sessione salvata, così entra in tutti i livelli
    {
      name: 'grafica',
      testMatch: /02-grafica\.spec\.js/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 900 },
        storageState: 'tests/.auth/utente.json',
      },
    },

    // 4. stesso audit su telefono
    {
      name: 'telefono',
      testMatch: /02-grafica\.spec\.js/,
      dependencies: ['setup'],
      use: { ...devices['Pixel 7'], storageState: 'tests/.auth/utente.json' },
    },
  ],

  webServer: {
    command: 'php artisan serve --port=8010',
    url: 'http://127.0.0.1:8010/api/auth/me',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
