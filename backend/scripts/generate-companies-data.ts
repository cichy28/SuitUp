import { BodyShape, StylePreference } from "../../shared/enums";
import { createCanvas, loadImage } from 'canvas';
import fs from "fs/promises";
import path from "path";

const ROOT_IMPORT_DIR = path.join(__dirname, "..", "_do_importu");
const COMPANIES_TO_GENERATE = ["GENERATED_Lemanska_D"];
const DUMMY_IMAGE_CONTENT = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64"); // A 1x1 transparent PNG

function getRandomTwo<T>(arr: T[]): T[] {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
}

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
  console.log(`Ensured directory: ${dirPath}`);
}

async function createDummyFile(filePath: string, content: string | Buffer = "") {
  await fs.writeFile(filePath, content);
  console.log(`Created dummy file: ${filePath}`);
}

async function generateImageWithText(text: string, width = 600, height = 600): Promise<Buffer> {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Image Background: Light gray
  ctx.fillStyle = '#e0e0e0';
  ctx.fillRect(0, 0, width, height);

  // Border: Black, thicker
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, width, height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Add text shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'; // Slightly stronger shadow
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 4;

  const padding = 60;
  const lineHeight = 1.4;
  let finalFontSize = 80;
  let finalLines: string[] = [];

  // First, try to fit on a single line
  let singleLineFontSize = finalFontSize;
  while (singleLineFontSize > 10) {
    ctx.font = `bold ${singleLineFontSize}px Arial`;
    const metrics = ctx.measureText(text);
    if (metrics.width < width - padding * 2) {
      finalFontSize = singleLineFontSize;
      finalLines = [text];
      break;
    }
    singleLineFontSize -= 1;
  }

  // If single line didn't fit, try multi-line wrapping
  if (finalLines.length === 0) {
    let currentFontSize = finalFontSize;
    while (currentFontSize > 10) {
      ctx.font = `bold ${currentFontSize}px Arial`;
      const words = text.split(' ');
      let line = '';
      let lines: string[] = [];
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > width - padding * 2 && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      const totalTextHeight = lines.length * currentFontSize * lineHeight;
      if (totalTextHeight < height - padding * 2) {
        finalFontSize = currentFontSize;
        finalLines = lines;
        break;
      } else {
        currentFontSize -= 1;
      }
    }
  }

  // Draw text background rectangle
  if (finalLines.length > 0) {
    const textHeight = finalLines.length * finalFontSize * lineHeight;
    const textWidth = Math.max(...finalLines.map(line => ctx.measureText(line.trim()).width));

    const rectX = (width - textWidth) / 2 - 10; // Add some padding around text
    const rectY = (height - textHeight) / 2 - 10; // Add some padding around text
    const rectWidth = textWidth + 20;
    const rectHeight = textHeight + 20;

    ctx.fillStyle = '#ffffff'; // White background for text
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
  }

  // Draw text
  ctx.fillStyle = '#333333'; // Dark text color
  const startY = (height - (finalLines.length - 1) * finalFontSize * lineHeight) / 2;
  for (let i = 0; i < finalLines.length; i++) {
    ctx.fillText(finalLines[i].trim(), width / 2, startY + i * finalFontSize * lineHeight);
  }

  return canvas.toBuffer('image/jpeg');
}

async function generateCompanyData(companyName: string) {
  const companyPath = path.join(ROOT_IMPORT_DIR, companyName);
  await ensureDir(companyPath);

  // Generate producer.metadata.json
  const producerMetadata = {
    companyName: companyName,
    email: `${companyName.toLowerCase()}@example.com`,
    logo: "logo.jpg",
    startScreenImage: "startScreen.jpg",
    companyData: {
      address: `123 ${companyName} St`,
      city: "GeneratedCity",
    },
  };
  await createDummyFile(
    path.join(companyPath, "producer.meta.json"),
    JSON.stringify(producerMetadata, null, 2)
  );

  // Create logo and start screen images with text
  await createDummyFile(path.join(companyPath, "logo.jpg"), await generateImageWithText(`${companyName} Logo`));
  await createDummyFile(path.join(companyPath, "startScreen.jpg"), await generateImageWithText(`${companyName} Start Screen`));

  // Generate products
  const productsPath = path.join(companyPath, "PRODUKTY");
  await ensureDir(productsPath);

  for (let i = 1; i <= 2; i++) { // Generate 2 products per company
    const productName = `PRODUCT_${companyName.toUpperCase()}_${String(i).padStart(2, "0")}`;
    const productPath = path.join(productsPath, productName);
    await ensureDir(productPath);

    // Generate product_metadata.json
    const productMetadata = {
      basePrice: 1000 + i * 100,
      suitableFor: getRandomTwo(Object.values(BodyShape.enum)),
      style: getRandomTwo(Object.values(StylePreference.enum)),
      properties: [
        {
          name: "KOLOR",
          hotspotX: 0.5,
          hotspotY: 0.5,
          variants: [
            { name: "BLACK", priceAdjustment: 0 },
            { name: "BLUE", priceAdjustment: 50 },
          ],
        },
        {
          name: "ROZMIAR",
          hotspotX: 0.2,
          hotspotY: 0.8,
          variants: [
            { name: "S", priceAdjustment: 0 },
            { name: "M", priceAdjustment: 20 },
          ],
        },
      ],
    };
    await createDummyFile(
      path.join(productPath, "product_metadata.json"),
      JSON.stringify(productMetadata, null, 2)
    );

    // Create main image with text
    await createDummyFile(path.join(productPath, "main.jpg"), await generateImageWithText(`${productName} Main`));

    // Generate SKUs
    const skusPath = path.join(productPath, "WARIANTY");
    await ensureDir(skusPath);
    // Example SKUs based on KOLOR and ROZMIAR
    const colors = ["BLACK", "BLUE"];
    const sizes = ["S", "M"];
    for (const color of colors) {
      for (const size of sizes) {
        const skuName = `${productName}_${color}_${size}`;
        await createDummyFile(path.join(skusPath, `${skuName}.jpg`), await generateImageWithText(skuName));
      }
    }
  }

  // Generate company-level properties
  const propertiesPath = path.join(companyPath, "WLASCIWOSCI");
  await ensureDir(propertiesPath);

  const globalProperties = {
    KOLOR: ["BLACK", "BLUE", "GREEN", "RED"],
    ROZMIAR: ["S", "M", "L", "XL"],
    GUZIKI: ["G1", "G2"],
  };

  for (const propName in globalProperties) {
    const propPath = path.join(propertiesPath, propName);
    await ensureDir(propPath);
    for (const variantName of globalProperties[propName as keyof typeof globalProperties]) {
      await createDummyFile(path.join(propPath, `${variantName}.jpg`), await generateImageWithText(`${propName} ${variantName}`));
    }
  }
}

async function main() {
  console.log("--- Starting Data Generation Script ---");
  console.log(`Current working directory: ${process.cwd()}`);
  console.log(`__dirname: ${__dirname}`);
  console.log(`ROOT_IMPORT_DIR: ${ROOT_IMPORT_DIR}`);
  for (const companyName of COMPANIES_TO_GENERATE) {
    console.log(`\nGenerating data for company: ${companyName}`);
    await generateCompanyData(companyName);
  }
  console.log("\n--- Data Generation Finished ---");
}

main().catch(console.error);
