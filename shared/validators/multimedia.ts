import { z } from "zod";
import { FileType } from "../enums";

export const MultimediaSchema = z.object({
	id: z.string().cuid(),
	url: z.string().url(),
	fileType: FileType,
	altText: z.string().nullable(),
	ownerId: z.string().cuid(),
	createdAt: z.date(),
});

export const CreateMultimediaInputSchema = z.object({
	url: z.string().url(),
	fileType: FileType,
	altText: z.string().optional(),
	ownerId: z.string().cuid(),
});

export const UpdateMultimediaInputSchema = z
	.object({
		url: z.string().url().optional(),
		fileType: FileType.optional(),
		altText: z.string().optional().nullable(),
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update.",
	});

export type Multimedia = z.infer<typeof MultimediaSchema>;
export type CreateMultimediaInput = z.infer<typeof CreateMultimediaInputSchema>;
export type UpdateMultimediaInput = z.infer<typeof UpdateMultimediaInputSchema>;
