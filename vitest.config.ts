import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['static/questions/qu*/execute.test.ts'],
  },
});
