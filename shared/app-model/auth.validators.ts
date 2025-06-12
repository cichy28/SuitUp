import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("Wprowadź poprawny adres email").min(1, "Email jest wymagany"),
	password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków").min(1, "Hasło jest wymagane"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
	.object({
		name: z.string().min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki").min(1, "Imię i nazwisko jest wymagane"),
		email: z.string().email("Wprowadź poprawny adres email").min(1, "Email jest wymagany"),
		password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków").min(1, "Hasło jest wymagane"),
		confirmPassword: z.string().min(1, "Potwierdzenie hasła jest wymagane"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Hasła muszą być identyczne",
		path: ["confirmPassword"],
	});

export type RegisterFormData = z.infer<typeof registerSchema>;
