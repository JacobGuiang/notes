import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/notes-app',
  },
  screenshotOnRunFailure: false,
});
