import { generatePDF } from '../src';
import { writeFileSync } from 'fs';

console.log('🚀 Generating basic PDF...');

const pdf = await generatePDF({
  html: `
    <div style="padding: 40px; font-family: Arial, sans-serif;">
      <h1 style="color: #0066cc;">Hello from Papercraft!</h1>
      <p>This PDF was generated using Node.js + Playwright ⚡</p>
      <p>Generated at: ${new Date().toLocaleString()}</p>
    </div>
  `,
});

writeFileSync('basic-output.pdf', pdf);
console.log('✅ PDF saved to basic-output.pdf');
console.log(`📊 Size: ${(pdf.length / 1024).toFixed(2)} KB`);
