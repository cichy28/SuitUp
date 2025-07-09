import { Request, Response } from "express";
import prisma from "../db";
import { BodyShape, StylePreference } from "@prisma/client";

export const getRecommendations = async (req: Request, res: Response) => {
	const { bodyShape, styles } = req.query;

	if (!bodyShape || !styles) {
		return res.status(400).json({ message: "Body shape and styles are required." });
	}

	const stylesArray = Array.isArray(styles) ? styles : [styles as string];

	try {
		const products = await prisma.product.findMany({
			where: {
				isActive: true,
				suitableFor: {
					has: bodyShape as BodyShape,
				},
				style: {
					hasSome: stylesArray as StylePreference[],
				},
			},
			include: {
				mainImage: {
					select: { url: true, altText: true },
				},
				skus: {
					include: {
						propertyVariants: {
							include: {
								propertyVariant: {
									select: { priceAdjustment: true },
								},
							},
						},
					},
				},
			},
		});

		const productsWithPrices = products.map((product) => {
			const skusWithPrices = product.skus.map((sku) => {
				const totalVariantPriceAdjustment = sku.propertyVariants.reduce((sum, pv) => {
					return sum + (pv.propertyVariant?.priceAdjustment?.toNumber() || 0);
				}, 0);

				const skuBasePrice = (product.basePrice?.toNumber() || 0) + totalVariantPriceAdjustment;
				const finalPrice = parseFloat((skuBasePrice * (sku.priceMultiplier?.toNumber() || 1)).toFixed(2));

				return {
					...sku,
					skuBasePrice: parseFloat(skuBasePrice.toFixed(2)),
					finalPrice,
					priceMultiplier: sku.priceMultiplier?.toNumber() || 1,
				};
			});

			return {
				...product,
				skus: skusWithPrices,
			};
		});

		res.status(200).json(productsWithPrices);
	} catch (error: any) {
		console.error("Error fetching recommendations:", error);
		res.status(500).json({ message: "Error fetching recommendations", error: error.message });
	}
};
