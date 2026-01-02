import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PDFGenerator, generatePDF } from "../src";

describe("PDF Generator", () => {
  let generator: PDFGenerator;

  beforeAll(async () => {
    generator = new PDFGenerator();
    await generator.initialize();
  });

  afterAll(async () => {
    await generator.close();
  });

  it("should generate basic PDF", async () => {
    const pdf = await generator.generate({
      html: "<h1>Test</h1>",
    });

    expect(pdf).toBeInstanceOf(Buffer);
    expect(pdf.length).toBeGreaterThan(0);
  });

  it("should apply custom CSS", async () => {
    const pdf = await generator.generate({
      html: "<h1>Test</h1>",
      css: "h1 { color: red; }",
    });

    expect(pdf).toBeInstanceOf(Buffer);
  });

  it("should handle landscape orientation", async () => {
    const pdf = await generator.generate({
      html: "<h1>Landscape</h1>",
      landscape: true,
    });

    expect(pdf).toBeInstanceOf(Buffer);
  });

  it("should generate PDF with generatePDF helper", async () => {
    const pdf = await generatePDF({
      html: "<h1>Helper Test</h1>",
    });

    expect(pdf).toBeInstanceOf(Buffer);
  });
});
