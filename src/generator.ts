import { chromium } from 'playwright';
import type { Page } from 'playwright';
import { ChromePool } from './chrome-pool';
import type { PDFOptions, GeneratorOptions } from './types';

export class PDFGenerator {
  private pool: ChromePool | null = null;
  private enablePool: boolean;

  constructor(options: GeneratorOptions = {}) {
    this.enablePool = options.enablePool ?? true;

    if (this.enablePool) {
      this.pool = new ChromePool({
        maxBrowsers: options.maxBrowsers,
        maxPagesPerBrowser: options.maxPagesPerBrowser,
        browserArgs: options.browserArgs,
      });
    }
  }

  async initialize(): Promise<void> {
    if (this.enablePool && this.pool) {
      await this.pool.initialize();
    }
  }

  async generate(options: PDFOptions): Promise<Buffer> {
    const startTime = Date.now();

    let page: Page;

    if (this.pool) {
      page = await this.pool.acquirePage();
    } else {
      const browser = await chromium.launch({
        headless: true,
        timeout: 120000,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-webgl',
          '--disable-webgl2',
        ],
      });
      const context = await browser.newContext();
      page = await context.newPage();
    }

    try {
      const html = this.buildHTML(options.html, options.css);

      await page.setContent(html, {
        waitUntil: options.waitUntil || 'domcontentloaded',
        timeout: options.timeout || 30000,
      });

      const pdf = await page.pdf({
        format: options.format || 'A4',
        landscape: options.landscape || false,
        margin: options.margin || {
          top: '1cm',
          bottom: '1cm',
          left: '1cm',
          right: '1cm',
        },
        printBackground: options.printBackground ?? true,
        displayHeaderFooter: options.displayHeaderFooter || false,
        headerTemplate: options.headerTemplate || '',
        footerTemplate: options.footerTemplate || '',
        preferCSSPageSize: options.preferCSSPageSize || false,
        scale: options.scale || 1,
      });

      const duration = Date.now() - startTime;
      console.log(`✅ PDF generated in ${duration}ms`);

      return pdf;
    } finally {
      if (this.pool) {
        await this.pool.releasePage(page);
      } else {
        const browser = page.context().browser();
        if (browser) await browser.close();
      }
    }
  }

  private buildHTML(html: string, css?: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          ${css ? `<style>${css}</style>` : ''}
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
    }
  }

  getStats() {
    return this.pool?.getStats() || null;
  }
}
