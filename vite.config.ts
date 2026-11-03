import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    maxWorkers: 4,
    setupFiles: './src/thietLapKiemThu.ts',
    coverage: {
      provider: 'v8',
      include: ['src/features/**/*.{ts,tsx}', 'src/utils/**/*.ts'],
      exclude: ['**/*.test.{ts,tsx}'],
      reporter: ['text', 'html', 'json-summary'],
      thresholds: { lines: 70 },
    },
  },
});
