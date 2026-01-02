import { PDFGenerator } from "../src";
import { writeFileSync } from "fs";

async function main() {
  // Create generator with pool
  const generator = new PDFGenerator({
    maxBrowsers: 3,
    maxPagesPerBrowser: 5,
  });

  await generator.initialize();

  console.log("Generating multiple PDFs...");

  // Generate multiple PDFs concurrently
  const promises = [];

  for (let i = 1; i <= 10; i++) {
    promises.push(
      generator
        .generate({
          html: `
          <div style="text-align: center; padding: 100px;">
            <h1>Invoice #${i}</h1>
            <p>Generated at ${new Date().toISOString()}</p>
          </div>
        `,
        })
        .then((pdf) => {
          writeFileSync(`invoice-${i}.pdf`, pdf);
          console.log(`✅ Generated invoice-${i}.pdf`);
        })
    );
  }

  await Promise.all(promises);

  console.log("\n📊 Pool Stats:", generator.getStats());

  await generator.close();
  console.log("\n✅ All done!");
}

main();
