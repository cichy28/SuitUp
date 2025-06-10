import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(3, 'Nazwa musi mieć co najmniej 3 znaki')
    .min(1, 'Nazwa produktu jest wymagana'),
  description: z
    .string()
    .min(10, 'Opis musi mieć co najmniej 10 znaków')
    .min(1, 'Opis produktu jest wymagany'),
  basePrice: z
    .number()
    .min(1, 'Cena musi być większa od 0')
    .positive('Cena bazowa jest wymagana'),
  category: z
    .string()
    .min(1, 'Kategoria jest wymagana'),
});

export type ProductFormData = z.infer<typeof productSchema>;

