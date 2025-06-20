import { z } from "zod";

export const PropertySchema = z.object({
	id: z.string().cuid(),
	name: z.string(),
	type: z.string(), // Assuming property has a type
	description: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CreatePropertyInputSchema = z.object({
	name: z.string(),
	type: z.string(),
	description: z.string().optional(),
});

export const UpdatePropertyInputSchema = z
	.object({
		name: z.string().optional(),
		type: z.string().optional(),
		description: z.string().optional().nullable(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update.",
	});
