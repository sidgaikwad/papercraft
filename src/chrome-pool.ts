import { chromium } from 'playwright';
import type { Browser, BrowserContext, Page } from 'playwright';
import type { PoolOptions } from './types';

interface BrowserInstance {
  browser: Browser;
  context: BrowserContext;
  activePages: number;
  createdAt: number;
}

export class ChromePool {
  private instances: BrowserInstance[] = [];
  private maxBrowsers: number;
  private maxPagesPerBrowser: number;
  private browserArgs: string[];
  private isInitialized = false;

  constructor(options: PoolOptions = {}) {
    this.maxBrowsers = options.maxBrowsers || 3;
    this.maxPagesPerBrowser = options.maxPagesPerBrowser || 5;

    // Better Windows-compatible args
    this.browserArgs = options.browserArgs || [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-breakpad',
      '--disable-component-extensions-with-background-pages',
      '--disable-features=TranslateUI,BlinkGenPropertyTrees',
      '--disable-ipc-flooding-protection',
      '--disable-renderer-backgrounding',
      '--force-color-profile=srgb',
      '--mute-audio',
      '--disable-webgl', // Critical for Windows GPU issues
      '--disable-webgl2',
    ];
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log(`🚀 Initializing Chrome pool with ${this.maxBrowsers} browsers...`);

    // Launch browsers sequentially to avoid resource conflicts
    for (let i = 0; i < this.maxBrowsers; i++) {
      console.log(`   Launching browser ${i + 1}/${this.maxBrowsers}...`);
      await this.createBrowserInstance();
    }

    this.isInitialized = true;
    console.log('✅ Chrome pool ready');
  }

  private async createBrowserInstance(): Promise<BrowserInstance> {
    const browser = await chromium.launch({
      headless: true,
      args: this.browserArgs,
      timeout: 120000, // Increased timeout
      ignoreDefaultArgs: ['--enable-automation'], // Remove automation flag
    });

    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: null, // Don't set viewport (faster)
    });

    const instance: BrowserInstance = {
      browser,
      context,
      activePages: 0,
      createdAt: Date.now(),
    };

    this.instances.push(instance);
    return instance;
  }

  async acquirePage(): Promise<Page> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    let instance = this.instances.find((inst) => inst.activePages < this.maxPagesPerBrowser);

    if (!instance && this.instances.length < this.maxBrowsers) {
      instance = await this.createBrowserInstance();
    }

    if (!instance) {
      instance = this.instances[0];

      if (!instance) {
        throw new Error('No browser instances available in the pool');
      }
    }

    const page = await instance.context.newPage();
    instance.activePages++;

    return page;
  }

  async releasePage(page: Page): Promise<void> {
    await page.close();

    const instance = this.instances.find((inst) => inst.context === page.context());

    if (instance) {
      instance.activePages--;
    }
  }

  async close(): Promise<void> {
    console.log('🔄 Closing Chrome pool...');

    await Promise.all(
      this.instances.map(async (inst) => {
        await inst.context.close();
        await inst.browser.close();
      })
    );

    this.instances = [];
    this.isInitialized = false;
    console.log('✅ Chrome pool closed');
  }

  getStats() {
    return {
      totalBrowsers: this.instances.length,
      totalActivePages: this.instances.reduce((sum, inst) => sum + inst.activePages, 0),
      maxBrowsers: this.maxBrowsers,
      maxPagesPerBrowser: this.maxPagesPerBrowser,
    };
  }
}
