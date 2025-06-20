import { Request, Response } from "express";
import prisma from "../db";
import { CreatePropertyInputSchema, UpdatePropertyInputSchema } from "../../../shared/validators/property";
import { z } from "zod";

// Get all properties
export const getAllProperties = async (req: Request, res: Response) => {
	try {
		const properties = await prisma.property.findMany({
			include: {
				owner: {
					// Include owner details
					select: { id: true, email: true, companyName: true }, // Select specific user fields
				},
				propertyVariants: true, // Include related property variants
				products: {
					// Include products associated with this property
					include: {
						product: true, // Include product details
					},
				},
			},
		});
		res.status(200).json(properties);
	} catch (error: any) {
		console.error("Error fetching properties:", error);
		res.status(500).json({ message: "Error fetching properties", error: error.message });
	}
};

// Get property by ID
export const getPropertyById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const property = await prisma.property.findUnique({
			where: { id },
			include: {
				owner: {
					select: { id: true, email: true, companyName: true },
				},
				propertyVariants: true,
				products: {
					include: {
						product: true,
					},
				},
			},
		});

		if (!property) {
			return res.status(404).json({ message: "Property not found" });
		}

		res.status(200).json(property);
	} catch (error: any) {
		console.error(`Error fetching property with ID ${id}:`, error);
		res.status(500).json({ message: `Error fetching property with ID ${id}`, error: error.message });
	}
};

// Create a new property
export const createProperty = async (req: Request, res: Response) => {
	try {
		const propertyData = CreatePropertyInputSchema.parse(req.body);

		const newProperty = await prisma.property.create({
			data: propertyData,
			include: {
				// Include relations in the response
				owner: {
					select: { id: true, email: true, companyName: true },
				},
				propertyVariants: true,
			},
		});

		res.status(201).json(newProperty);
	} catch (error: any) {
		if (error.code === "P2002" && error.meta?.target?.includes("name")) {
			return res.status(409).json({ message: "Property with this name already exists" });
		}
		if (error.code === "P2003") {
			// Invalid ownerId
			return res.status(400).json({ message: "Invalid owner ID" });
		}
		console.error("Error creating property:", error);
		res.status(500).json({ message: "Error creating property", error: error.message });
	}
};

// Update a property
export const updateProperty = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const propertyData = UpdatePropertyInputSchema.parse(req.body);

		const updatedProperty = await prisma.property.update({
			where: { id },
			data: req.body,
			include: {
				// Include relations in the response
				owner: {
					select: { id: true, email: true, companyName: true },
				},
				propertyVariants: true,
			},
		});

		res.status(200).json(updatedProperty);
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "Property not found" });
		}
		if (error.code === "P2002" && error.meta?.target?.includes("name")) {
			return res.status(409).json({ message: "Property with this name already exists" });
		}
		if (error.code === "P2003") {
			// Invalid ownerId
			return res.status(400).json({ message: "Invalid owner ID" });
		}
		console.error(`Error updating property with ID ${id}:`, error);
		res.status(500).json({ message: `Error updating property with ID ${id}`, error: error.message });
	}
};

// Delete a property
export const deleteProperty = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		// Note: Deleting a Property might fail if it's still referenced by
		// ProductProperty or PropertyVariant depending on your schema's onDelete behavior.
		// Your schema has `onDelete: Cascade` for PropertyVariant and ProductProperty,
		// so related records should be deleted automatically.

		const deletedProperty = await prisma.property.delete({
			where: { id },
			include: {
				// Include relations in the response
				owner: {
					select: { id: true, email: true, companyName: true },
				},
				propertyVariants: true, // Include deleted variants in response (if not cascaded)
			},
		});

		res.status(200).json({ message: "Property deleted successfully", property: deletedProperty });
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "Property not found" });
		}
		// P2003 might occur if there's a Restrict onDelete somewhere else (less likely with Cascade)
		if (error.code === "P2003") {
			return res
				.status(409)
				.json({ message: "Cannot delete property because it is referenced by other records with Restrict onDelete" });
		}
		console.error(`Error deleting property with ID ${id}:`, error);
		res.status(500).json({ message: `Error deleting property with ID ${id}`, error: error.message });
	}
};
