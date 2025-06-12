import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
	createProductStyle,
	createProductMaterial,
	createProductFinish,
	getProductStyles,
	getProductMaterials,
	getProductFinishes,
	generateProductVariants,
	getProductVariants,
	updateProductVariantImage,
} from "../product/product.model";

const prisma = new PrismaClient();

// Pobierz wszystkie produkty producenta
export const getProducerProducts = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;

		const products = await prisma.product.findMany({
			where: {
				sellerId: producerId,
			},
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

		return res.status(200).json({ products });
	} catch (error) {
		console.error("Błąd pobierania produktów producenta:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas pobierania produktów",
		});
	}
};

// Pobierz szczegóły produktu producenta
export const getProducerProductDetails = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;
		const { productId } = req.params;

		const product = await prisma.product.findFirst({
			where: {
				id: productId,
				sellerId: producerId,
			},
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
			return res.status(404).json({ message: "Produkt nie został znaleziony" });
		}

		return res.status(200).json({ product });
	} catch (error) {
		console.error("Błąd pobierania szczegółów produktu:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas pobierania szczegółów produktu",
		});
	}
};

// Dodaj nowy produkt
export const createProduct = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;
		const { name, description, basePrice, category } = req.body;

		if (!name || !basePrice || !category) {
			return res.status(400).json({ message: "Nazwa, cena bazowa i kategoria są wymagane" });
		}

		const product = await prisma.product.create({
			data: {
				sellerId: producerId,
				name,
				description,
				basePrice: parseFloat(basePrice),
				category,
			},
		});

		return res.status(201).json({
			message: "Produkt został utworzony pomyślnie",
			product,
		});
	} catch (error) {
		console.error("Błąd tworzenia produktu:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas tworzenia produktu",
		});
	}
};

// Aktualizuj produkt
export const updateProduct = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;
		const { productId } = req.params;
		const { name, description, basePrice, category } = req.body;

		// Sprawdź czy produkt istnieje i należy do producenta
		const existingProduct = await prisma.product.findFirst({
			where: {
				id: productId,
				sellerId: producerId,
			},
		});

		if (!existingProduct) {
			return res.status(404).json({ message: "Produkt nie został znaleziony" });
		}

		const updatedProduct = await prisma.product.update({
			where: {
				id: productId,
			},
			data: {
				name: name || existingProduct.name,
				description: description !== undefined ? description : existingProduct.description,
				basePrice: basePrice ? parseFloat(basePrice) : existingProduct.basePrice,
				category: category || existingProduct.category,
			},
		});

		return res.status(200).json({
			message: "Produkt został zaktualizowany pomyślnie",
			product: updatedProduct,
		});
	} catch (error) {
		console.error("Błąd aktualizacji produktu:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas aktualizacji produktu",
		});
	}
};

// Usuń produkt
export const deleteProduct = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;
		const { productId } = req.params;

		// Sprawdź czy produkt istnieje i należy do producenta
		const existingProduct = await prisma.product.findFirst({
			where: {
				id: productId,
				sellerId: producerId,
			},
		});

		if (!existingProduct) {
			return res.status(404).json({ message: "Produkt nie został znaleziony" });
		}

		// Usuń produkt i wszystkie powiązane elementy (kaskadowo)
		await prisma.product.delete({
			where: {
				id: productId,
			},
		});

		return res.status(200).json({
			message: "Produkt został usunięty pomyślnie",
		});
	} catch (error) {
		console.error("Błąd usuwania produktu:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas usuwania produktu",
		});
	}
};

// NOWE FUNKCJE DLA ZARZĄDZANIA WŁAŚCIWOŚCIAMI PRODUKTU

// Pobierz wszystkie style producenta
export const getProducerStyles = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;
		const styles = await getProductStyles(producerId);
		return res.status(200).json({ styles });
	} catch (error) {
		console.error("Błąd pobierania stylów:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas pobierania stylów",
		});
	}
};

// Dodaj nowy styl
export const addProducerStyle = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;
		const { name, description, imageUrl, additionalPrice } = req.body;

		if (!name) {
			return res.status(400).json({ message: "Nazwa stylu jest wymagana" });
		}

		const style = await createProductStyle({
			producerId,
			name,
			description,
			imageUrl,
			additionalPrice: additionalPrice ? parseFloat(additionalPrice) : 0,
		});

		return res.status(201).json({
			message: "Styl został dodany pomyślnie",
			style,
		});
	} catch (error) {
		console.error("Błąd dodawania stylu:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas dodawania stylu",
		});
	}
};

// Pobierz wszystkie materiały producenta
export const getProducerMaterials = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;
		const materials = await getProductMaterials(producerId);
		return res.status(200).json({ materials });
	} catch (error) {
		console.error("Błąd pobierania materiałów:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas pobierania materiałów",
		});
	}
};

// Dodaj nowy materiał
export const addProducerMaterial = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;
		const { name, description, imageUrl, additionalPrice } = req.body;

		if (!name) {
			return res.status(400).json({ message: "Nazwa materiału jest wymagana" });
		}

		const material = await createProductMaterial({
			producerId,
			name,
			description,
			imageUrl,
			additionalPrice: additionalPrice ? parseFloat(additionalPrice) : 0,
		});

		return res.status(201).json({
			message: "Materiał został dodany pomyślnie",
			material,
		});
	} catch (error) {
		console.error("Błąd dodawania materiału:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas dodawania materiału",
		});
	}
};

// Pobierz wszystkie wykończenia producenta
export const getProducerFinishes = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;
		const finishes = await getProductFinishes(producerId);
		return res.status(200).json({ finishes });
	} catch (error) {
		console.error("Błąd pobierania wykończeń:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas pobierania wykończeń",
		});
	}
};

