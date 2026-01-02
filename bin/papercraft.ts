#!/usr/bin/env node

import { generatePDF } from '../dist/index.js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

interface CLIArgs {
  input?: string;
  output?: string;
  format?: 'A4' | 'Letter';
  landscape?: boolean;
  help?: boolean;
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const parsed: CLIArgs = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--input' || arg === '-i') {
      if (i + 1 < args.length) parsed.input = args[++i];
    } else if (arg === '--output' || arg === '-o') {
      if (i + 1 < args.length) parsed.output = args[++i];
    } else if (arg === '--format' || arg === '-f') {
      if (i + 1 < args.length) parsed.format = args[++i] as 'A4' | 'Letter';
    } else if (arg === '--landscape' || arg === '-l') {
      parsed.landscape = true;
    }
  }

  return parsed;
}

function showHelp() {
  console.log(`
📄 PDF Forge - Fast PDF generation from HTML

Usage:
  pdf-forge -i <input.html> -o <output.pdf>

Options:
  -i, --input <file>      Input HTML file (required)
  -o, --output <file>     Output PDF file (default: output.pdf)
  -f, --format <format>   Page format: A4 or Letter (default: A4)
  -l, --landscape         Use landscape orientation
  -h, --help              Show this help message

Examples:
  pdf-forge -i invoice.html -o invoice.pdf
  pdf-forge -i report.html -o report.pdf --landscape
  pdf-forge -i page.html -f Letter

Documentation:
  https://github.com/yourcompany/pdf-forge
  `);
}

async function main() {
  const args = parseArgs();

  if (args.help || !args.input) {
    showHelp();
    process.exit(args.help ? 0 : 1);
  }

  try {
    console.log('📄 Reading HTML file...');
    const htmlPath = resolve(process.cwd(), args.input!);
    const html = readFileSync(htmlPath, 'utf-8');

    console.log('🔨 Generating PDF...');
    const startTime = Date.now();

    const pdf = await generatePDF({
      html,
      format: args.format || 'A4',
      landscape: args.landscape || false,
    });

    const outputPath = resolve(process.cwd(), args.output || 'output.pdf');
    writeFileSync(outputPath, pdf);

    const duration = Date.now() - startTime;
    const size = (pdf.length / 1024).toFixed(2);

    console.log(`✅ PDF generated successfully!`);
    console.log(`   File: ${outputPath}`);
    console.log(`   Size: ${size} KB`);
    console.log(`   Time: ${duration}ms`);
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }
}

main();
