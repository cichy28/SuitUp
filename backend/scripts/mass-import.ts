import { PrismaClient, User, FileType, Product, Property, PropertyVariant, BodyShape, StylePreference } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import fetch from "node-fetch"; // Import fetch
import FormData from "form-data"; // Import FormData

// --- CONFIGURATION ---
const SOURCE_FOLDER = process.env.IMPORT_PATH || path.join(__dirname, "..", "_do_importu");
const DESTINATION_FOLDER = process.env.UPLOAD_PATH || path.join(__dirname, "..", "uploads"); // Still needed for mass-import to copy files from SOURCE_FOLDER to DESTINATION_FOLDER
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000"; // Base URL for the backend API
const TEST_USER_EMAIL = "test-importer@example.com";
const TEST_USER_COMPANY_NAME = "Test Importer";
const TEST_USER_PASSWORD = "password123";
const PROPERTIES_FOLDER_NAME = "WLASCIWOSCI";
const SKU_FOLDER_NAME = "WARIANTY";
// --------------------

const prisma = new PrismaClient();

// --- UTILITY FUNCTIONS ---
function getFileTypeEnum(extension: string): FileType {
	const upperExt = extension.toUpperCase();
	if (upperExt in FileType) return FileType[upperExt as keyof typeof FileType];
	console.warn(`Unsupported file type: ${extension}. Defaulting to JPG.`);
	return FileType.JPG;
}

