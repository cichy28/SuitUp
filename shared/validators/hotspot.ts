import { z } from "zod";

export const HotspotSchema = z.object({
	id: z.string().cuid(),
	x: z.number(),
	y: z.number(),
	propertyId: z.string().cuid(),
	productId: z.string().cuid(),
	createdAt: z.date(),
});

export type Hotspot = z.infer<typeof HotspotSchema>;

export const CreateHotspotInputSchema = HotspotSchema.pick({
	x: true,
	y: true,
	propertyId: true,
	productId: true,
});

export type CreateHotspotInput = z.infer<typeof CreateHotspotInputSchema>;

export const UpdateHotspotInputSchema = CreateHotspotInputSchema.partial().refine(
	(data) => Object.keys(data).length > 0,
	{
		message: "At least one field must be provided for update.",
	}
);

export type UpdateHotspotInput = z.infer<typeof UpdateHotspotInputSchema>;
