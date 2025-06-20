import { Request, Response } from "express";
import prisma from "../db";
import { CreateCategoryInputSchema, UpdateCategoryInputSchema } from "../../../shared/validators/category";
import { z } from "zod";

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
	try {
		// Optionally include parent/children for hierarchy visualization
		const categories = await prisma.category.findMany({
			include: {
				parent: true, // Include parent category details
				children: true, // Include children categories
			},
		});
		res.status(200).json(categories);
	} catch (error: any) {
		console.error("Error fetching categories:", error);
		res.status(500).json({ message: "Error fetching categories", error: error.message });
	}
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const category = await prisma.category.findUnique({
			where: { id },
			include: {
				parent: true,
				children: true,
				products: {
					// Include products in this category
					include: {
						product: true, // Include product details
					},
				},
			},
		});

		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		res.status(200).json(category);
	} catch (error: any) {
		console.error(`Error fetching category with ID ${id}:`, error);
		res.status(500).json({ message: `Error fetching category with ID ${id}`, error: error.message });
	}
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
	try {
		const categoryData = CreateCategoryInputSchema.parse(req.body);

		const newCategory = await prisma.category.create({
			data: categoryData,
			include: {
				// Include relations in the response
				parent: true,
				children: true,
			},
		});

		res.status(201).json(newCategory);
	} catch (error: any) {
		if (error.code === "P2002" && error.meta?.target?.includes("name")) {
			return res.status(409).json({ message: "Category with this name already exists" });
		}
		// Handle potential foreign key constraint violation if parentId is invalid
		if (error.code === "P2003") {
			return res.status(400).json({ message: "Invalid parent category ID" });
		}
		console.error("Error creating category:", error);
		res.status(500).json({ message: "Error creating category", error: error.message });
	}
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const categoryData = UpdateCategoryInputSchema.parse(req.body);

		// Optional: Add logic to prevent a category from being its own parent or a descendant of itself

		const updatedCategory = await prisma.category.update({
			where: { id },
			data: categoryData,
			include: {
				// Include relations in the response
				parent: true,
				children: true,
			},
		});

		res.status(200).json(updatedCategory);
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "Category not found" });
		}
		if (error.code === "P2002" && error.meta?.target?.includes("name")) {
			return res.status(409).json({ message: "Category with this name already exists" });
		}
		if (error.code === "P2003") {
			// Invalid parentId
			return res.status(400).json({ message: "Invalid parent category ID" });
		}
		console.error(`Error updating category with ID ${id}:`, error);
		res.status(500).json({ message: `Error updating category with ID ${id}`, error: error.message });
	}
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		// Note: Prisma's default cascade delete behavior will apply based on your schema.
		// If a category is a parent, deleting it might require deleting children first,
		// or you might need to set null for parentId in children depending on the schema.
		// Your schema uses `onDelete: SetNull` for parentId, so children's parentId will be set to null.
		// Deleting a category that is linked to products (ProductCategory) might fail due to Restrict or Cascade.
		// Your schema has `onDelete: Cascade` for ProductCategory, so related links will be deleted.

		const deletedCategory = await prisma.category.delete({
			where: { id },
			include: {
				// Include relations in the response
				parent: true,
				children: true,
			},
		});

		res.status(200).json({ message: "Category deleted successfully", category: deletedCategory });
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "Category not found" });
		}
		// P2003 might occur if there are related records with Restrict onDelete
		if (error.code === "P2003") {
			return res
				.status(409)
				.json({
					message: "Cannot delete category because it is referenced by other records (e.g., products or subcategories)",
				});
		}
		console.error(`Error deleting category with ID ${id}:`, error);
		res.status(500).json({ message: `Error deleting category with ID ${id}`, error: error.message });
	}
};
