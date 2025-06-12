import { z } from 'zod';

export const propertySchema = z.object({
  name: z.string().min(1, 'Nazwa jest wymagana'),
  description: z.string().optional(),
  imageUrl: z.string().url('Nieprawidłowy URL').optional().or(z.literal('')),
  additionalPrice: z.number().min(0, 'Cena musi być nieujemna'),
});

export const imageSchema = z.object({
  imageUrl: z.string().url('Nieprawidłowy URL').min(1, 'URL obrazka jest wymagany'),
});

