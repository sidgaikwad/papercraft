import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: [
    'playwright',
    'playwright-core',
    'chromium-bidi',
  ],
  noExternal: [],
});
