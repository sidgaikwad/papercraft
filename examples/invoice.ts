import { generatePDF } from '../src';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', sans-serif;
      padding: 40px;
      color: #333;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #0066cc;
      padding-bottom: 20px;
      margin-bottom: 40px;
    }
    .header h1 {
      color: #0066cc;
      font-size: 36px;
    }
    .invoice-number {
      text-align: right;
      color: #666;
    }
    .details {
      margin-bottom: 40px;
    }
    .details-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
    }
    th {
      background: #f5f5f5;
      padding: 12px;
      text-align: left;
      font-weight: bold;
      border-bottom: 2px solid #ddd;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    .total-section {
      text-align: right;
      margin-top: 20px;
    }
    .total-row {
      display: flex;
      justify-content: flex-end;
      padding: 8px 0;
    }
    .total-label {
      width: 150px;
      font-weight: bold;
    }
    .total-value {
      width: 150px;
      text-align: right;
    }
    .grand-total {
      font-size: 20px;
      color: #0066cc;
      border-top: 2px solid #0066cc;
      padding-top: 8px;
      margin-top: 8px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #666;
      font-size: 12px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>INVOICE</h1>
      <p style="color: #666; margin-top: 5px;">Your Company Name</p>
    </div>
    <div class="invoice-number">
      <p style="font-size: 24px; font-weight: bold;">#INV-001</p>
      <p>Date: ${new Date().toLocaleDateString()}</p>
    </div>
  </div>

  <div class="details">
    <div class="details-row">
      <div>
        <strong>Bill To:</strong><br>
        John Doe<br>
        123 Main Street<br>
        New York, NY 10001
      </div>
      <div style="text-align: right;">
        <strong>From:</strong><br>
        Your Company<br>
        456 Business Ave<br>
        San Francisco, CA 94102
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Unit Price</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Professional Services</td>
        <td style="text-align: center;">10</td>
        <td style="text-align: right;">$150.00</td>
        <td style="text-align: right;">$1,500.00</td>
      </tr>
      <tr>
        <td>Consulting Fee</td>
        <td style="text-align: center;">5</td>
        <td style="text-align: right;">$200.00</td>
        <td style="text-align: right;">$1,000.00</td>
      </tr>
      <tr>
        <td>Software License</td>
        <td style="text-align: center;">1</td>
        <td style="text-align: right;">$500.00</td>
        <td style="text-align: right;">$500.00</td>
      </tr>
    </tbody>
  </table>

  <div class="total-section">
    <div class="total-row">
      <div class="total-label">Subtotal:</div>
      <div class="total-value">$3,000.00</div>
    </div>
    <div class="total-row">
      <div class="total-label">Tax (10%):</div>
      <div class="total-value">$300.00</div>
    </div>
    <div class="total-row grand-total">
      <div class="total-label">Total:</div>
      <div class="total-value">$3,300.00</div>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for your business!</p>
    <p>Payment due within 30 days. Please include invoice number with payment.</p>
  </div>
</body>
</html>
`;

async function main() {
  console.log('📄 Generating invoice...');

  // Ensure output directory exists
  const outputDir = join(__dirname, 'output');
  mkdirSync(outputDir, { recursive: true });

  const pdf = await generatePDF({
    html: invoiceHTML,
    format: 'A4',
    margin: {
      top: '1cm',
      bottom: '1cm',
      left: '1.5cm',
      right: '1.5cm',
    },
  });

  const outputPath = join(outputDir, 'invoice.pdf');
  writeFileSync(outputPath, pdf);

  console.log(`✅ Invoice saved to ${outputPath}`);
  console.log(`📊 Size: ${(pdf.length / 1024).toFixed(2)} KB`);
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
