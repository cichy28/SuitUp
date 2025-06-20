import { z } from "zod";

export const CategorySchema = z.object({
	id: z.string().cuid(),
	name: z.string(),
	description: z.string().nullable(),
	parentId: z.string().cuid().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const CreateCategoryInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	parentId: z.string().cuid().optional(),
});

export const UpdateCategoryInputSchema = z
	.object({
		name: z.string().optional(),
		description: z.string().optional(),
		parentId: z.string().cuid().optional().nullable(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update.",
	});

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategoryInputSchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategoryInputSchema>;
