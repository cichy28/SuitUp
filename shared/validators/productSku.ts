import { z } from "zod";
import { MultimediaSchema } from "./multimedia";

// Basic Schema (corresponding to Prisma model for reading)
export const ProductSkuSchema = z.object({
	id: z.string().cuid(),
	productId: z.string().cuid(),
	skuCode: z.string().nullable(),
	price: z.number().nullable(), // This is the old price field, might be deprecated or used for something else
	stockQuantity: z.number().int().nonnegative(),
	priceMultiplier: z.number().optional().nullable(), // Now optional, as it has a default in Prisma
	skuBasePrice: z.number().optional(), // Calculated on backend
	finalPrice: z.number().optional(), // Calculated on backend
	createdAt: z.date(),
	updatedAt: z.date(),
	image: MultimediaSchema.optional().nullable(),
});

// Input Schemas (for creating/updating records)

export const CreateProductSkuInputSchema = z.object({
	productId: z.string().cuid(), // Product must be assigned
	skuCode: z.string().optional().nullable(), // skuCode can be optional/nullable based on schema
	price: z.number().optional().nullable(), // Price can be optional/nullable
	stockQuantity: z.number().int().nonnegative().optional(), // Stock quantity optional, will default in Prisma
	priceMultiplier: z.number().optional().nullable(), // New field
	// Note: Linking PropertyVariants on creation might require a nested structure here
	// or separate endpoints after SKU creation. We'll handle just basic fields for now.
});

export const UpdateProductSkuInputSchema = z
	.object({
		skuCode: z.string().optional().nullable(),
		price: z.number().optional().nullable(),
		stockQuantity: z.number().int().nonnegative().optional(),
		priceMultiplier: z.number().optional().nullable(), // New field
		// Note: Updating linked PropertyVariants might require a nested structure here
		// or separate endpoints. We'll handle just basic fields for now.
	})
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update.",
	});

// Schema for managing the link between ProductSku and PropertyVariant
// This might be used for separate endpoints like POST /api/product-skus/:skuId/variants
export const ProductSkuPropertyVariantInputSchema = z.object({
	propertyVariantId: z.string().cuid(),
	// Add other fields if needed for the link, e.g., value, assignment date (though schema uses default)
});

export type ProductSku = z.infer<typeof ProductSkuSchema>;
export type CreateProductSkuInput = z.infer<typeof CreateProductSkuInputSchema>;
export type UpdateProductSkuInput = z.infer<typeof UpdateProductSkuInputSchema>;
export type ProductSkuPropertyVariantInput = z.infer<typeof ProductSkuPropertyVariantInputSchema>;
