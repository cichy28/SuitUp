import { createCanvas } from "canvas";
import fs from "fs/promises";
import path from "path";
import { Product } from "../../shared/validators/product";
import { CreateProductSkuInput } from "../../shared/validators/productSku";
import { CreatePropertyInput } from "../../shared/validators/property";
import { PropertyVariant } from "../../shared/validators/propertyVariant";
import { z } from "zod";
import { BodyShape, StylePreference } from "../../shared/enums";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env.development") });

interface ProductMetadata extends Omit<Product, "id" | "ownerId" | "mainImageId" | "createdAt" | "updatedAt"> {
	skus: ({
		skuCode: string;
		priceMultiplier: number;
		stockQuantity: number;
	} & Record<string, string | number>)[];
	properties: {
		name: string;
		hotspotX: number;
	hotspotY: number;
		variants: {
			name: string;
			value: string;
			priceAdjustment: number;
			displayOrder: number;
		}[];
	}[];
}

interface ProducerMetadata {
	companyName: string;
	email: string;
	description: string;
	logoUrl?: string;
	startScreenImageUrl?: string;
}

// --- CONFIGURATION ---
const IMAGE_WIDTH = parseInt(process.env.LEMASKA_IMAGE_WIDTH || "800", 10);
const IMAGE_HEIGHT = parseInt(process.env.LEMASKA_IMAGE_HEIGHT || "600", 10);

interface CompanyConfig {
	companyName: string;
	companyFolder: string;
	productPrefix: string;
	numberOfProducts: number;
	email: string;
	description: string;
}

const companies: CompanyConfig[] = [
	{
		companyName: "GENERATED_Lemanska_A",
		companyFolder: path.join(__dirname, "..", "..", "_do_importu", "GENERATED_Lemanska_A"),
		productPrefix: "PRODUCT_GENERATED_A_",
		numberOfProducts: 3,
		email: "contact_a@generated.com",
		description: "High-quality custom suits and clothing from Generated Company A.",
	},
	{
		companyName: "GENERATED_Lemanska_B",
		companyFolder: path.join(__dirname, "..", "..", "_do_importu", "GENERATED_Lemanska_B"),
		productPrefix: "PRODUCT_GENERATED_B_",
		numberOfProducts: 2,
		email: "contact_b@generated.com",
		description: "Premium custom wear from Generated Company B.",
	},
	{
		companyName: "GENERATED_Lemanska_C",
		companyFolder: path.join(__dirname, "..", "..", "_do_importu", "GENERATED_Lemanska_C"),
		productPrefix: "PRODUCT_GENERATED_C_",
		numberOfProducts: 4,
		email: "contact_c@generated.com",
		description: "Exclusive designs from Generated Company C.",
	},
];
// --------------------

const bodyShapes: Array<z.infer<typeof BodyShape>> = [
	"INVERTED_TRIANGLE",
	"HOURGLASS",
	"OVAL",
	"RECTANGLE",
	"TRIANGLE",
];
const stylePreferences: Array<z.infer<typeof StylePreference>> = [
	"FITTED_WEAR",
	"OVERSIZE_WEAR",
	"RETRO_SHAPES",
	"MASCULINE_SHAPES",
];
const allPossibleProperties = [
    {
        name: "GENERATED_GUZIKI",
        hotspotX: 0.2,
        hotspotY: 0.3,
        variants: [
            { name: "G1", value: "G1", priceAdjustment: 3.11, displayOrder: 0 },
            { name: "G2", value: "G2", priceAdjustment: 16.53, displayOrder: 1 },
            { name: "G3", value: "G3", priceAdjustment: 5.00, displayOrder: 2 },
            { name: "G3", value: "G3", priceAdjustment: 5.00, displayOrder: 2 },
        ],
    },
    {
        name: "GENERATED_NOGAWKI",
        hotspotX: 0.5,
        hotspotY: 0.6,
        variants: [
            { name: "NG1", value: "NG1", priceAdjustment: 13.14, displayOrder: 0 },
            { name: "NG2", value: "NG2", priceAdjustment: 4.96, displayOrder: 1 },
            { name: "NG3", value: "NG3", priceAdjustment: 7.50, displayOrder: 2 },
            { name: "NG4", value: "NG4", priceAdjustment: 10.00, displayOrder: 3 },
        ],
    },
    {
        name: "GENERATED_KOLOR",
        hotspotX: 0.1,
        hotspotY: 0.1,
        variants: [
            { name: "RED", value: "RED", priceAdjustment: 2.00, displayOrder: 0 },
            { name: "BLUE", value: "BLUE", priceAdjustment: 3.00, displayOrder: 1 },
            { name: "GREEN", value: "GREEN", priceAdjustment: 2.50, displayOrder: 2 },
            { name: "BLACK", value: "BLACK", priceAdjustment: 4.00, displayOrder: 3 },
            { name: "WHITE", value: "WHITE", priceAdjustment: 1.50, displayOrder: 4 },
        ],
    },
    {
        name: "GENERATED_ROZMIAR",
        hotspotX: 0.8,
        hotspotY: 0.8,
        variants: [
            { name: "S", value: "S", priceAdjustment: 1.00, displayOrder: 0 },
            { name: "M", value: "M", priceAdjustment: 2.00, displayOrder: 1 },
            { name: "L", value: "L", priceAdjustment: 3.00, displayOrder: 2 },
            { name: "XL", value: "XL", priceAdjustment: 4.00, displayOrder: 3 },
        ],
    },
];

