import { PrismaClient, User, FileType, Product, Property, BodyShape, StylePreference } from "@prisma/client";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

// --- CONFIGURATION ---
const SOURCE_FOLDER = path.join(__dirname, "..", "..", "_do_importu");
const DESTINATION_FOLDER = path.join(__dirname, "..", "uploads");
const PUBLIC_URL_BASE = "http://localhost:3000/uploads";
const TEST_USER_EMAIL = "test-importer@example.com";
const TEST_USER_COMPANY_NAME = "Test Importer";
const TEST_USER_PASSWORD = "password123";
const PROPERTIES_FOLDER_NAME = "WLASCIWOSCI";
const SKU_FOLDER_NAME = "WARIANTY";
// --------------------

const prisma = new PrismaClient();

// --- UTILITY FUNCTIONS (getOrCreateUser, getOwner, etc.) ---
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

async function getOwner(companyName: string): Promise<User> {
	if (!companyName) return getOrCreateTestUser();
	const owner = await prisma.user.findFirst({ where: { companyName: { equals: companyName, mode: "insensitive" } } });
	if (owner) {
		console.log(`Owner found for company "${companyName}": ${owner.email} (ID: ${owner.id})`);
		return owner;
	}
	console.log(`No owner found for company "${companyName}". Assigning to test user.`);
	return getOrCreateTestUser();
}

function getFileTypeEnum(extension: string): FileType {
	const upperExt = extension.toUpperCase();
	if (upperExt in FileType) return FileType[upperExt as keyof typeof FileType];
	console.warn(`Unsupported file type: ${extension}. Defaulting to JPG.`);
	return FileType.JPG;
}

async function getOrCreateMultimedia(filePath: string, ownerId: string): Promise<string> {
	const originalFilename = path.basename(filePath);
	const fileExtension = path.extname(originalFilename).replace(".", "");
	const uniqueFilename = `${uuidv4()}.${fileExtension}`;
	const destinationPath = path.join(DESTINATION_FOLDER, uniqueFilename);
	await fs.copyFile(filePath, destinationPath);
	const newMultimedia = await prisma.multimedia.create({
		data: {
			url: `${PUBLIC_URL_BASE}/${uniqueFilename}`,
			altText: originalFilename,
			fileType: getFileTypeEnum(fileExtension),
			ownerId: ownerId,
		},
	});
	console.log(`  -> Copied and saved: ${originalFilename} as ID: ${newMultimedia.id}`);
	return newMultimedia.id;
}

// --- CORE IMPORT LOGIC ---

async function processProperties(
	propertiesPath: string,
	product: Product,
	owner: User,
	variantMap: Map<string, string>
) {
	console.log(`\n--- Phase 1: Processing Properties from ${propertiesPath} ---`);
	const propertyFolders = await fs.readdir(propertiesPath, { withFileTypes: true });

	for (const propertyFolder of propertyFolders.filter((d) => d.isDirectory())) {
		const propertyName = propertyFolder.name;
		const propertyPath = path.join(propertiesPath, propertyName);
		console.log(`  Processing property: ${propertyName}`);

		let dbProperty = await prisma.property.findFirst({ where: { name: propertyName, ownerId: owner.id } });
		if (!dbProperty) {
			dbProperty = await prisma.property.create({ data: { name: propertyName, ownerId: owner.id } });
			console.log(`    Created property: ${dbProperty.name} (ID: ${dbProperty.id})`);
		} else {
			console.log(`    Property "${dbProperty.name}" already exists.`);
		}

		await prisma.productProperty.upsert({
			where: { productId_propertyId: { productId: product.id, propertyId: dbProperty.id } },
			update: {},
			create: { productId: product.id, propertyId: dbProperty.id },
		});

		const variantFiles = await fs.readdir(propertyPath, { withFileTypes: true });
		for (const variantFile of variantFiles.filter((f) => f.isFile())) {
			const variantName = path.parse(variantFile.name).name;
			let dbVariant = await prisma.propertyVariant.findFirst({
				where: { name: variantName, propertyId: dbProperty.id },
			});
			if (!dbVariant) {
				const imageId = await getOrCreateMultimedia(path.join(propertyPath, variantFile.name), owner.id);
				dbVariant = await prisma.propertyVariant.create({
					data: { name: variantName, propertyId: dbProperty.id, imageId: imageId },
				});
				console.log(`      Created variant: ${dbVariant.name} (ID: ${dbVariant.id})`);
			} else {
				console.log(`      Variant "${variantName}" already exists.`);
			}
			variantMap.set(variantName, dbVariant.id);
		}
	}
}

