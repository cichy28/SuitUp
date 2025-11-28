import { Request, Response } from "express";
import prisma from "../db";
import { CreateMultimediaInputSchema, UpdateMultimediaInputSchema } from "../../../shared/validators/multimedia";
import { z } from "zod";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000"; // Base URL for the backend API

// Helper function to prepend API_BASE_URL if the URL is relative
const formatMultimediaUrl = (multimedia: any) => {
    if (multimedia && multimedia.url && multimedia.url.startsWith('/uploads/')) {
        return { ...multimedia, url: `${API_BASE_URL}${multimedia.url}` };
    }
    return multimedia;
};

// Get all multimedia
export const getAllMultimedia = async (req: Request, res: Response) => {
	try {
		const multimedia = await prisma.multimedia.findMany({
			include: {
				owner: {
					// Include owner details
					select: { id: true, email: true, companyName: true }, // Select specific user fields
				},
			},
		});
		const formattedMultimedia = multimedia.map(formatMultimediaUrl); // Format URLs
		res.status(200).json(formattedMultimedia);
	} catch (error: any) {
		console.error("Error fetching multimedia:", error);
		res.status(500).json({ message: "Error fetching multimedia", error: error.message });
	}
};

// Get multimedia by ID
export const getMultimediaById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const multimedia = await prisma.multimedia.findUnique({
			where: { id },
			include: {
				owner: {
					select: { id: true, email: true, companyName: true },
				},
			},
		});

		if (!multimedia) {
			return res.status(404).json({ message: "Multimedia not found" });
		}

		const formattedMultimedia = formatMultimediaUrl(multimedia); // Format URL
		res.status(200).json(formattedMultimedia);
	} catch (error: any) {
		console.error(`Error fetching multimedia with ID ${id}:`, error);
		res.status(500).json({ message: `Error fetching multimedia with ID ${id}`, error: error.message });
	}
};

// Create a new multimedia record
// Note: This endpoint primarily handles creating the database record.
// Actual file upload logic would need to be handled separately (e.g., using a different middleware like multer)
// before calling this controller function, and the 'url' would likely come from the upload result.
export const createMultimedia = async (req: Request, res: Response) => {
	try {
		const multimediaData = CreateMultimediaInputSchema.parse(req.body);

		const newMultimedia = await prisma.multimedia.create({
			data: multimediaData,
			include: {
				// Include relations in the response
				owner: {
					select: { id: true, email: true, companyName: true },
				},
			},
		});

		res.status(201).json(newMultimedia);
	} catch (error: any) {
		// Handle potential Prisma errors (e.g., invalid ownerId)
		if (error.code === "P2003") {
			return res.status(400).json({ message: "Invalid owner ID" });
		}
		console.error("Error creating multimedia:", error);
		res.status(500).json({ message: "Error creating multimedia", error: error.message });
	}
};

// Update a multimedia record
export const updateMultimedia = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const multimediaData = UpdateMultimediaInputSchema.parse(req.body);

		const updatedMultimedia = await prisma.multimedia.update({
			where: { id },
			data: multimediaData,
			include: {
				// Include relations in the response
				owner: {
					select: { id: true, email: true, companyName: true },
				},
			},
		});

		res.status(200).json(updatedMultimedia);
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "Multimedia not found" });
		}
		if (error.code === "P2003") {
			// Invalid ownerId
			return res.status(400).json({ message: "Invalid owner ID" });
		}
		console.error(`Error updating multimedia with ID ${id}:`, error);
		res.status(500).json({ message: `Error updating multimedia with ID ${id}`, error: error.message });
	}
};

// Delete a multimedia record
export const deleteMultimedia = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		// Note: Deleting a multimedia record might fail if it's still referenced by
		// other models (User, Product, PropertyVariant) depending on your schema's onDelete behavior.
		// Your schema uses `onDelete: SetNull` for these relations, so deleting the Multimedia
		// should succeed, and the foreign keys in related tables will be set to null.

		const deletedMultimedia = await prisma.multimedia.delete({
			where: { id },
			include: {
				// Include relations in the response
				owner: {
					select: { id: true, email: true, companyName: true },
				},
			},
		});

		res.status(200).json({ message: "Multimedia deleted successfully", multimedia: deletedMultimedia });
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "Multimedia not found" });
		}
		// P2003 might occur if there's a Restrict onDelete somewhere else (less likely with SetNull)
		if (error.code === "P2003") {
			return res
				.status(409)
				.json({ message: "Cannot delete multimedia because it is referenced by other records with Restrict onDelete" });
		}
		console.error(`Error deleting multimedia with ID ${id}:`, error);
		res.status(500).json({ message: `Error deleting multimedia with ID ${id}`, error: error.message });
	}
};
