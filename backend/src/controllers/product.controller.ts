import { Request, Response } from "express";
import * as ProductModel from "../product/product.model";

export const createProduct = async (req: Request, res: Response) => {
	try {
		const { name, description, basePrice, category } = req.body;
		const sellerId = (req as any).user.id;

		if (!name || !basePrice || !category) {
			return res.status(400).json({ message: "Nazwa, cena bazowa i kategoria są wymagane" });
		}

		const product = await ProductModel.createProduct({
			sellerId,
			name,
			description,
			basePrice: parseFloat(basePrice),
			category,
		});

		return res.status(201).json({
			message: "Produkt utworzony pomyślnie",
			product,
		});
	} catch (error) {
		console.error("Błąd tworzenia produktu:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas tworzenia produktu",
		});
	}
};

export const getProducts = async (req: Request, res: Response) => {
	try {
		const { category } = req.query;

		const products = await ProductModel.getProducts(category as string | undefined);

		return res.status(200).json({ products });
	} catch (error) {
		console.error("Błąd pobierania produktów:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas pobierania produktów",
		});
	}
};

export const getProductById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const product = await ProductModel.getProductById(id);

		return res.status(200).json({ product });
	} catch (error) {
		console.error("Błąd pobierania produktu:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas pobierania produktu",
		});
	}
};

export const addProductStyle = async (req: Request, res: Response) => {
	try {
		const { productId, name, description, imageUrl, additionalPrice } = req.body;

		if (!productId || !name) {
			return res.status(400).json({ message: "ID produktu i nazwa są wymagane" });
		}

		const style = await ProductModel.addProductStyle({
			productId,
			name,
			description,
			imageUrl,
			additionalPrice: additionalPrice ? parseFloat(additionalPrice) : 0,
		});

		return res.status(201).json({
			message: "Styl produktu dodany pomyślnie",
			style,
		});
	} catch (error) {
		console.error("Błąd dodawania stylu produktu:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas dodawania stylu produktu",
		});
	}
};

export const addProductMaterial = async (req: Request, res: Response) => {
	try {
		const { productId, name, description, imageUrl, additionalPrice } = req.body;

		if (!productId || !name) {
			return res.status(400).json({ message: "ID produktu i nazwa są wymagane" });
		}

		const material = await ProductModel.addProductMaterial({
			productId,
			name,
			description,
			imageUrl,
			additionalPrice: additionalPrice ? parseFloat(additionalPrice) : 0,
		});

		return res.status(201).json({
			message: "Materiał produktu dodany pomyślnie",
			material,
		});
	} catch (error) {
		console.error("Błąd dodawania materiału produktu:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas dodawania materiału produktu",
		});
	}
};

export const addProductFinish = async (req: Request, res: Response) => {
	try {
		const { productId, name, description, imageUrl, additionalPrice } = req.body;

		if (!productId || !name) {
			return res.status(400).json({ message: "ID produktu i nazwa są wymagane" });
		}

		const finish = await ProductModel.addProductFinish({
			productId,
			name,
			description,
			imageUrl,
			additionalPrice: additionalPrice ? parseFloat(additionalPrice) : 0,
		});

		return res.status(201).json({
			message: "Wykończenie produktu dodane pomyślnie",
			finish,
		});
	} catch (error) {
		console.error("Błąd dodawania wykończenia produktu:", error);
		return res.status(500).json({
			message: error instanceof Error ? error.message : "Wystąpił błąd podczas dodawania wykończenia produktu",
		});
	}
};