async function processSkus(
	skusPath: string,
	product: Product,
	owner: User,
	variantMap: Map<string, string>
): Promise<string | null> {
	console.log(`
--- Phase 2: Processing SKUs from ${skusPath} ---`);
	const skuFiles = await fs.readdir(skusPath, { withFileTypes: true });
	let firstSkuImageId: string | null = null;

	for (const skuFile of skuFiles.filter((f) => f.isFile())) {
		const skuName = path.parse(skuFile.name).name;
		const skuImagePath = path.join(skusPath, skuFile.name);
		console.log(`  Processing SKU: ${skuName}`);

		const imageId = await getOrCreateMultimedia(skuImagePath, owner.id);
		if (!firstSkuImageId) {
			firstSkuImageId = imageId; // Capture the first image ID
		}

		let dbSku = await prisma.productSku.findFirst({ where: { skuCode: skuName, productId: product.id } });
		if (!dbSku) {
			dbSku = await prisma.productSku.create({
				data: {
					skuCode: skuName,
					productId: product.id,
					price: 0,
					imageId: imageId,
				},
			});
			console.log(`    Created SKU: ${dbSku.skuCode} (ID: ${dbSku.id}) with Image ID: ${imageId}`);
		} else {
			await prisma.productSku.update({
				where: { id: dbSku.id },
				data: { imageId: imageId },
			});
			console.log(`    SKU "${skuName}" already exists. Updated with Image ID: ${imageId}`);
		}

		const codes = skuName.split("_").filter((code) => variantMap.has(code));
		for (const code of codes) {
			const variantId = variantMap.get(code)!;
			await prisma.productSkuPropertyVariant.upsert({
				where: { productSkuId_propertyVariantId: { productSkuId: dbSku.id, propertyVariantId: variantId } },
				update: {},
				create: { productSkuId: dbSku.id, propertyVariantId: variantId },
			});
			console.log(`      -> Linked variant ${code}`);
		}
	}
	return firstSkuImageId;
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
	try {
		const metadata = JSON.parse(await fs.readFile(metadataFilePath, "utf-8"));
		suitableFor = metadata.suitableFor || [];
		style = metadata.style || [];
	} catch (e) {
		/* ... */
	}

	if (!product) {
		product = await prisma.product.create({
			data: { name: productName, basePrice: 0, ownerId: owner.id, suitableFor, style },
		});
		console.log(`Created product: ${product.name} (ID: ${product.id})`);
	} else {
		product = await prisma.product.update({
			where: { id: product.id },
			data: { suitableFor, style },
		});
		console.log(`Product "${product.name}" already exists. Updated metadata.`);
	}

	const propertiesDir = path.join(productPath, PROPERTIES_FOLDER_NAME);
	const skusDir = path.join(productPath, SKU_FOLDER_NAME);

	if (
		!(await fs
			.stat(propertiesDir)
			.then((s) => s.isDirectory())
			.catch(() => false))
	) {
		console.warn(`Product "${productName}" is missing a "${PROPERTIES_FOLDER_NAME}" directory. Skipping.`);
		return;
	}

	const variantMap = new Map<string, string>();
	await processProperties(propertiesDir, product, owner, variantMap);

	if (
		await fs
			.stat(skusDir)
			.then((s) => s.isDirectory())
			.catch(() => false)
	) {
		const firstSkuImageId = await processSkus(skusDir, product, owner, variantMap);

		// This is the FIX: Update the product with the main image ID
		if (firstSkuImageId && !product.mainImageId) {
			await prisma.product.update({
				where: { id: product.id },
				data: { mainImageId: firstSkuImageId },
			});
			console.log(`  -> Set mainImageId for ${product.name} to ${firstSkuImageId}`);
		}
	} else {
		console.log("No SKU directory found for this product.");
	}
}

async function massImport() {
	console.log("--- Starting Mass Import Script ---");
	await fs.mkdir(DESTINATION_FOLDER, { recursive: true });
	try {
		const companyFolders = await fs.readdir(SOURCE_FOLDER, { withFileTypes: true });
		for (const companyFolder of companyFolders.filter((d) => d.isDirectory())) {
			const companyPath = path.join(SOURCE_FOLDER, companyFolder.name);
			const owner = await getOwner(companyFolder.name);
			const productFolders = await fs.readdir(companyPath, { withFileTypes: true });
			for (const productFolder of productFolders.filter((d) => d.isDirectory())) {
				await processProduct(path.join(companyPath, productFolder.name), owner);
			}
		}
		console.log("\n--- Mass Import Finished Successfully ---");
	} catch (error) {
		console.error("\n❌ An error occurred during mass import:", error);
	} finally {
		await prisma.$disconnect();
	}
}

massImport();
