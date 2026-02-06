import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

const appDir = fileURLToPath(new URL('./app', import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': appDir,
      '@': appDir,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    globals: true,
  },
});
