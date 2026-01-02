import { chromium } from "playwright";
import type { Browser, BrowserContext, Page } from "playwright";
import type { PoolOptions } from "./types";

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
    this.browserArgs = options.browserArgs || [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-software-rasterizer",
      "--disable-extensions",
    ];
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log(
      `🚀 Initializing Chrome pool with ${this.maxBrowsers} browsers...`
    );

    for (let i = 0; i < this.maxBrowsers; i++) {
      await this.createBrowserInstance();
    }

    this.isInitialized = true;
    console.log("✅ Chrome pool ready");
  }

  private async createBrowserInstance(): Promise<BrowserInstance> {
    const browser = await chromium.launch({
      args: this.browserArgs,
      headless: true,
    });

    const context = await browser.newContext({
      javaScriptEnabled: false, // PDFs don't need JS
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

    // Find instance with capacity
    let instance = this.instances.find(
      (inst) => inst.activePages < this.maxPagesPerBrowser
    );

    // If all full, create new instance (up to max)
    if (!instance && this.instances.length < this.maxBrowsers) {
      instance = await this.createBrowserInstance();
    }

    // If still no instance, wait and use first available
    if (!instance) {
      instance = this.instances[0];
    }

    if (!instance) {
      throw new Error("No browser instance available");
    }

    const page = await instance.context.newPage();
    instance.activePages++;

    return page;
  }

  async releasePage(page: Page): Promise<void> {
    await page.close();

    // Find instance and decrement counter
    const instance = this.instances.find(
      (inst) => inst.context === page.context()
    );

    if (instance) {
      instance.activePages--;
    }
  }

  async close(): Promise<void> {
    console.log("🔄 Closing Chrome pool...");

    await Promise.all(
      this.instances.map(async (inst) => {
        await inst.context.close();
        await inst.browser.close();
      })
    );

    this.instances = [];
    this.isInitialized = false;
    console.log("✅ Chrome pool closed");
  }

  getStats() {
    return {
      totalBrowsers: this.instances.length,
      totalActivePages: this.instances.reduce(
        (sum, inst) => sum + inst.activePages,
        0
      ),
      maxBrowsers: this.maxBrowsers,
      maxPagesPerBrowser: this.maxPagesPerBrowser,
    };
  }
}
