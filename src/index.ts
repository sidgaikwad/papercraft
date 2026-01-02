export { PDFGenerator } from "./generator";
export { ChromePool } from "./chrome-pool";
export * from "./types";
export * from "./utils";

// Convenience function for one-off generation
import { chromium } from "playwright";
import { PDFOptions } from "./types";

/**
 * Generate a PDF without managing pool (simple use case)
 */
export async function generatePDF(options: PDFOptions): Promise<Buffer> {
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          ${options.css ? `<style>${options.css}</style>` : ""}
        </head>
        <body>${options.html}</body>
      </html>
    `;

    await page.setContent(html, {
      waitUntil: options.waitUntil || "networkidle",
      timeout: options.timeout || 30000,
    });

    const pdf = await page.pdf({
      format: options.format || "A4",
      landscape: options.landscape || false,
      margin: options.margin || {
        top: "1cm",
        bottom: "1cm",
        left: "1cm",
        right: "1cm",
      },
      printBackground: options.printBackground ?? true,
      displayHeaderFooter: options.displayHeaderFooter || false,
      headerTemplate: options.headerTemplate || "",
      footerTemplate: options.footerTemplate || "",
    });

    return pdf;
  } finally {
    await browser.close();
  }
}
