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

async function processProperties(propertiesPath: string, product: Product, owner: User, variantMap: Map<string, string>) {
    console.log(`\n--- Phase 1: Processing Properties from ${propertiesPath} ---`);
    const propertyFolders = await fs.readdir(propertiesPath, { withFileTypes: true });

    for (const propertyFolder of propertyFolders.filter(d => d.isDirectory())) {
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
        for (const variantFile of variantFiles.filter(f => f.isFile())) {
            const variantName = path.parse(variantFile.name).name;
            let dbVariant = await prisma.propertyVariant.findFirst({ where: { name: variantName, propertyId: dbProperty.id } });
            if (!dbVariant) {
                const imageId = await getOrCreateMultimedia(path.join(propertyPath, variantFile.name), owner.id);
                dbVariant = await prisma.propertyVariant.create({ data: { name: variantName, propertyId: dbProperty.id, imageId: imageId } });
                console.log(`      Created variant: ${dbVariant.name} (ID: ${dbVariant.id})`);
            } else {
                console.log(`      Variant "${variantName}" already exists.`);
            }
            variantMap.set(variantName, dbVariant.id);
        }
    }
}

async function processSkus(skusPath: string, product: Product, owner: User, variantMap: Map<string, string>) {
    console.log(`\n--- Phase 2: Processing SKUs from ${skusPath} ---`);
    const skuFiles = await fs.readdir(skusPath, { withFileTypes: true });

    for (const skuFile of skuFiles.filter(f => f.isFile())) {
        const skuName = path.parse(skuFile.name).name;
        console.log(`  Processing SKU: ${skuName}`);

        let dbSku = await prisma.productSku.findFirst({ where: { skuCode: skuName, productId: product.id } });
        if (!dbSku) {
            dbSku = await prisma.productSku.create({ data: { skuCode: skuName, productId: product.id, price: 0 } });
            console.log(`    Created SKU: ${dbSku.skuCode} (ID: ${dbSku.id})`);
        } else {
            console.log(`    SKU "${skuName}" already exists.`);
        }

        // Parse SKU name to connect variants
        const codes = skuName.split('_');
        let firstVariantIndex = -1;
        for(let i = 0; i < codes.length; i++) {
            if (variantMap.has(codes[i])) {
                firstVariantIndex = i;
                break;
            }
        }

        if (firstVariantIndex === -1) {
            console.warn(`      -> No variant codes found in SKU name "${skuName}"`);
            continue;
        }

        const variantCodes = codes.slice(firstVariantIndex);
        for (const code of variantCodes) {
            const variantId = variantMap.get(code);
            if (variantId) {
                await prisma.productSkuPropertyVariant.upsert({
                    where: { productSkuId_propertyVariantId: { productSkuId: dbSku.id, propertyVariantId: variantId } },
                    update: {},
                    create: { productSkuId: dbSku.id, propertyVariantId: variantId },
                });
                console.log(`      -> Linked variant ${code}`);
            } else {
                console.warn(`      -> Variant code "${code}" from SKU "${skuName}" not found in variant map.`);
            }
        }
    }
}

async function processProduct(productPath: string, owner: User) {
    const productName = path.basename(productPath);
    console.log(`\nProcessing product: ${productName}`);

    let product = await prisma.product.findFirst({ where: { name: productName, ownerId: owner.id } });

    let suitableFor: BodyShape[] = [];
    let style: StylePreference[] = [];

    const metadataFilePath = path.join(productPath, 'product_metadata.json');
    try {
        const metadataContent = await fs.readFile(metadataFilePath, 'utf-8');
        const metadata = JSON.parse(metadataContent);
        if (Array.isArray(metadata.suitableFor)) {
            suitableFor = metadata.suitableFor;
        }
        if (Array.isArray(metadata.style)) {
            style = metadata.style;
        }
        console.log(`  -> Loaded metadata for ${productName}: suitableFor=${suitableFor}, style=${style}`);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            console.warn(`  -> No product_metadata.json found for ${productName}. Using default empty arrays.`);
        } else {
            console.error(`  -> Error reading product_metadata.json for ${productName}:`, error);
        }
    }

    if (!product) {
        product = await prisma.product.create({
            data: {
                name: productName,
                basePrice: 0,
                ownerId: owner.id,
                suitableFor: suitableFor,
                style: style,
            }
        });
        console.log(`Created product: ${product.name} (ID: ${product.id})`);
    } else {
        // Update existing product with metadata
        product = await prisma.product.update({
            where: { id: product.id },
            data: {
                suitableFor: suitableFor,
                style: style,
            }
        });
        console.log(`Product "${product.name}" already exists. Updated metadata.`);
    }

    const content = await fs.readdir(productPath, { withFileTypes: true });
    const propertiesDir = content.find(d => d.isDirectory() && d.name === PROPERTIES_FOLDER_NAME);
    const skusDir = content.find(d => d.isDirectory() && d.name === SKU_FOLDER_NAME);

    if (!propertiesDir) {
        console.warn(`Product "${productName}" is missing a "${PROPERTIES_FOLDER_NAME}" directory. Skipping.`);
        return;
    }

    const variantMap = new Map<string, string>();
    await processProperties(path.join(productPath, propertiesDir.name), product, owner, variantMap);

    if (skusDir) {
        await processSkus(path.join(productPath, skusDir.name), product, owner, variantMap);
    } else {
        console.log("No SKU directory found for this product.");
    }
}

async function massImport() {
	console.log("--- Starting Mass Import Script ---");
	await fs.mkdir(DESTINATION_FOLDER, { recursive: true });
	try {
		const companyFolders = await fs.readdir(SOURCE_FOLDER, { withFileTypes: true });
		for (const companyFolder of companyFolders.filter(d => d.isDirectory())) {
			const companyPath = path.join(SOURCE_FOLDER, companyFolder.name);
			const owner = await getOwner(companyFolder.name);
			const productFolders = await fs.readdir(companyPath, { withFileTypes: true });
			for (const productFolder of productFolders.filter(d => d.isDirectory())) {
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
