import { generatePDF, PDFGenerator } from './dist/index.js';
import { writeFileSync } from 'fs';

async function testSimple() {
  console.log('🧪 Testing simple PDF generation...');

  const pdf = await generatePDF({
    html: `
      <h1>Test PDF</h1>
      <p>Generated at ${new Date().toISOString()}</p>
    `,
    css: `
      body { font-family: Arial; padding: 40px; }
      h1 { color: #0066cc; }
    `,
  });

  writeFileSync('test-simple.pdf', pdf);
  console.log('✅ Simple PDF saved to test-simple.pdf');
}

async function testPool() {
  console.log('\n🧪 Testing with browser pool...');

  const generator = new PDFGenerator({ maxBrowsers: 2 });
  await generator.initialize();

  const start = Date.now();

  // Generate 5 PDFs concurrently
  const promises = Array.from({ length: 5 }, (_, i) =>
    generator
      .generate({
        html: `<h1>PDF #${i + 1}</h1>`,
      })
      .then((pdf: Buffer) => {
        writeFileSync(`test-pool-${i + 1}.pdf`, pdf);
        console.log(`✅ Generated test-pool-${i + 1}.pdf`);
      })
  );

  await Promise.all(promises);

  const duration = Date.now() - start;
  console.log(`\n⏱️  Generated 5 PDFs in ${duration}ms`);
  console.log('📊 Pool stats:', generator.getStats());

  await generator.close();
}

async function main() {
  try {
    await testSimple();
    await testPool();
    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

main();
