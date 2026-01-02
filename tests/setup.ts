// Bun test setup file
import { beforeAll, afterAll } from 'bun:test';

// Global test setup
beforeAll(() => {
  console.log('🧪 Starting tests...');
});

afterAll(() => {
  console.log('✅ Tests complete!');
});
