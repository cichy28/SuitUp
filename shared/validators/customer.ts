import { z } from 'zod';

export const CustomerSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string().email(),
  phone: z.string().nullable(),
  address: z.object({}).passthrough().nullable(), // Assuming JSON can be any object
});

export const CreateCustomerInputSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(), // Email is unique and required
  phone: z.string().optional(),
  address: z.object({}).passthrough().optional(),
});

export const UpdateCustomerInputSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.object({}).passthrough().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update.",
});