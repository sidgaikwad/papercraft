import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ChromePool } from '../src/chrome-pool';

describe('ChromePool', () => {
  let pool: ChromePool;

  beforeEach(() => {
    pool = new ChromePool({ maxBrowsers: 2 });
  });

  afterEach(async () => {
    if (pool) {
      await pool.close();
    }
  });

  it('should initialize pool', async () => {
    await pool.initialize();
    const stats = pool.getStats();

    expect(stats.totalBrowsers).toBe(2);
    expect(stats.totalActivePages).toBe(0);
  }, 60000); // 60 second timeout for browser launch

  it('should acquire and release pages', async () => {
    await pool.initialize();

    const page = await pool.acquirePage();
    expect(page).toBeDefined();

    let stats = pool.getStats();
    expect(stats.totalActivePages).toBe(1);

    await pool.releasePage(page);

    stats = pool.getStats();
    expect(stats.totalActivePages).toBe(0);
  }, 60000);

  it('should handle multiple concurrent pages', async () => {
    await pool.initialize();

    const pages = await Promise.all([pool.acquirePage(), pool.acquirePage(), pool.acquirePage()]);

    const stats = pool.getStats();
    expect(stats.totalActivePages).toBe(3);

    await Promise.all(pages.map((page) => pool.releasePage(page)));

    const finalStats = pool.getStats();
    expect(finalStats.totalActivePages).toBe(0);
  }, 60000);
});
