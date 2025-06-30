import { z } from "zod";

export const PropertySchema = z.object({
	id: z.string().cuid(),
	name: z.string(),
	description: z.string().nullable().optional(),
	isGlobal: z.boolean(),
	displayOrder: z.number().int().optional(),
	ownerId: z.string().cuid().nullable(),
	createdAt: z.date(),
});

export const CreatePropertyInputSchema = z.object({
	name: z.string(),
	description: z.string().optional().nullable(),
	isGlobal: z.boolean().optional(),
	displayOrder: z.number().int().optional(),
	ownerId: z.string().cuid().optional().nullable(),
});

export const UpdatePropertyInputSchema = z
	.object({
		name: z.string().optional(),
		description: z.string().optional().nullable(),
		isGlobal: z.boolean().optional(),
		displayOrder: z.number().int().optional(),
		ownerId: z.string().cuid().optional().nullable(),
	})
	.refine((data: any) => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update.",
	});

export type Property = z.infer<typeof PropertySchema>;
export type CreatePropertyInput = z.infer<typeof CreatePropertyInputSchema>;
export type UpdatePropertyInput = z.infer<typeof UpdatePropertyInputSchema>;
