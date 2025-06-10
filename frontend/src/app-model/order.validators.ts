import { z } from 'zod';

export const checkoutSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Imię musi mieć co najmniej 2 znaki')
    .min(1, 'Imię jest wymagane'),
  lastName: z
    .string()
    .min(2, 'Nazwisko musi mieć co najmniej 2 znaki')
    .min(1, 'Nazwisko jest wymagane'),
  email: z
    .string()
    .email('Wprowadź poprawny adres email')
    .min(1, 'Email jest wymagany'),
  phone: z
    .string()
    .regex(/^[0-9]{9}$/, 'Numer telefonu musi mieć 9 cyfr')
    .min(1, 'Numer telefonu jest wymagany'),
  address: z
    .string()
    .min(5, 'Adres musi mieć co najmniej 5 znaków')
    .min(1, 'Adres jest wymagany'),
  city: z
    .string()
    .min(2, 'Miasto musi mieć co najmniej 2 znaki')
    .min(1, 'Miasto jest wymagane'),
  postalCode: z
    .string()
    .regex(/^[0-9]{2}-[0-9]{3}$/, 'Kod pocztowy musi być w formacie XX-XXX')
    .min(1, 'Kod pocztowy jest wymagany'),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

