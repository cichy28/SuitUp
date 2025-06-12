import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface ProductData {
	sellerId: string;
	name: string;
	description?: string;
	basePrice: number;
	category: string;
}

export interface ProductStyleData {
	producerId: string;
	name: string;
	description?: string;
	imageUrl?: string;
	additionalPrice?: number;
}

export interface ProductMaterialData {
	producerId: string;
	name: string;
	description?: string;
	imageUrl?: string;
	additionalPrice?: number;
}

export interface ProductFinishData {
	producerId: string;
	name: string;
	description?: string;
	imageUrl?: string;
	additionalPrice?: number;
}

export interface ProductVariantData {
	productId: string;
	styleId?: string;
	materialId?: string;
	finishId?: string;
	sku?: string;
	price: number;
	isActive?: boolean;
}

export interface ProductVariantImageData {
	variantId: string;
	imageUrl: string;
	viewType: "front" | "left" | "right";
}

export const createProduct = async (productData: ProductData) => {
	try {
		const product = await prisma.product.create({
			data: productData,
		});
		return product;
	} catch (error) {
		throw error;
	}
};

export const getProducts = async (category?: string, sellerId?: string) => {
	try {
		const whereClause: any = {};
		if (category) whereClause.category = category;
		if (sellerId) whereClause.sellerId = sellerId;

		const products = await prisma.product.findMany({
			where: whereClause,
			include: {
				variants: {
					include: {
						style: true,
						material: true,
						finish: true,
						images: true,
					},
				},
			},
		});

		return products;
	} catch (error) {
		throw error;
	}
};

export const getProductById = async (productId: string) => {
	try {
		const product = await prisma.product.findUnique({
			where: { id: productId },
			include: {
				variants: {
					include: {
						style: true,
						material: true,
						finish: true,
						images: true,
					},
				},
			},
		});

		if (!product) {
			throw new Error("Produkt nie znaleziony");
		}

		return product;
	} catch (error) {
		throw error;
	}
};

// Funkcje dla zarządzania właściwościami produktu przez producenta
export const createProductStyle = async (styleData: ProductStyleData) => {
	try {
		const style = await prisma.productStyle.create({
			data: styleData,
		});
		return style;
	} catch (error) {
		throw error;
	}
};

export const getProductStyles = async (producerId: string) => {
	try {
		const styles = await prisma.productStyle.findMany({
			where: { producerId },
		});
		return styles;
	} catch (error) {
		throw error;
	}
};

export const createProductMaterial = async (materialData: ProductMaterialData) => {
	try {
		const material = await prisma.productMaterial.create({
			data: materialData,
		});
		return material;
	} catch (error) {
		throw error;
	}
};

export const getProductMaterials = async (producerId: string) => {
	try {
		const materials = await prisma.productMaterial.findMany({
			where: { producerId },
		});
		return materials;
	} catch (error) {
		throw error;
	}
};

export const createProductFinish = async (finishData: ProductFinishData) => {
	try {
		const finish = await prisma.productFinish.create({
			data: finishData,
		});
		return finish;
	} catch (error) {
		throw error;
	}
};

export const getProductFinishes = async (producerId: string) => {
	try {
		const finishes = await prisma.productFinish.findMany({
			where: { producerId },
		});
		return finishes;
	} catch (error) {
		throw error;
	}
};

// Funkcje dla zarządzania wariantami produktu
export const createProductVariant = async (variantData: ProductVariantData) => {
	try {
		const variant = await prisma.productVariant.create({
			data: variantData,
			include: {
				style: true,
				material: true,
				finish: true,
				images: true,
			},
		});
		return variant;
	} catch (error) {
		throw error;
	}
};

export const getProductVariants = async (productId: string) => {
	try {
		const variants = await prisma.productVariant.findMany({
			where: { productId },
			include: {
				style: true,
				material: true,
				finish: true,
				images: true,
			},
		});
		return variants;
	} catch (error) {
		throw error;
	}
};

