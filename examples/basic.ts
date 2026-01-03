import { generatePDF } from '../src';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory (ESM compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log('🚀 Generating basic PDF...');

  // Ensure output directory exists
  const outputDir = join(__dirname, 'output');
  mkdirSync(outputDir, { recursive: true });

  const pdf = await generatePDF({
    html: `
      <div style="padding: 40px; font-family: Arial, sans-serif;">
        <h1 style="color: #0066cc;">Hello from Papercraft!</h1>
        <p>This PDF was generated using Node.js + Playwright ⚡</p>
        <p>Generated at: ${new Date().toLocaleString()}</p>
      </div>
    `,
  });

  const outputPath = join(outputDir, 'basic-output.pdf');
  writeFileSync(outputPath, pdf);

  console.log(`✅ PDF saved to ${outputPath}`);
  console.log(`📊 Size: ${(pdf.length / 1024).toFixed(2)} KB`);
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
