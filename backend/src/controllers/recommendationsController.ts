import { Request, Response } from "express";
import prisma from "../db";
import { BodyShape, StylePreference } from "@prisma/client";

export const getRecommendations = async (req: Request, res: Response) => {
	const { bodyShape, styles } = req.query;

	try {
		const products = await prisma.product.findMany({
			where: {
				isActive: true,
				suitableFor: {
					has: bodyShape as BodyShape,
				},
				style: {
					hasSome: styles as StylePreference[],
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