// Function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

async function generateImage(text: string, filePath: string) {
	const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
	const context = canvas.getContext("2d");

	// Fill the background
	context.fillStyle = "#f0f0f0";
	context.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

	// Set text properties
	context.font = "40px Arial";
	context.fillStyle = "#333333";
	context.textAlign = "center";
	context.textBaseline = "middle";

	// Draw the text
	context.fillText(text, IMAGE_WIDTH / 2, IMAGE_HEIGHT / 2);

	// Save the image
	const buffer = canvas.toBuffer("image/jpeg", { quality: 0.9 });
	await fs.writeFile(filePath, buffer);
	console.log(`Generated image: ${filePath}`);
}

async function generateCompanyData(config: CompanyConfig) {
	const COMPANY_FOLDER = config.companyFolder;
	const PRODUCTS_FOLDER = path.join(COMPANY_FOLDER, "PRODUKTY");
	const PROPERTIES_ROOT_FOLDER = path.join(COMPANY_FOLDER, "WLASCIWOSCI");

	console.log(`--- Starting Product Generation Script for ${config.companyName} ---`);
	await fs.mkdir(COMPANY_FOLDER, { recursive: true });
	await fs.mkdir(PRODUCTS_FOLDER, { recursive: true });
	await fs.mkdir(PROPERTIES_ROOT_FOLDER, { recursive: true });

	// Generate producer.meta.json
	const logoPath = path.join(COMPANY_FOLDER, "logo.jpg");
	const startScreenPath = path.join(COMPANY_FOLDER, "startScreen.jpg");
	await generateImage(`${config.companyName} Logo`, logoPath);
	await generateImage(`${config.companyName} Start Screen`, startScreenPath);

	const producerMetadata: ProducerMetadata = {
		companyName: config.companyName,
		email: config.email,
		description: config.description,
		logoUrl: "logo.jpg",
		startScreenImageUrl: "startScreen.jpg",
	};
	await fs.writeFile(path.join(COMPANY_FOLDER, "producer.meta.json"), JSON.stringify(producerMetadata, null, 2));
	console.log(`Generated producer.meta.json for ${config.companyName}`);

	const companyProperties = [];

	for (const prop of allPossibleProperties) {
		const propertyPath = path.join(PROPERTIES_ROOT_FOLDER, prop.name);
		await fs.mkdir(propertyPath, { recursive: true });
		for (const variant of prop.variants) {
			await generateImage(`${prop.name}: ${variant.name}`, path.join(propertyPath, `${variant.name}.jpg`));
		}
		companyProperties.push(prop);
	}

	for (let i = 1; i <= config.numberOfProducts; i++) {
		const productName = `${config.productPrefix}${String(i).padStart(2, "0")}`;
		const productPath = path.join(PRODUCTS_FOLDER, productName);

		await fs.mkdir(productPath, { recursive: true });
		console.log(`Created product folder: ${productPath}`);

		// Generate main.jpg for the product
		const mainImagePath = path.join(productPath, "main.jpg");
		await generateImage(`${config.companyName} - ${productName} - Main`, mainImagePath);

		// Generate product_metadata.json with 2 unique body shapes and 2 unique style preferences
		const shuffledBodyShapes = shuffleArray([...bodyShapes]);
		const suitableFor = shuffledBodyShapes.slice(0, 2);

		const shuffledStylePreferences = shuffleArray([...stylePreferences]);
		const style = shuffledStylePreferences.slice(0, 2);

		const basePrice = parseFloat((Math.random() * (500 - 100) + 100).toFixed(2));
		const description = `This is a sample description for ${productName} from ${config.companyName}.`;
		const isActive = true;

		const selectedProductProperties = [];
		const shuffledPossibleProperties = shuffleArray([...allPossibleProperties]);
		const numberOfProperties = Math.floor(Math.random() * shuffledPossibleProperties.length) + 1; // Select 1 to all properties

		for (let p = 0; p < numberOfProperties; p++) {
			const prop = shuffledPossibleProperties[p];
			const selectedVariants = shuffleArray([...prop.variants]).slice(0, Math.floor(Math.random() * prop.variants.length) + 1); // Select at least 1 variant
			if (selectedVariants.length > 0) {
				selectedProductProperties.push({
					...prop,
					variants: selectedVariants,
				});
			}
		}

		const metadata: ProductMetadata = {
			name: productName,
			basePrice,
			description,
			isActive,
			suitableFor,
			style,
			skus: [],
			properties: selectedProductProperties,
		};

		// Create WARIANTY folder and generate SKUs for all combinations of selected properties
		const variantsPath = path.join(productPath, "WARIANTY");
		await fs.mkdir(variantsPath, { recursive: true });

		const generateSkuCombinations = async (
			index: number,
			currentCombination: Record<string, string | number>,
			propertiesToUse: any[]
		): Promise<({ skuCode: string; priceMultiplier: number; stockQuantity: number; } & Record<string, string | number>)[]> => {
			if (index === propertiesToUse.length) {
				const skuCodeParts = [productName];
				const skuProperties: Record<string, string | number> = {};
				for (const prop of propertiesToUse) {
					skuCodeParts.push(currentCombination[prop.name] as string);
					skuProperties[prop.name] = currentCombination[prop.name];
				}
				const skuCode = skuCodeParts.join("_");

				const skuImagePath = path.join(variantsPath, `${skuCode}.jpg`);
				await generateImage(`${config.companyName} - ${productName} - ${skuCode}`, skuImagePath);

				const priceMultiplier = parseFloat((Math.random() * (1.5 - 0.5) + 0.5).toFixed(2)); // Random price multiplier between 0.5 and 1.5
				const stockQuantity = Math.floor(Math.random() * 100) + 1; // Random stock between 1 and 100

				return [{
					skuCode,
					priceMultiplier,
					stockQuantity,
					...skuProperties,
				}];
			}

			let allSkus: ({ skuCode: string; priceMultiplier: number; stockQuantity: number; } & Record<string, string | number>)[] = [];
			const currentProperty = propertiesToUse[index];
			for (const variant of currentProperty.variants) {
				const childSkus = await generateSkuCombinations(index + 1, { ...currentCombination, [currentProperty.name]: variant.value }, propertiesToUse);
				allSkus = allSkus.concat(childSkus);
			}
			return allSkus;
		};

        metadata.skus = await generateSkuCombinations(0, {}, selectedProductProperties);
        if (metadata.skus.length > 8) {
            metadata.skus = shuffleArray(metadata.skus).slice(0, 8);
        }

		await fs.writeFile(path.join(productPath, "product_metadata.json"), JSON.stringify(metadata, null, 2));
		console.log(
			`Generated product_metadata.json for ${productName}: suitableFor=${suitableFor}, style=${style}, basePrice=${basePrice}, description=${description}, isActive=${isActive}, skus=${metadata.skus.length}, properties=${metadata.properties.length}`
		);
	}

	console.log(`\n--- Product Generation Finished Successfully for ${config.companyName} ---`);
}

