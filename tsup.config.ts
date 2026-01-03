import { defineConfig } from 'tsup';

export default defineConfig([
  // Library build
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    splitting: false,
    sourcemap: true,
    external: [
      'playwright',
      'playwright-core',
      'chromium-bidi',
    ],
  },
  // CLI build
  {
    entry: ['bin/papercraft.ts'],
    format: ['cjs'],
    outDir: 'dist/bin',
    clean: false,
    splitting: false,
    external: [
      'playwright',
      'playwright-core',
      'chromium-bidi',
    ],
    banner: {
      js: '#!/usr/bin/env node',
    },
  },
]);
