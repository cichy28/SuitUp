import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validateRequest = (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // We can validate req.body, req.query, or req.params
      // For most CRUD operations (POST, PUT, PATCH), we'll validate req.body
      // For GET (by ID) or DELETE, we might validate req.params
      // For GET (list) with filters/pagination, we might validate req.query
      schema.parse(req.body); // Adjust based on what needs validation

      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: error.errors.map(e => ({
            path: e.path,
            message: e.message,
          })),
        });
      }
      // Pass other errors to the default error handler
      next(error);
    }
  };

export default validateRequest;