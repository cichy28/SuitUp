import fs from "fs/promises";
import path from "path";

const ROOT_IMPORT_DIR = path.join(__dirname, "..", "..", "_do_importu");
const COMPANIES_TO_GENERATE = ["CompanyA", "CompanyB", "CompanyC"];
const DUMMY_IMAGE_CONTENT = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64"); // A 1x1 transparent PNG

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
  console.log(`Ensured directory: ${dirPath}`);
}

async function createDummyFile(filePath: string, content: string | Buffer = "") {
  await fs.writeFile(filePath, content);
  console.log(`Created dummy file: ${filePath}`);
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
    path.join(companyPath, "producer.metadata.json"),
    JSON.stringify(producerMetadata, null, 2)
  );

  // Create dummy logo and start screen images
  await createDummyFile(path.join(companyPath, "logo.jpg"), DUMMY_IMAGE_CONTENT);
  await createDummyFile(path.join(companyPath, "startScreen.jpg"), DUMMY_IMAGE_CONTENT);

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
      suitableFor: ["RECTANGLE"],
      style: ["FITTED_WEAR"],
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

    // Create dummy main image
    await createDummyFile(path.join(productPath, "main.jpg"), DUMMY_IMAGE_CONTENT);

    // Generate SKUs
    const skusPath = path.join(productPath, "WARIANTY");
    await ensureDir(skusPath);
    // Example SKUs based on KOLOR and ROZMIAR
    const colors = ["BLACK", "BLUE"];
    const sizes = ["S", "M"];
    for (const color of colors) {
      for (const size of sizes) {
        const skuName = `${productName}_${color}_${size}`;
        await createDummyFile(path.join(skusPath, `${skuName}.jpg`), DUMMY_IMAGE_CONTENT);
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
      await createDummyFile(path.join(propPath, `${variantName}.jpg`), DUMMY_IMAGE_CONTENT);
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
