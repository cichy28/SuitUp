import { Request, Response } from "express";
import prisma from "../db";
import { CreateProductInputSchema, UpdateProductInputSchema } from "../../../shared/validators/product";
import { z } from "zod";

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
	try {
		const products = await prisma.product.findMany({
			include: {
				// Optionally include related data, e.g., owner name, main image URL
				owner: {
					select: { id: true, email: true, companyName: true },
				},
				mainImage: {
					select: { id: true, url: true, altText: true },
				},
			},
		});
		res.status(200).json(products);
	} catch (error: any) {
		console.error("Error fetching products:", error);
		res.status(500).json({ message: "Error fetching products", error: error.message });
	}
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const product = await prisma.product.findUnique({
			where: { id },
			include: {
				mainImage: true, // Dołączamy główny obrazek
				hotspots: {
					// Dołączamy wszystkie hotspoty dla tego produktu
					include: {
						property: {
							// A dla każdego hotspota dołączamy jego właściwość
							include: {
								propertyVariants: true, // Oraz wszystkie dostępne warianty dla tej właściwości
							},
						},
					},
				},
			},
		});

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}
		res.json(product);
	} catch (error) {
		const e = error as Error;
		res.status(500).json({ message: "Error fetching product", error: e.message });
	}
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
	try {
		const productData = CreateProductInputSchema.parse(req.body);

		const newProduct = await prisma.product.create({
			data: productData,
			include: {
				// Include related data in the response
				owner: {
					select: { id: true, email: true, companyName: true },
				},
				mainImage: {
					select: { id: true, url: true, altText: true },
				},
			},
		});

		res.status(201).json(newProduct);
	} catch (error: any) {
		// Handle potential Prisma errors
		console.error("Error creating product:", error);
		res.status(500).json({ message: "Error creating product", error: error.message });
	}
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const productData = UpdateProductInputSchema.parse(req.body);

		const updatedProduct = await prisma.product.update({
			where: { id },
			data: productData,
			include: {
				// Include related data in the response
				owner: {
					select: { id: true, email: true, companyName: true },
				},
				mainImage: {
					select: { id: true, url: true, altText: true },
				},
			},
		});

		res.status(200).json(updatedProduct);
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "Product not found" });
		}
		console.error(`Error updating product with ID ${id}:`, error);
		res.status(500).json({ message: `Error updating product with ID ${id}`, error: error.message });
	}
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const deletedProduct = await prisma.product.delete({
			where: { id },
			include: {
				// Include related data in the response
				owner: {
					select: { id: true, email: true, companyName: true },
				},
				mainImage: {
					select: { id: true, url: true, altText: true },
				},
			},
		});

		res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "Product not found" });
		}
		// TODO: Consider potential foreign key constraints if related records exist (e.g., ProductSku, ProductCategory)
		console.error(`Error deleting product with ID ${id}:`, error);
		res.status(500).json({ message: `Error deleting product with ID ${id}`, error: error.message });
	}
};