export const createProductVariantImage = async (imageData: ProductVariantImageData) => {
	try {
		const image = await prisma.productVariantImage.create({
			data: imageData,
		});
		return image;
	} catch (error) {
		throw error;
	}
};

export const updateProductVariantImage = async (variantId: string, viewType: string, imageUrl: string) => {
	try {
		const image = await prisma.productVariantImage.upsert({
			where: {
				variantId_viewType: {
					variantId,
					viewType,
				},
			},
			update: {
				imageUrl,
			},
			create: {
				variantId,
				viewType,
				imageUrl,
			},
		});
		return image;
	} catch (error) {
		throw error;
	}
};

// Funkcja do generowania wszystkich możliwych wariantów produktu
export const generateProductVariants = async (
	productId: string,
	selectedProperties: {
		styleIds?: string[];
		materialIds?: string[];
		finishIds?: string[];
	}
) => {
	try {
		const product = await prisma.product.findUnique({
			where: { id: productId },
		});

		if (!product) {
			throw new Error("Produkt nie znaleziony");
		}

		const { styleIds = [], materialIds = [], finishIds = [] } = selectedProperties;

		// Generujemy wszystkie kombinacje
		const variants = [];

		// Jeśli nie ma żadnych właściwości, tworzymy podstawowy wariant
		if (styleIds.length === 0 && materialIds.length === 0 && finishIds.length === 0) {
			variants.push({
				productId,
				price: product.basePrice,
			});
		} else {
			// Generujemy kombinacje wszystkich właściwości
			for (const styleId of styleIds.length > 0 ? styleIds : [null]) {
				for (const materialId of materialIds.length > 0 ? materialIds : [null]) {
					for (const finishId of finishIds.length > 0 ? finishIds : [null]) {
						// Obliczamy cenę wariantu
						let price = product.basePrice;

						if (styleId) {
							const style = await prisma.productStyle.findUnique({ where: { id: styleId } });
							if (style) price += style.additionalPrice;
						}

						if (materialId) {
							const material = await prisma.productMaterial.findUnique({ where: { id: materialId } });
							if (material) price += material.additionalPrice;
						}

						if (finishId) {
							const finish = await prisma.productFinish.findUnique({ where: { id: finishId } });
							if (finish) price += finish.additionalPrice;
						}

						variants.push({
							productId,
							styleId: styleId || undefined,
							materialId: materialId || undefined,
							finishId: finishId || undefined,
							price,
						});
					}
				}
			}
		}

		// Tworzymy warianty w bazie danych
		const createdVariants = [];
		for (const variantData of variants) {
			try {
				const variant = await prisma.productVariant.create({
					data: variantData,
					include: {
						style: true,
						material: true,
						finish: true,
						images: true,
					},
				});
				createdVariants.push(variant);
			} catch (error) {
				// Ignorujemy błędy duplikatów (wariant już istnieje)
				console.log("Wariant już istnieje:", variantData);
			}
		}

		return createdVariants;
	} catch (error) {
		throw error;
	}
};

// Zachowujemy stare funkcje dla kompatybilności wstecznej
export const addProductStyle = async (styleData: Omit<ProductStyleData, "producerId"> & { productId: string }) => {
	// Ta funkcja jest przestarzała - używaj createProductStyle
	throw new Error("Ta funkcja jest przestarzała. Użyj createProductStyle z producerId.");
};

export const addProductMaterial = async (
	materialData: Omit<ProductMaterialData, "producerId"> & { productId: string }
) => {
	// Ta funkcja jest przestarzała - używaj createProductMaterial
	throw new Error("Ta funkcja jest przestarzała. Użyj createProductMaterial z producerId.");
};

export const addProductFinish = async (finishData: Omit<ProductFinishData, "producerId"> & { productId: string }) => {
	// Ta funkcja jest przestarzała - używaj createProductFinish
	throw new Error("Ta funkcja jest przestarzała. Użyj createProductFinish z producerId.");
};
