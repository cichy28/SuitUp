import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  basePrice: z.number(),
  isActive: z.boolean(),
  ownerId: z.string().cuid(),
  mainImageId: z.string().cuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateProductInputSchema = z.object({
  name: z.string(),
  basePrice: z.number(),
  isActive: z.boolean().optional(),
  ownerId: z.string().cuid(),
  mainImageId: z.string().cuid().optional(),
});

export const UpdateProductInputSchema = z.object({
  name: z.string().optional(),
  basePrice: z.number().optional(),
  isActive: z.boolean().optional(),
  ownerId: z.string().cuid().optional(),
  mainImageId: z.string().cuid().optional().nullable(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update.",
});