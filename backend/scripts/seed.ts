import { PrismaClient, UserRole, FileType, BodyShape, StylePreference } from "@prisma/client";
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
	await prisma.account.deleteMany();
	await prisma.product.deleteMany();
	await prisma.multimedia.deleteMany();
	await prisma.customer.deleteMany();
	await prisma.user.deleteMany();

	console.log("Cleared existing data.");

	// Create Users
	const adminUser = await prisma.user.create({
		data: {
			email: "admin@example.com",
			password: "securepassword",
			companyName: "Admin Corp",
			role: UserRole.ADMIN,
		},
	});

	const producerUser = await prisma.user.create({
		data: {
			email: "producer@example.com",
			password: "anothersecurepassword",
			companyName: "Fashion Forward",
			companyData: { type: "LLC" },
			role: UserRole.PRODUCER,
		},
	});

	console.log("Created users.");

	// --- NEW DUMMY PRODUCT DATA ---
	const dummyProducts = [
		{
			name: "Elegancka Sukienka Ołówkowa",
			basePrice: new Decimal(299.99),
			suitableFor: [BodyShape.HOURGLASS, BodyShape.RECTANGLE],
			style: [StylePreference.FITTED_WEAR, StylePreference.MASCULINE_SHAPES],
			imageUrl: "https://placehold.co/600x900/EBD4CB/5D4037?text=Sukienka\\nO%C5%82%C3%B3wkowa",
		},
		{
			name: "Luźna Bluza z Kapturem",
			basePrice: new Decimal(189.99),
			suitableFor: [BodyShape.OVAL, BodyShape.RECTANGLE, BodyShape.TRIANGLE],
			style: [StylePreference.OVERSIZE_WEAR],
			imageUrl: "https://placehold.co/600x900/D7CCC8/4E342E?text=Bluza\\nOversize",
		},
		{
			name: "Marynarka w Stylu Retro",
			basePrice: new Decimal(450.0),
			suitableFor: [BodyShape.INVERTED_TRIANGLE, BodyShape.RECTANGLE],
			style: [StylePreference.RETRO_SHAPES, StylePreference.MASCULINE_SHAPES],
			imageUrl: "https://placehold.co/600x900/C5CAE9/303F9F?text=Marynarka\\nRetro",
		},
		{
			name: "Dopasowane Jeansy High-Waist",
			basePrice: new Decimal(220.5),
			suitableFor: [BodyShape.HOURGLASS, BodyShape.TRIANGLE],
			style: [StylePreference.FITTED_WEAR, StylePreference.RETRO_SHAPES],
			imageUrl: "https://placehold.co/600x900/B2EBF2/0097A7?text=Jeansy\\nHigh-Waist",
		},
		{
			name: "Koszula Oversize",
			basePrice: new Decimal(155.0),
			suitableFor: [BodyShape.OVAL, BodyShape.RECTANGLE, BodyShape.INVERTED_TRIANGLE],
			style: [StylePreference.OVERSIZE_WEAR, StylePreference.MASCULINE_SHAPES],
			imageUrl: "https://placehold.co/600x900/F8BBD0/C2185B?text=Koszula\\nOversize",
		},
		{
			name: "Spódnica Midi w Kształcie A",
			basePrice: new Decimal(199.99),
			suitableFor: [BodyShape.TRIANGLE, BodyShape.HOURGLASS],
			style: [StylePreference.RETRO_SHAPES],
			imageUrl: "https://placehold.co/600x900/F0F4C3/AFB42B?text=Sp%C3%B3dnica\\nMidi",
		},
		{
			name: "Garnitur Męski Krój",
			basePrice: new Decimal(799.0),
			suitableFor: [BodyShape.RECTANGLE, BodyShape.INVERTED_TRIANGLE],
			style: [StylePreference.MASCULINE_SHAPES],
			imageUrl: "https://placehold.co/600x900/BCAAA4/5D4037?text=Garnitur",
		},
		{
			name: "Klasyczny T-shirt",
			basePrice: new Decimal(89.9),
			suitableFor: [
				BodyShape.HOURGLASS,
				BodyShape.INVERTED_TRIANGLE,
				BodyShape.OVAL,
				BodyShape.RECTANGLE,
				BodyShape.TRIANGLE,
			],
			style: [StylePreference.FITTED_WEAR],
			imageUrl: "https://placehold.co/600x900/FFFFFF/333333?text=T-shirt",
		},
		{
			name: "Szerokie Spodnie Palazzo",
			basePrice: new Decimal(250.0),
			suitableFor: [BodyShape.INVERTED_TRIANGLE, BodyShape.RECTANGLE],
			style: [StylePreference.OVERSIZE_WEAR, StylePreference.RETRO_SHAPES],
			imageUrl: "https://placehold.co/600x900/A5D6A7/2E7D32?text=Spodnie\\nPalazzo",
		},
		{
			name: "Krótki Top",
			basePrice: new Decimal(99.0),
			suitableFor: [BodyShape.HOURGLASS],
			style: [StylePreference.FITTED_WEAR],
			imageUrl: "https://placehold.co/600x900/FFCCBC/E64A19?text=Kr%C3%B3tki\\nTop",
		},
		{
			name: "Bomberka w Stylu Lat 90.",
			basePrice: new Decimal(320.0),
			suitableFor: [BodyShape.INVERTED_TRIANGLE, BodyShape.OVAL],
			style: [StylePreference.RETRO_SHAPES, StylePreference.OVERSIZE_WEAR],
			imageUrl: "https://placehold.co/600x900/CFD8DC/455A64?text=Bomberka",
		},
		{
			name: "Body z Długim Rękawem",
			basePrice: new Decimal(140.0),
			suitableFor: [BodyShape.HOURGLASS, BodyShape.RECTANGLE],
			style: [StylePreference.FITTED_WEAR],
			imageUrl: "https://placehold.co/600x900/424242/FFFFFF?text=Body",
		},
	];

	for (const productData of dummyProducts) {
		const productImage = await prisma.multimedia.create({
			data: {
				url: productData.imageUrl,
				fileType: FileType.JPG,
				altText: `Image for ${productData.name}`,
				ownerId: producerUser.id,
			},
		});

		await prisma.product.create({
			data: {
				name: productData.name,
				basePrice: productData.basePrice,
				isActive: true,
				ownerId: producerUser.id,
				mainImageId: productImage.id,
				suitableFor: productData.suitableFor,
				style: productData.style,
			},
		});
	}

	console.log(`Created ${dummyProducts.length} dummy products with images.`);

	// --- END OF NEW DUMMY PRODUCT DATA ---

	// Create Customers, Categories, etc. (can be kept if needed for other tests)
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
