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
	skus: {
		skuCode: string;
		priceAdjustment: number;
		stockQuantity: number;
		color: string;
		size: string;
	}[];
	properties: {
		name: string;
		description: string;
		displayOrder: number;
		variants: {
			name: string;
			value: string;
			priceAdjustment: number;
			displayOrder: number;
		}[];
	}[];
}

// --- CONFIGURATION ---
const SOURCE_FOLDER = process.env.LEMASKA_SOURCE_FOLDER || path.join(__dirname, "..", "..", "_do_importu", "Lemanska");
const IMAGE_WIDTH = parseInt(process.env.LEMASKA_IMAGE_WIDTH || "800", 10);
const IMAGE_HEIGHT = parseInt(process.env.LEMASKA_IMAGE_HEIGHT || "600", 10);
const NUMBER_OF_PRODUCTS = parseInt(process.env.LEMASKA_NUMBER_OF_PRODUCTS || "5", 10); // Generate 5 new products
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
const colors = ["RED", "BLUE", "GREEN", "BLACK", "WHITE"];
const sizes = ["S", "M", "L", "XL"];

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

async function cleanGeneratedProducts() {
	console.log("--- Cleaning up previously generated products ---");
	try {
		const entries = await fs.readdir(SOURCE_FOLDER, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.isDirectory() && entry.name.startsWith("PRODUCT_LEMANSKA_")) {
				const productToRemovePath = path.join(SOURCE_FOLDER, entry.name);
				await fs.rm(productToRemovePath, { recursive: true, force: true });
				console.log(`Removed: ${productToRemovePath}`);
			}
		}
	} catch (error) {
		console.warn("Error during cleanup (might be first run):", error);
	}
}

async function generateProducts() {
	console.log("--- Starting Product Generation Script ---");
	await fs.mkdir(SOURCE_FOLDER, { recursive: true });
	await cleanGeneratedProducts(); // Clean up before generating new ones

	for (let i = 1; i <= NUMBER_OF_PRODUCTS; i++) {
		const productName = `PRODUCT_LEMANSKA_${String(i).padStart(2, "0")}`;
		const productPath = path.join(SOURCE_FOLDER, productName);

		await fs.mkdir(productPath, { recursive: true });
		console.log(`Created product folder: ${productPath}`);

		// Generate product_metadata.json with 2 unique body shapes and 2 unique style preferences
		const shuffledBodyShapes = shuffleArray([...bodyShapes]);
		const suitableFor = shuffledBodyShapes.slice(0, 2);

		const shuffledStylePreferences = shuffleArray([...stylePreferences]);
		const style = shuffledStylePreferences.slice(0, 2);

		const basePrice = parseFloat((Math.random() * (500 - 100) + 100).toFixed(2));
		const description = `This is a sample description for ${productName}.`;
		const isActive = true;

		const metadata: ProductMetadata = {
			name: productName,
			basePrice,
			description,
			isActive,
			suitableFor,
			style,
			skus: [],
			properties: [],
		};
		await fs.writeFile(path.join(productPath, "product_metadata.json"), JSON.stringify(metadata, null, 2));
		console.log(`Generated product_metadata.json for ${productName}: suitableFor=${suitableFor}, style=${style}`);

		// Select two unique colors and two unique sizes for this product's variants
		const selectedColors = shuffleArray([...colors]).slice(0, 2);
		const selectedSizes = shuffleArray([...sizes]).slice(0, 2);

		// Create WARIANTY folder and generate SKUs for all combinations
		const variantsPath = path.join(productPath, "WARIANTY");
		await fs.mkdir(variantsPath, { recursive: true });

		const skus = [];
		for (const color of selectedColors) {
			for (const size of selectedSizes) {
				const skuName = `${productName}_${color}_${size}`;
				const skuImagePath = path.join(variantsPath, `${skuName}.jpg`);
				await generateImage(`Lemanska - ${productName} - ${color} ${size}`, skuImagePath);

				const priceAdjustment = parseFloat((Math.random() * 50).toFixed(2)); // Random price adjustment up to 50
				const stockQuantity = Math.floor(Math.random() * 100) + 1; // Random stock between 1 and 100

				skus.push({
					skuCode: skuName,
					priceAdjustment,
					stockQuantity,
					color,
					size,
				});
			}
		}
		metadata.skus = skus;

		// Create WLASCIWOSCI folder and generate properties/variants
		const properties = [];
		const propertiesPath = path.join(productPath, "WLASCIWOSCI");
		await fs.mkdir(propertiesPath, { recursive: true });

		// Color property (using selectedColors)
		const colorPropertyPath = path.join(propertiesPath, "KOLOR");
		await fs.mkdir(colorPropertyPath, { recursive: true });
		const colorVariants = [];
		let colorDisplayOrder = 0;
		for (const color of selectedColors) {
			await generateImage(`Kolor: ${color}`, path.join(colorPropertyPath, `${color}.jpg`));
			colorVariants.push({
				name: color,
				value: color,
				priceAdjustment: parseFloat((Math.random() * 10).toFixed(2)),
				displayOrder: colorDisplayOrder++,
			});
		}
		properties.push({
			name: "KOLOR",
			description: "Dostępne kolory produktu.",
			displayOrder: 0,
			variants: colorVariants,
		});

		// Size property (using selectedSizes)
		const sizePropertyPath = path.join(propertiesPath, "ROZMIAR");
		await fs.mkdir(sizePropertyPath, { recursive: true });
		const sizeVariants = [];
		let sizeDisplayOrder = 0;
		for (const size of selectedSizes) {
			await generateImage(`Rozmiar: ${size}`, path.join(sizePropertyPath, `${size}.jpg`));
			sizeVariants.push({
				name: size,
				value: size,
				priceAdjustment: parseFloat((Math.random() * 20).toFixed(2)),
				displayOrder: sizeDisplayOrder++,
			});
		}
		properties.push({
			name: "ROZMIAR",
			description: "Dostępne rozmiary produktu.",
			displayOrder: 1,
			variants: sizeVariants,
		});

		metadata.properties = properties;
		await fs.writeFile(path.join(productPath, "product_metadata.json"), JSON.stringify(metadata, null, 2));
		console.log(
			`Generated product_metadata.json for ${productName}: suitableFor=${suitableFor}, style=${style}, basePrice=${basePrice}, description=${description}, isActive=${isActive}, skus=${metadata.skus.length}, properties=${metadata.properties.length}`
		);
	}

	console.log("\n--- Product Generation Finished Successfully ---");
}

generateProducts();
