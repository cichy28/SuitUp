// Zaktualizowany plik: backend/src/middleware/validateRequest.ts
import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

const validateRequest = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
	try {
		// Nowy, poprawny sposób walidacji:
		// Walidujemy obiekt, który zawiera body, query i params z zapytania.
		// Zod sprawdzi tylko te klucze (body, query, params), które są zdefiniowane w przekazanym schemacie.
		schema.parse({
			body: req.body,
			query: req.query,
			params: req.params,
		});

		next();
	} catch (error: any) {
		if (error instanceof ZodError) {
			return res.status(400).json({
				message: "Validation failed",
				errors: error.errors,
			});
		}
		// Przekazujemy inne błędy do domyślnej obsługi błędów Express
		next(error);
	}
};

export default validateRequest;
