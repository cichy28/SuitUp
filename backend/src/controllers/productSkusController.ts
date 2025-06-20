import { Request, Response } from "express";
import prisma from "../db";
import { CreateProductSkuInputSchema, UpdateProductSkuInputSchema } from "../../../shared/validators/productSku";
import { z } from "zod";

// Get all product SKUs
export const getAllProductSkus = async (req: Request, res: Response) => {
	try {
		const productSkus = await prisma.productSku.findMany({
			include: {
				product: {
					// Include related Product
					select: { id: true, name: true, basePrice: true, ownerId: true }, // Select specific product fields
				},
				propertyVariants: {
					// Include linked PropertyVariants
					include: {
						propertyVariant: true, // Include details of the variant
					},
				},
				orderItems: true, // Include related OrderItems
			},
		});
		res.status(200).json(productSkus);
	} catch (error: any) {
		console.error("Error fetching product SKUs:", error);
		res.status(500).json({ message: "Error fetching product SKUs", error: error.message });
	}
};

// Get product SKU by ID
export const getProductSkuById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const productSku = await prisma.productSku.findUnique({
			where: { id },
			include: {
				product: {
					select: { id: true, name: true, basePrice: true, ownerId: true },
				},
				propertyVariants: {
					include: {
						propertyVariant: true,
					},
				},
				orderItems: true,
			},
		});

		if (!productSku) {
			return res.status(404).json({ message: "Product SKU not found" });
		}

		res.status(200).json(productSku);
	} catch (error: any) {
		console.error(`Error fetching product SKU with ID ${id}:`, error);
		res.status(500).json({ message: `Error fetching product SKU with ID ${id}`, error: error.message });
	}
};

// Create a new product SKU
export const createProductSku = async (req: Request, res: Response) => {
	try {
		const productSkuData = CreateProductSkuInputSchema.parse(req.body);
		// Note: If you needed to connect PropertyVariants on creation,
		// the input schema and Prisma create call would be more complex.

		const newProductSku = await prisma.productSku.create({
			data: productSkuData,
			include: {
				// Include relations in the response
				product: {
					select: { id: true, name: true, basePrice: true, ownerId: true },
				},
			},
		});

		res.status(201).json(newProductSku);
	} catch (error: any) {
		if (error.code === "P2002" && error.meta?.target?.includes("skuCode")) {
			return res.status(409).json({ message: "Product SKU with this skuCode already exists" });
		}
		if (error.code === "P2003") {
			// Invalid productId
			return res.status(400).json({ message: "Invalid product ID" });
		}
		console.error("Error creating product SKU:", error);
		res.status(500).json({ message: "Error creating product SKU", error: error.message });
	}
};

// Update a product SKU
export const updateProductSku = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const productSkuData = UpdateProductSkuInputSchema.parse(req.body);
		// Note: Updating linked PropertyVariants might require separate endpoints
		// or a more complex nested update logic here.

		const updatedProductSku = await prisma.productSku.update({
			where: { id },
			data: productSkuData,
			include: {
				// Include relations in the response
				product: {
					select: { id: true, name: true, basePrice: true, ownerId: true },
				},
				propertyVariants: {
					include: {
						propertyVariant: true,
					},
				},
			},
		});

		res.status(200).json(updatedProductSku);
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "Product SKU not found" });
		}
		if (error.code === "P2002" && error.meta?.target?.includes("skuCode")) {
			return res.status(409).json({ message: "Product SKU with this skuCode already exists" });
		}
		console.error(`Error updating product SKU with ID ${id}:`, error);
		res.status(500).json({ message: `Error updating product SKU with ID ${id}`, error: error.message });
	}
};

// Delete a product SKU
export const deleteProductSku = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		// Note: Deleting a ProductSku might fail if it's still referenced by
		// OrderItem or ProductSkuPropertyVariant depending on your schema's onDelete behavior.
		// Your schema has `onDelete: Restrict` for OrderItem and `onDelete: Cascade` for ProductSkuPropertyVariant.
		// This means deleting an SKU with associated OrderItems will fail with P2003,
		// but associated ProductSkuPropertyVariant records will be deleted.

		const deletedProductSku = await prisma.productSku.delete({
			where: { id },
			include: {
				// Include relations in the response
				product: {
					select: { id: true, name: true, basePrice: true, ownerId: true },
				},
			},
		});

		res.status(200).json({ message: "Product SKU deleted successfully", productSku: deletedProductSku });
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "Product SKU not found" });
		}
		if (error.code === "P2003") {
			// Foreign key constraint failure (due to OrderItem)
			return res.status(409).json({ message: "Cannot delete product SKU because it is part of existing orders." });
		}
		console.error(`Error deleting product SKU with ID ${id}:`, error);
		res.status(500).json({ message: `Error deleting product SKU with ID ${id}`, error: error.message });
	}
};

// TODO: Consider adding endpoints for managing ProductSkuPropertyVariants for a given ProductSku
// e.g., POST /api/product-skus/:skuId/variants (to link a variant)
// e.g., DELETE /api/product-skus/:skuId/variants/:variantId (to unlink a variant)
