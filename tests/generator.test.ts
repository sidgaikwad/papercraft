import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { PDFGenerator, generatePDF } from '../src';

describe('PDF Generator', () => {
  let generator: PDFGenerator;

  beforeAll(async () => {
    generator = new PDFGenerator({ maxBrowsers: 2 });
    await generator.initialize();
  });

  afterAll(async () => {
    await generator.close();
  });

  it('should generate basic PDF', async () => {
    const pdf = await generator.generate({
      html: '<h1>Test PDF</h1>',
    });

    expect(pdf).toBeInstanceOf(Buffer);
    expect(pdf.length).toBeGreaterThan(0);

    // Optional: save for manual inspection
    // writeFileSync('tests/output/basic.pdf', pdf);
  });

  it('should apply custom CSS', async () => {
    const pdf = await generator.generate({
      html: '<h1>Styled PDF</h1>',
      css: 'h1 { color: red; font-size: 48px; }',
    });

    expect(pdf).toBeInstanceOf(Buffer);
    expect(pdf.length).toBeGreaterThan(0);
  });

  it('should handle landscape orientation', async () => {
    const pdf = await generator.generate({
      html: '<h1>Landscape PDF</h1>',
      landscape: true,
    });

    expect(pdf).toBeInstanceOf(Buffer);
  });

  it('should support different page formats', async () => {
    const formats = ['A4', 'Letter', 'Legal', 'A3'] as const;

    for (const format of formats) {
      const pdf = await generator.generate({
        html: `<h1>${format} Format</h1>`,
        format,
      });

      expect(pdf).toBeInstanceOf(Buffer);
      expect(pdf.length).toBeGreaterThan(0);
    }
  });

  it('should generate PDF with margins', async () => {
    const pdf = await generator.generate({
      html: '<h1>PDF with Margins</h1>',
      margin: {
        top: '2cm',
        bottom: '2cm',
        left: '2cm',
        right: '2cm',
      },
    });

    expect(pdf).toBeInstanceOf(Buffer);
  });
});

describe('generatePDF helper', () => {
  it('should generate PDF without pool', async () => {
    const pdf = await generatePDF({
      html: '<h1>Simple PDF</h1>',
    });

    expect(pdf).toBeInstanceOf(Buffer);
    expect(pdf.length).toBeGreaterThan(0);
  });

  it('should handle complex HTML', async () => {
    const html = `
      <div style="padding: 40px;">
        <h1>Complex Document</h1>
        <table>
          <tr><th>Item</th><th>Price</th></tr>
          <tr><td>Item 1</td><td>$10</td></tr>
          <tr><td>Item 2</td><td>$20</td></tr>
        </table>
      </div>
    `;

    const pdf = await generatePDF({ html });

    expect(pdf).toBeInstanceOf(Buffer);
    expect(pdf.length).toBeGreaterThan(0);
  });
});