async function cleanGeneratedProducts() {
	console.log("--- Cleaning up previously generated products for all companies ---");
	for (const company of companies) {
		const COMPANY_FOLDER = company.companyFolder;
		const PRODUCTS_FOLDER = path.join(COMPANY_FOLDER, "PRODUKTY");
		const PROPERTIES_ROOT_FOLDER = path.join(COMPANY_FOLDER, "WLASCIWOSCI");

		try {
			// Clean up product folders
			const productEntries = await fs.readdir(PRODUCTS_FOLDER, { withFileTypes: true });
			for (const entry of productEntries) {
				if (entry.isDirectory() && entry.name.startsWith(company.productPrefix)) {
					const productToRemovePath = path.join(PRODUCTS_FOLDER, entry.name);
					await fs.rm(productToRemovePath, { recursive: true, force: true });
					console.log(`Removed product folder: ${productToRemovePath}`);
				}
			}

			// Clean up company-level properties folder
			await fs.rm(PROPERTIES_ROOT_FOLDER, { recursive: true, force: true });
			console.log(`Removed properties root folder: ${PROPERTIES_ROOT_FOLDER}`);

			// Clean up company folder if empty or only contains producer.meta.json, logo.jpg, startScreen.jpg
			const companyFolderContents = await fs.readdir(COMPANY_FOLDER);
			if (companyFolderContents.length === 0 ||
				(companyFolderContents.length <= 3 &&
					companyFolderContents.includes("producer.meta.json") &&
					companyFolderContents.includes("logo.jpg") &&
					companyFolderContents.includes("startScreen.jpg"))) {
				await fs.rm(COMPANY_FOLDER, { recursive: true, force: true });
				console.log(`Removed empty or metadata-only company folder: ${COMPANY_FOLDER}`);
			}

		} catch (error) {
			console.warn(`Error during cleanup for ${company.companyName} (might be first run or folder doesn't exist):`, error);
		}
	}
}

async function main() {
	await cleanGeneratedProducts();
	for (const company of companies) {
		await generateCompanyData(company);
	}
}

main();