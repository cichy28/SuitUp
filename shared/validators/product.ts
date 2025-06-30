import { z } from "zod";
import { BodyShape, StylePreference } from "../enums";

export const ProductSchema = z.object({
	id: z.string().cuid(),
	name: z.string(),
	description: z.string().nullable(),
	basePrice: z.number(),
	isActive: z.boolean(),
	suitableFor: z.array(BodyShape).optional(),
	style: z.array(StylePreference).optional(),
	ownerId: z.string().cuid(),
	mainImageId: z.string().cuid().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CreateProductInputSchema = z.object({
	name: z.string(),
	description: z.string().optional().nullable(),
	basePrice: z.number(),
	isActive: z.boolean().optional(),
	suitableFor: z.array(BodyShape).optional(),
	style: z.array(StylePreference).optional(),
	ownerId: z.string().cuid(),
	mainImageId: z.string().cuid().optional(),
});

export const UpdateProductInputSchema = z
	.object({
		name: z.string().optional(),
		description: z.string().optional().nullable(),
		basePrice: z.number().optional(),
		isActive: z.boolean().optional(),
		suitableFor: z.array(BodyShape).optional(),
		style: z.array(StylePreference).optional(),
		ownerId: z.string().cuid().optional(),
		mainImageId: z.string().cuid().optional().nullable(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update.",
	});

export type Product = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductInputSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductInputSchema>;
