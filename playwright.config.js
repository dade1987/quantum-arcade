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

    // 2b. le tre lingue: anche qui senza sessione, perché il sito tradotto
    // deve funzionare per chi ci capita, non solo per chi è già iscritto
    {
      name: 'lingue',
      testMatch: /04-lingue\.spec\.js/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 } },
    },

    // 2c. i link: senza sessione, perché un bottone rotto lo trova per primo
    // chi arriva da fuori — e perché il guasto sta nell'indirizzo, non in chi
    // lo clicca. Serve un browser vero: metà di questi link li scrive il
    // JavaScript mentre disegna la pagina.
    {
      name: 'link',
      testMatch: /05-link\.spec\.js/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 } },
    },

    // 2d. i link dentro le lezioni: senza account la lezione non si monta, e
    // la barra di navigazione in fondo — dov'era il bottone rotto — non
    // esiste proprio. Serve la sessione salvata.
    {
      name: 'link-dentro',
      testMatch: /06-link-dentro\.spec\.js/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 900 },
        storageState: 'tests/.auth/utente.json',
      },
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
