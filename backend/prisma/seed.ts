import { PrismaClient } from "@prisma/client";
import { UserRole, FileType, OrderStatus, ApprovalPolicy, HandlingMethod } from "../../shared/enums";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

async function main() {
	console.log("Start seeding...");

	// Clear existing data (optional, but good for idempotency during testing)
	await prisma.orderItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.productSkuPropertyVariant.deleteMany();
	await prisma.productSku.deleteMany();
	await prisma.propertyVariant.deleteMany();
	await prisma.productProperty.deleteMany();
	await prisma.property.deleteMany();
	await prisma.productCategory.deleteMany();
	await prisma.category.deleteMany();
	await prisma.account.deleteMany(); // Accounts are linked to users
	await prisma.product.deleteMany(); // Products are linked to users
	await prisma.multimedia.deleteMany(); // Multimedia is linked to users
	await prisma.customer.deleteMany(); // Customers can be standalone, but orders link to them
	await prisma.user.deleteMany();

	console.log("Cleared existing data.");

	// Create Users
	const adminUser = await prisma.user.create({
		data: {
			email: "admin@example.com",
			password: "securepassword",
			companyName: "Admin Corp",
			role: UserRole.enum.ADMIN,
		},
	});

	const producerUser = await prisma.user.create({
		data: {
			email: "producer@example.com",
			password: "anothersecurepassword",
			companyName: "Producer Co.",
			companyData: { type: "Sole Proprietorship" },
			role: UserRole.enum.PRODUCER,
		},
	});

	console.log("Created users.");

	// Create Multimedia
	const producerLogo = await prisma.multimedia.create({
		data: {
			url: "https://example.com/producer_logo.png",
			fileType: FileType.enum.PNG,
			altText: "Producer Logo",
			ownerId: producerUser.id,
		},
	});

	const product1Image = await prisma.multimedia.create({
		data: {
			url: "https://example.com/product1_image.jpg",
			fileType: FileType.JPG,
			altText: "Product 1 Image",
			ownerId: producerUser.id,
		},
	});

	const variant1Image = await prisma.multimedia.create({
		data: {
			url: "https://example.com/variant1_image.png",
			fileType: FileType.enum.PNG,
			altText: "Variant 1 Image",
			ownerId: producerUser.id,
		},
	});

	await prisma.user.update({
		where: { id: producerUser.id },
		data: { logoId: producerLogo.id },
	});

	console.log("Created multimedia.");

	// Create Customers
	const customer1 = await prisma.customer.create({
		data: {
			name: "John Doe",
			email: "john.doe@example.com",
			phone: "123-456-7890",
			address: { street: "123 Main St", city: "Anytown" },
		},
	});

	const customer2 = await prisma.customer.create({
		data: {
			name: "Jane Smith",
			email: "jane.smith@example.com",
			phone: "987-654-3210",
			address: { street: "456 Oak Ave", city: "Otherville" },
		},
	});

	console.log("Created customers.");

	// Create Categories
	const mainCategory = await prisma.category.create({
		data: {
			name: "Electronics",
			description: "Gadgets and electronic devices",
		},
	});

	const subCategory = await prisma.category.create({
		data: {
			name: "Laptops",
			description: "Portable computers",
			parentId: mainCategory.id,
		},
	});

	console.log("Created categories.");

	// Create Properties
	const colorProperty = await prisma.property.create({
		data: {
			name: "Color",
			isGlobal: true,
		},
	});

	const sizeProperty = await prisma.property.create({
		data: {
			name: "Size",
			isGlobal: false,
			ownerId: producerUser.id,
		},
	});

	console.log("Created properties.");

	// Create Property Variants
	const colorRed = await prisma.propertyVariant.create({
		data: {
			name: "Red",
			propertyId: colorProperty.id,
			imageId: variant1Image.id,
		},
	});

	const colorBlue = await prisma.propertyVariant.create({
		data: {
			name: "Blue",
			propertyId: colorProperty.id,
		},
	});

	const sizeSmall = await prisma.propertyVariant.create({
		data: {
			name: "Small",
			propertyId: sizeProperty.id,
		},
	});

	const sizeLarge = await prisma.propertyVariant.create({
		data: {
			name: "Large",
			propertyId: sizeProperty.id,
		},
	});

	console.log("Created property variants.");

	// Create Products
	const product1 = await prisma.product.create({
		data: {
			name: "SuperGadget",
			basePrice: new Decimal(199.99),
			isActive: true,
			ownerId: producerUser.id,
			mainImageId: product1Image.id,
			categories: { create: { categoryId: subCategory.id } },
			properties: { create: [{ propertyId: colorProperty.id }, { propertyId: sizeProperty.id }] },
		},
	});

	const product2 = await prisma.product.create({
		data: {
			name: "MegaWidget",
			basePrice: new Decimal(50.0),
			isActive: true,
			ownerId: producerUser.id,
			categories: { create: { categoryId: mainCategory.id } },
			properties: { create: { propertyId: colorProperty.id } },
		},
	});

	console.log("Created products.");

	// Create Product SKUs
	const product1Sku1 = await prisma.productSku.create({
		data: {
			productId: product1.id,
			skuCode: "SG-RED-S",
			price: new Decimal(209.99),
			stockQuantity: 100,
			propertyVariants: {
				create: [{ propertyVariantId: colorRed.id }, { propertyVariantId: sizeSmall.id }],
			},
		},
	});

	const product1Sku2 = await prisma.productSku.create({
		data: {
			productId: product1.id,
			skuCode: "SG-BLUE-L",
			price: new Decimal(219.99),
			stockQuantity: 50,
			propertyVariants: {
				create: [{ propertyVariantId: colorBlue.id }, { propertyVariantId: sizeLarge.id }],
			},
		},
	});

	const product2Sku1 = await prisma.productSku.create({
		data: {
			productId: product2.id,
			skuCode: "MW-BLUE",
			price: new Decimal(55.0),
			stockQuantity: 200,
			propertyVariants: {
				create: [{ propertyVariantId: colorBlue.id }],
			},
		},
	});

	console.log("Created product SKUs.");

	// Create Orders
	const order1 = await prisma.order.create({
		data: {
			customerId: customer1.id,
			producerId: producerUser.id,
			status: OrderStatus.CONFIRMED,
			customerData: { name: customer1.name, email: customer1.email },
			approvalPolicy: ApprovalPolicy.AUTOMATIC,
			handlingMethod: HandlingMethod.EMAIL,
			handlingEmail: producerUser.email,
		},
	});

	const order2 = await prisma.order.create({
		data: {
			customerId: customer2.id,
			producerId: producerUser.id,
			status: OrderStatus.enum.PENDING,
			customerData: { name: customer2.name, email: customer2.email },
			approvalPolicy: ApprovalPolicy.enum.MANUAL,
			handlingMethod: HandlingMethod.enum.API,
			handlingApiUrl: "https://example.com/api/handleorder",
		},
	});

	console.log("Created orders.");

	// Create Order Items
	await prisma.orderItem.create({
		data: {
			orderId: order1.id,
			productSkuId: product1Sku1.id,
			quantity: 2,
			pricePerUnitAtOrder: product1Sku1.price || new Decimal(0),
		},
	});

	await prisma.orderItem.create({
		data: {
			orderId: order1.id,
			productSkuId: product2Sku1.id,
			quantity: 1,
			pricePerUnitAtOrder: product2Sku1.price || new Decimal(0),
		},
	});

	await prisma.orderItem.create({
		data: {
			orderId: order2.id,
			productSkuId: product1Sku2.id,
			quantity: 5,
			pricePerUnitAtOrder: product1Sku2.price || new Decimal(0),
		},
	});

	console.log("Created order items.");

	console.log("Seeding finished.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
