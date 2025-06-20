import { z } from "zod";

export const PropertySchema = z.object({
	id: z.string().cuid(),
	name: z.string(),
	// type: z.string(), // Usunięte - brak w schemacie Prisma
	// description: z.string().nullable(), // Usunięte - brak w schemacie Prisma
	isGlobal: z.boolean(), // Dodane/Poprawione zgodnie z Prisma
	ownerId: z.string().cuid().nullable(), // Istniało, zgodne z Prisma
	createdAt: z.date(),
	// updatedAt: z.date(), // Usunięte - brak w schemacie Prisma
});

export const CreatePropertyInputSchema = z.object({
	name: z.string(),
	// type: z.string(), // Usunięte - brak w schemacie Prisma
	// description: z.string().optional(), // Usunięte - brak w schemacie Prisma
	isGlobal: z.boolean().optional(), // Dodane - ma wartość domyślną w Prisma
	ownerId: z.string().cuid().optional().nullable(), // Dodane/Poprawione - opcjonalne i nullable w Prisma
});

export const UpdatePropertyInputSchema = z
	.object({
		name: z.string().optional(),
		// type: z.string().optional(), // Usunięte - brak w schemacie Prisma
		// description: z.string().optional().nullable(), // Usunięte - brak w schemacie Prisma
		isGlobal: z.boolean().optional(), // Dodane - można opcjonalnie aktualizować
		ownerId: z.string().cuid().optional().nullable(), // Dodane/Poprawione - można opcjonalnie aktualizować/ustawić na null
	})
	.refine((data: any) => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update.",
	});

export type Property = z.infer<typeof PropertySchema>;
export type CreatePropertyInput = z.infer<typeof CreatePropertyInputSchema>;
export type UpdatePropertyInput = z.infer<typeof UpdatePropertyInputSchema>;
