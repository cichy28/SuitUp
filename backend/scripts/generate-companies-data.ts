import { BodyShape, StylePreference } from "../../shared/enums";
// import { createCanvas, loadImage } from 'canvas';
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

async function generateDummyImage(text: string, width = 600, height = 600): Promise<Buffer> {
  // Returns a simple 1x1 transparent PNG.
  // The actual image content is not dynamically generated for simplicity.
  return DUMMY_IMAGE_CONTENT;
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
  await createDummyFile(path.join(companyPath, "logo.jpg"), await generateDummyImage(`${companyName} Logo`));
  await createDummyFile(path.join(companyPath, "startScreen.jpg"), await generateDummyImage(`${companyName} Start Screen`));

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
    await createDummyFile(path.join(productPath, "main.jpg"), await generateDummyImage(`${productName} Main`));

    // Generate SKUs
    const skusPath = path.join(productPath, "WARIANTY");
    await ensureDir(skusPath);
    // Example SKUs based on KOLOR and ROZMIAR
    const colors = ["BLACK", "BLUE"];
    const sizes = ["S", "M"];
    for (const color of colors) {
      for (const size of sizes) {
        const skuName = `${productName}_${color}_${size}`;
        await createDummyFile(path.join(skusPath, `${skuName}.jpg`), await generateDummyImage(skuName));
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
      await createDummyFile(path.join(propPath, `${variantName}.jpg`), await generateDummyImage(`${propName} ${variantName}`));
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
