import { PDFGenerator } from '../src';
import { writeFileSync } from 'fs';

async function main() {
  console.log('🚀 Generating multiple PDFs with browser pool...');

  const generator = new PDFGenerator({
    maxBrowsers: 3,
    maxPagesPerBrowser: 5,
  });

  await generator.initialize();

  const startTime = performance.now();

  // Generate 10 PDFs concurrently
  const promises = Array.from({ length: 10 }, async (_, i) => {
    const pdf = await generator.generate({
      html: `
        <div style="padding: 40px; text-align: center;">
          <h1>Document #${i + 1}</h1>
          <p>Generated at ${new Date().toISOString()}</p>
          <p>Using pool for blazing fast generation ⚡</p>
        </div>
      `,
    });

    writeFileSync(`output-${i + 1}.pdf`, pdf);
    console.log(`✅ Generated output-${i + 1}.pdf`);
    return pdf;
  });

  const pdfs = await Promise.all(promises);

  const duration = performance.now() - startTime;
  const totalSize = pdfs.reduce((sum, pdf) => sum + pdf.length, 0);

  console.log('\n📊 Statistics:');
  console.log(`   Files: ${pdfs.length}`);
  console.log(`   Time: ${duration.toFixed(0)}ms`);
  console.log(`   Avg: ${(duration / pdfs.length).toFixed(0)}ms per PDF`);
  console.log(`   Total Size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`   Pool Stats:`, generator.getStats());

  await generator.close();
  console.log('\n✅ All done!');
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
