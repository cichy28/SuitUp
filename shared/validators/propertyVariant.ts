import { z } from 'zod';

// Basic Schema (corresponding to Prisma model for reading)
export const PropertyVariantSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  propertyId: z.string().cuid(),
  imageId: z.string().cuid().nullable(),
  createdAt: z.date(),
});

// Input Schemas (for creating/updating records)

export const CreatePropertyVariantInputSchema = z.object({
  name: z.string(),
  propertyId: z.string().cuid(), // Property must be assigned
  imageId: z.string().cuid().optional().nullable(), // Image is optional
});

export const UpdatePropertyVariantInputSchema = z.object({
  name: z.string().optional(),
  propertyId: z.string().cuid().optional(), // Allow changing parent property?
  imageId: z.string().cuid().optional().nullable(), // Allow changing or removing image
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update.",
});