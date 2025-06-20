import { Router } from 'express';
import {
  getAllPropertyVariants,
  getPropertyVariantById,
  createPropertyVariant,
  updatePropertyVariant,
  deletePropertyVariant,
} from '../controllers/propertyVariantsController';
import validateRequest from '../middleware/validateRequest';
import { CreatePropertyVariantInputSchema, UpdatePropertyVariantInputSchema } from '../../shared/validators/propertyVariant';
import { z } from 'zod';

const router = Router();

// Define a ZOD schema for validating the 'id' parameter in the URL
const PropertyVariantIdParamSchema = z.object({
  id: z.string().cuid(), // Ensure the ID is a valid CUID
});

// GET all property variants
router.get('/', getAllPropertyVariants);

// GET property variant by ID
router.get('/:id', validateRequest(z.object({ params: PropertyVariantIdParamSchema })), getPropertyVariantById);

// POST create new property variant
router.post('/', validateRequest(z.object({ body: CreatePropertyVariantInputSchema })), createPropertyVariant);

// PUT update property variant by ID
router.put('/:id', validateRequest(z.object({
  params: PropertyVariantIdParamSchema,
  body: UpdatePropertyVariantInputSchema
})), updatePropertyVariant);

// DELETE property variant by ID
router.delete('/:id', validateRequest(z.object({ params: PropertyVariantIdParamSchema })), deletePropertyVariant);

// TODO: Consider adding endpoints for managing the link between ProductSku and PropertyVariant
// These might be part of the ProductSku routes, but dedicated endpoints here are also possible.
// e.g., GET /api/property-variants/:variantId/product-skus (to get SKUs linked to this variant)

export { router };