async function getOrCreateMultimedia(filePath: string, ownerId: string): Promise<string> {
	const originalFilename = path.basename(filePath);
	const fileExtension = path.extname(originalFilename).replace(".", "");

	// Read the file content
	const fileBuffer = await fs.readFile(filePath);

	// Create FormData
	const formData = new FormData();
	formData.append("productImage", fileBuffer, {
		filename: originalFilename,
		contentType: `image/${fileExtension}`, // Adjust content type as needed
	});

	try {
		console.log(`  -> Uploading ${originalFilename} to ${API_BASE_URL}/api/upload`);
		const response = await fetch(`${API_BASE_URL}/api/upload`, {
			method: "POST",
			body: formData,
			// headers: formData.getHeaders() // FormData from 'form-data' package might need this
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
		}

		const uploadResponse = (await response.json()) as { url: string };
		const relativeFileUrl = uploadResponse.url; // This will be like /uploads/unique-filename.jpg

		console.log(`  -> Upload successful, relative URL: ${relativeFileUrl}`);

		const newMultimedia = await prisma.multimedia.create({
			data: {
				url: relativeFileUrl, // Store the relative URL returned by the upload endpoint
				altText: originalFilename,
				fileType: getFileTypeEnum(fileExtension),
				ownerId: ownerId,
			},
		});
		console.log(`  -> Saved multimedia record for ID: ${newMultimedia.id}`);
		return newMultimedia.id;
	} catch (error) {
		console.error(`  ❌ Error processing file ${originalFilename}:`, error);
		throw error;
	}
}

async function getOrCreateTestUser(): Promise<User> {
	let testUser = await prisma.user.findUnique({ where: { email: TEST_USER_EMAIL } });
	if (!testUser) {
		console.log(`Creating test user: ${TEST_USER_EMAIL}`);
		const hashedPassword = await bcrypt.hash(TEST_USER_PASSWORD, 10);
		testUser = await prisma.user.create({
			data: {
				email: TEST_USER_EMAIL,
				companyName: TEST_USER_COMPANY_NAME,
				password: hashedPassword,
				companyData: { name: "Test", surname: "Importer" },
			},
		});
		console.log(`Test user created with ID: ${testUser.id}`);
	}
	return testUser;
}

async function getOwner(companyPath: string): Promise<User> {
	const metadataFilePath = path.join(companyPath, "producer.meta.json");
	let producerMetadata: any = {};

	try {
		producerMetadata = JSON.parse(await fs.readFile(metadataFilePath, "utf-8"));
		console.log(`Loaded producer metadata for ${producerMetadata.companyName}`);
	} catch (e) {
		console.warn(`No producer.meta.json found or invalid for ${path.basename(companyPath)}. Assigning to test user.`);
		return getOrCreateTestUser();
	}

	let owner = await prisma.user.findFirst({ where: { email: producerMetadata.email } });

	if (!owner) {
		console.log(`Creating producer: ${producerMetadata.companyName} (${producerMetadata.email})`);
		const hashedPassword = await bcrypt.hash(TEST_USER_PASSWORD, 10);
		owner = await prisma.user.create({
			data: {
				email: producerMetadata.email,
				companyName: producerMetadata.companyName,
				password: hashedPassword,
				companyData: producerMetadata.companyData || {},
			},
		});
		console.log(`Producer created with ID: ${owner.id}`);
	}

	let logoId: string | null = owner.logoId;
	if (producerMetadata.logo) {
		logoId = await getOrCreateMultimedia(path.join(companyPath, producerMetadata.logo), owner.id);
	}

	let startScreenImageId: string | null = owner.startScreenImageId;
	if (producerMetadata.startScreenImage) {
		startScreenImageId = await getOrCreateMultimedia(
			path.join(companyPath, producerMetadata.startScreenImage),
			owner.id
		);
	}

	// Update owner with logo and startScreenImage IDs after they are created
	await prisma.user.update({
		where: { id: owner.id },
		data: {
			companyName: producerMetadata.companyName,
			companyData: producerMetadata.companyData || {},
			logoId: logoId,
			startScreenImageId: startScreenImageId,
		},
	});

	return owner;
}

async function processCompanyProperties(companyPath: string, owner: User) {
	const propertiesPath = path.join(companyPath, PROPERTIES_FOLDER_NAME);
	console.log(`
--- Processing Company-level Properties from ${propertiesPath} ---`);

	if (
		!(await fs
			.stat(propertiesPath)
			.then((s) => s.isDirectory())
			.catch(() => false))
	) {
		console.log(`No company-level properties directory found at ${propertiesPath}. Skipping.`);
		return;
	}

	const propertyFolders = await fs.readdir(propertiesPath, { withFileTypes: true });

	for (const propertyFolder of propertyFolders.filter((d) => d.isDirectory())) {
		const propertyName = propertyFolder.name;
		const propertyFullPath = path.join(propertiesPath, propertyName);
		console.log(`  Processing company property: ${propertyName}`);

		let dbProperty = await prisma.property.findFirst({
			where: { name: propertyName, ownerId: owner.id, isGlobal: true },
		});
		if (!dbProperty) {
			dbProperty = await prisma.property.create({ data: { name: propertyName, ownerId: owner.id, isGlobal: true } });
			console.log(`    Created global property: ${dbProperty.name} (ID: ${dbProperty.id})`);
		} else {
			console.log(`    Global property "${dbProperty.name}" already exists.`);
		}

		const variantFiles = await fs.readdir(propertyFullPath, { withFileTypes: true });
		for (const variantFile of variantFiles.filter((f) => f.isFile())) {
			const variantName = path.parse(variantFile.name).name;
			const imageId = await getOrCreateMultimedia(path.join(propertyFullPath, variantFile.name), owner.id);

			let dbVariant = await prisma.propertyVariant.findFirst({
				where: { name: variantName, propertyId: dbProperty.id },
			});

			if (!dbVariant) {
				dbVariant = await prisma.propertyVariant.create({
					data: { name: variantName, propertyId: dbProperty.id, imageId: imageId },
				});
				console.log(`      Created variant: ${dbVariant.name} (ID: ${dbVariant.id})`);
			} else {
				await prisma.propertyVariant.update({
					where: { id: dbVariant.id },
					data: { imageId: imageId },
				});
				console.log(`      Variant "${variantName}" already exists. Updated with Image ID: ${imageId}`);
			}
		}
	}
}

async function processProduct(productPath: string, owner: User) {
	const productName = path.basename(productPath);
	console.log(`
Processing product: ${productName}`);

	let product = await prisma.product.findFirst({ where: { name: productName, ownerId: owner.id } });

	// Metadata loading logic...
	const metadataFilePath = path.join(productPath, "product_metadata.json");
	let suitableFor: BodyShape[] = [];
	let style: StylePreference[] = [];
	let basePrice: number | undefined;
	let productPropertiesMetadata: any[] = [];

	try {
		const metadata = JSON.parse(await fs.readFile(metadataFilePath, "utf-8"));
		suitableFor = metadata.suitableFor || [];
		style = metadata.style || [];
		basePrice = metadata.basePrice;
		productPropertiesMetadata = metadata.properties || [];
	} catch (e) {
		console.warn(`No product_metadata.json found or invalid for ${productName}. Using defaults.`);
	}

	// Handle main product image
	const mainImagePath = path.join(productPath, "main.jpg"); // Assuming main image is main.jpg
	let mainImageId: string | null = null;
	try {
		mainImageId = await getOrCreateMultimedia(mainImagePath, owner.id);
	} catch (e) {
		console.warn(`Could not find or process main image for product ${productName}.`);
	}

	if (!product) {
		product = await prisma.product.create({
			data: { name: productName, basePrice: basePrice ?? 0, ownerId: owner.id, suitableFor, style, mainImageId },
		});
		console.log(`Created product: ${product.name} (ID: ${product.id})`);
	} else {
		product = await prisma.product.update({
			where: { id: product.id },
			data: { suitableFor, style, basePrice: basePrice ?? 0, mainImageId: mainImageId || product.mainImageId },
		});
		console.log(`Product "${product.name}" already exists. Updated metadata.`);
	}

	// Process product-specific properties and link them
	for (const propMeta of productPropertiesMetadata) {
		const propertyName = propMeta.name;
		const hotspotX = propMeta.hotspotX;
		const hotspotY = propMeta.hotspotY;

		const dbProperty = await prisma.property.findFirst({
			where: { name: propertyName, ownerId: owner.id, isGlobal: true },
		});

		if (!dbProperty) {
			console.warn(`  Global property "${propertyName}" not found for product ${productName}. Skipping.`);
			continue;
		}

		await prisma.productProperty.upsert({
			where: { productId_propertyId: { productId: product.id, propertyId: dbProperty.id } },
			update: { hotspotX, hotspotY },
			create: { productId: product.id, propertyId: dbProperty.id, hotspotX, hotspotY },
		});
		console.log(
			`  Linked property "${propertyName}" to product ${productName} with hotspot: (${hotspotX}, ${hotspotY})`
		);

		// Update price adjustments for variants within this product context
		if (propMeta.variants) {
			for (const variantMeta of propMeta.variants) {
				const variantName = variantMeta.name;
				const priceAdjustment = variantMeta.priceAdjustment;

				const dbVariant = await prisma.propertyVariant.findFirst({
					where: { name: variantName, propertyId: dbProperty.id },
				});

				if (dbVariant) {
					await prisma.propertyVariant.update({
						where: { id: dbVariant.id },
						data: { priceAdjustment: priceAdjustment },
					});
					console.log(
						`    Updated price adjustment for variant ${variantName} of property ${propertyName} to ${priceAdjustment}`
					);
				} else {
					console.warn(
						`    Variant "${variantName}" not found for property ${propertyName}. Skipping price adjustment.`
					);
				}
			}
		}
	}

	const skusDir = path.join(productPath, SKU_FOLDER_NAME);
	if (
		await fs
			.stat(skusDir)
			.then((s) => s.isDirectory())
			.catch(() => false)
	) {
		await processSkus(skusDir, product, owner, productPropertiesMetadata); // Pass productPropertiesMetadata
	} else {
		console.log("No SKU directory found for this product.");
	}
}

async function processSkus(
	skusPath: string,
	product: Product,
	owner: User,
	productPropertiesMetadata: any[] // New parameter
): Promise<string | null> {
	console.log(`
--- Processing SKUs from ${skusPath} ---`);
	const skuFiles = await fs.readdir(skusPath, { withFileTypes: true });
	let firstSkuImageId: string | null = null;

	// Build a map of variant names to their IDs for quick lookup
	const globalVariantMap = new Map<string, string>();
	for (const propMeta of productPropertiesMetadata) {
		const dbProperty = await prisma.property.findFirst({
			where: { name: propMeta.name, ownerId: owner.id, isGlobal: true },
		});
		if (dbProperty) {
			const dbVariants = await prisma.propertyVariant.findMany({ where: { propertyId: dbProperty.id } });
			dbVariants.forEach((v: PropertyVariant) => globalVariantMap.set(v.name, v.id));
		}
	}

	for (const skuFile of skuFiles.filter((f) => f.isFile())) {
		const skuName = path.parse(skuFile.name).name;
		const skuImagePath = path.join(skusPath, skuFile.name);
		console.log(`  Processing SKU: ${skuName}`);

		const imageId = await getOrCreateMultimedia(skuImagePath, owner.id);
		if (!firstSkuImageId) {
			firstSkuImageId = imageId; // Capture the first image ID
		}

		// Determine SKU price based on product base price and variant adjustments
		let finalSkuPrice = product.basePrice.toNumber();
		const productNameParts = product.name.split("_");
		const skuParts = skuName.split("_");
		const variantNames = skuParts.slice(productNameParts.length); // Extract variant names after product name

		for (const variantName of variantNames) {
			for (const propMeta of productPropertiesMetadata) {
				const variantMeta = propMeta.variants?.find((v: any) => v.name === variantName);
				if (variantMeta) {
					finalSkuPrice += variantMeta.priceAdjustment || 0;
					break; // Found variant in this property, move to next skuVariantName
				}
			}
		}

		let dbSku = await prisma.productSku.findFirst({ where: { skuCode: skuName, productId: product.id } });
		if (!dbSku) {
			dbSku = await prisma.productSku.create({
				data: {
					skuCode: skuName,
					productId: product.id,
					price: finalSkuPrice,
					imageId: imageId,
				},
			});
			console.log(
				`    Created SKU: ${dbSku.skuCode} (ID: ${dbSku.id}) with Image ID: ${imageId}, Price: ${finalSkuPrice}`
			);
		} else {
			await prisma.productSku.update({
				where: { id: dbSku.id },
				data: { imageId: imageId, price: finalSkuPrice },
			});
			console.log(`    SKU "${skuName}" already exists. Updated with Image ID: ${imageId}, Price: ${finalSkuPrice}`);
		}

		// Link product SKU to property variants
		for (const variantName of variantNames) {
			const variantId = globalVariantMap.get(variantName);
			if (variantId) {
				await prisma.productSkuPropertyVariant.upsert({
					where: { productSkuId_propertyVariantId: { productSkuId: dbSku.id, propertyVariantId: variantId } },
					update: {},
					create: { productSkuId: dbSku.id, propertyVariantId: variantId },
				});
				console.log(`      -> Linked variant ${variantName}`);
			} else {
				console.warn(`      Variant ${variantName} not found in global map. Skipping linking.`);
			}
		}
	}
	return firstSkuImageId;
}

async function massImport() {
	console.log("--- Starting Mass Import Script ---");
	await fs.mkdir(DESTINATION_FOLDER, { recursive: true });
	try {
		const companyFolders = await fs.readdir(SOURCE_FOLDER, { withFileTypes: true });
		for (const companyFolder of companyFolders.filter((d) => d.isDirectory())) {
			const companyPath = path.join(SOURCE_FOLDER, companyFolder.name);
			const owner = await getOwner(companyPath);

			// Process company-level properties
			await processCompanyProperties(companyPath, owner);

			const productsPath = path.join(companyPath, "PRODUKTY");
			if (
				!(await fs
					.stat(productsPath)
					.then((s) => s.isDirectory())
					.catch(() => false))
			) {
				console.warn(`No 'PRODUKTY' directory found for company ${companyFolder.name}. Skipping products.`);
				continue;
			}

			const productFolders = await fs.readdir(productsPath, { withFileTypes: true });
			for (const productFolder of productFolders.filter((d) => d.isDirectory())) {
				await processProduct(path.join(productsPath, productFolder.name), owner);
			}
		}
		console.log(`
--- Mass Import Finished Successfully ---`);
	} catch (error) {
		console.error(
			`
❌ An error occurred during mass import:`,
			error
		);
	} finally {
		await prisma.$disconnect();
	}
}

massImport();
