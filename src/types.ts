export interface PDFOptions {
  html: string;
  css?: string;

  // Page settings
  format?: "A4" | "A3" | "Letter" | "Legal";
  landscape?: boolean;

  // Margins
  margin?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };

  // Headers and footers
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;

  // Other options
  printBackground?: boolean;
  preferCSSPageSize?: boolean;
  scale?: number;

  // Advanced
  timeout?: number;
  waitUntil?: "load" | "domcontentloaded" | "networkidle";
}

export interface PoolOptions {
  maxBrowsers?: number;
  maxPagesPerBrowser?: number;
  browserArgs?: string[];
}

export interface GeneratorOptions extends PoolOptions {
  enablePool?: boolean;
}