// Dodaj nowe wykończenie
export const addProducerFinish = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;
		const { name, description, imageUrl, additionalPrice } = req.body;

		if (!name) {
			return res.status(400).json({ message: "Nazwa wykończenia jest wymagana" });
		}

		const finish = await createProductFinish({
			producerId,
			name,
			description,
			imageUrl,
			additionalPrice: additionalPrice ? parseFloat(additionalPrice) : 0,
		});

		return res.status(201).json({
			message: "Wykończenie zostało dodane pomyślnie",
			finish,
		});
	} catch (error) {
		console.error("Błąd dodawania wykończenia:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas dodawania wykończenia",
		});
	}
};

// Generuj warianty produktu
export const generateVariants = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;
		const { productId } = req.params;
		const { styleIds, materialIds, finishIds } = req.body;

		// Sprawdź czy produkt należy do producenta
		const product = await prisma.product.findFirst({
			where: {
				id: productId,
				sellerId: producerId,
			},
		});

		if (!product) {
			return res.status(404).json({ message: "Produkt nie został znaleziony" });
		}

		const variants = await generateProductVariants(productId, {
			styleIds,
			materialIds,
			finishIds,
		});

		return res.status(201).json({
			message: "Warianty zostały wygenerowane pomyślnie",
			variants,
		});
	} catch (error) {
		console.error("Błąd generowania wariantów:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas generowania wariantów",
		});
	}
};

// Pobierz warianty produktu
export const getVariants = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;
		const { productId } = req.params;

		// Sprawdź czy produkt należy do producenta
		const product = await prisma.product.findFirst({
			where: {
				id: productId,
				sellerId: producerId,
			},
		});

		if (!product) {
			return res.status(404).json({ message: "Produkt nie został znaleziony" });
		}

		const variants = await getProductVariants(productId);

		return res.status(200).json({ variants });
	} catch (error) {
		console.error("Błąd pobierania wariantów:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas pobierania wariantów",
		});
	}
};

// Aktualizuj obrazek wariantu
export const updateVariantImage = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;
		const { variantId } = req.params;
		const { viewType, imageUrl } = req.body;

		if (!viewType || !["front", "left", "right"].includes(viewType)) {
			return res.status(400).json({ message: "Nieprawidłowy typ widoku. Dozwolone: front, left, right" });
		}

		if (!imageUrl) {
			return res.status(400).json({ message: "URL obrazka jest wymagany" });
		}

		// Sprawdź czy wariant należy do produktu producenta
		const variant = await prisma.productVariant.findFirst({
			where: {
				id: variantId,
				product: {
					sellerId: producerId,
				},
			},
		});

		if (!variant) {
			return res.status(404).json({ message: "Wariant nie został znaleziony" });
		}

		const image = await updateProductVariantImage(variantId, viewType, imageUrl);

		return res.status(200).json({
			message: "Obrazek wariantu został zaktualizowany pomyślnie",
			image,
		});
	} catch (error) {
		console.error("Błąd aktualizacji obrazka wariantu:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas aktualizacji obrazka wariantu",
		});
	}
};

// STARE FUNKCJE - zachowane dla kompatybilności wstecznej

// Dodaj styl do produktu (przestarzałe)
export const addProductStyle = async (req: Request, res: Response) => {
	return res.status(400).json({
		message: "Ta funkcja jest przestarzała. Użyj /styles do zarządzania stylami.",
	});
};

// Dodaj materiał do produktu (przestarzałe)
export const addProductMaterial = async (req: Request, res: Response) => {
	return res.status(400).json({
		message: "Ta funkcja jest przestarzała. Użyj /materials do zarządzania materiałami.",
	});
};

// Dodaj wykończenie do produktu (przestarzałe)
export const addProductFinish = async (req: Request, res: Response) => {
	return res.status(400).json({
		message: "Ta funkcja jest przestarzała. Użyj /finishes do zarządzania wykończeniami.",
	});
};

// Pobierz zamówienia dla produktów producenta
export const getProducerOrders = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;

		// Pobierz wszystkie zamówienia, które zawierają produkty tego producenta
		const orders = await prisma.order.findMany({
			where: {
				items: {
					some: {
						product: {
							sellerId: producerId,
						},
					},
				},
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				items: {
					include: {
						product: true,
						variant: {
							include: {
								style: true,
								material: true,
								finish: true,
								images: true,
							},
						},
						style: true,
						material: true,
						finish: true,
					},
					where: {
						product: {
							sellerId: producerId,
						},
					},
				},
			},
		});

		return res.status(200).json({ orders });
	} catch (error) {
		console.error("Błąd pobierania zamówień producenta:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas pobierania zamówień",
		});
	}
};

// Aktualizuj status zamówienia
export const updateOrderStatus = async (req: Request, res: Response) => {
	try {
		const producerId = (req as any).user.id;
		const { orderId } = req.params;
		const { status } = req.body;

		if (!status || !["processing", "completed", "cancelled"].includes(status)) {
			return res.status(400).json({ message: "Nieprawidłowy status zamówienia" });
		}

		// Sprawdź czy zamówienie zawiera produkty tego producenta
		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
				items: {
					some: {
						product: {
							sellerId: producerId,
						},
					},
				},
			},
		});

		if (!order) {
			return res.status(404).json({ message: "Zamówienie nie zostało znalezione" });
		}

		const updatedOrder = await prisma.order.update({
			where: {
				id: orderId,
			},
			data: {
				status,
			},
		});

		return res.status(200).json({
			message: "Status zamówienia został zaktualizowany pomyślnie",
			order: updatedOrder,
		});
	} catch (error) {
		console.error("Błąd aktualizacji statusu zamówienia:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas aktualizacji statusu zamówienia",
		});
	}
};
