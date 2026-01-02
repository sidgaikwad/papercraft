import { generatePDF } from "../src";
import { writeFileSync } from "fs";

async function main() {
  console.log("Generating basic PDF...");

  const pdf = await generatePDF({
    html: `
      <h1>Hello World!</h1>
      <p>This is a simple PDF generated from HTML.</p>
    `,
    css: `
      body {
        font-family: Arial, sans-serif;
        padding: 40px;
      }
      h1 {
        color: #333;
      }
    `,
  });

  writeFileSync("basic.pdf", pdf);
  console.log("✅ PDF saved to basic.pdf");
}

main();
