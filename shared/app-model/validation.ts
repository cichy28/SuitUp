import { ZodError } from 'zod';

/**
 * Converts Zod validation errors to Formik-compatible error format
 * @param zodError - The Zod error object
 * @returns Object with field names as keys and error messages as values
 */
export const zodToFormikErrors = (zodError: ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  zodError.errors.forEach((error) => {
    if (error.path.length > 0) {
      const fieldName = error.path.join('.');
      errors[fieldName] = error.message;
    }
  });
  
  return errors;
};

/**
 * Creates a Formik-compatible validation function from a Zod schema
 * @param schema - The Zod schema to use for validation
 * @returns Validation function for Formik
 */
export const createZodValidation = <T>(schema: any) => {
  return (values: T) => {
    try {
      schema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof ZodError) {
        return zodToFormikErrors(error);
      }
      return {};
    }
  };
};

