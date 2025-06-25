// Zaktualizowany plik: backend/src/controllers/recommendationsController.ts
import { Request, Response } from "express";
import prisma from "../db";
import { BodyShape, StylePreference } from "@prisma/client";

export const getRecommendations = async (req: Request, res: Response) => {
	// Pobieramy dane z req.query
	const { bodyShape } = req.query;
	let { styles } = req.query;
	// Upewniamy się, że 'styles' jest tablicą, zanim użyjemy go w Prisma.
	const stylesArray = typeof styles === "string" ? styles.split(",") : (styles as StylePreference[]);

	try {
		const products = await prisma.product.findMany({
			where: {
				isActive: true,
				suitableFor: {
					has: bodyShape as BodyShape,
				},
				style: {
					// Używamy nowo utworzonej tablicy
					hasSome: stylesArray,
				},
			},
			include: {
				mainImage: {
					select: { url: true, altText: true },
				},
			},
		});
		res.status(200).json(products);
	} catch (error: any) {
		console.error("Error fetching recommendations:", error);
		res.status(500).json({ message: "Error fetching recommendations", error: error.message });
	}
};
