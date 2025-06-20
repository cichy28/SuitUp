import { Router } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoriesController';
import validateRequest from '../middleware/validateRequest';
import { CreateCategoryInputSchema, UpdateCategoryInputSchema } from '../../shared/validators/category';
import { z } from 'zod';

const router = Router();

// Define a ZOD schema for validating the 'id' parameter in the URL
const CategoryIdParamSchema = z.object({
  id: z.string().cuid(), // Ensure the ID is a valid CUID
});

// GET all categories
router.get('/', getAllCategories);

// GET category by ID
router.get('/:id', validateRequest(z.object({ params: CategoryIdParamSchema })), getCategoryById);

// POST create new category
router.post('/', validateRequest(z.object({ body: CreateCategoryInputSchema })), createCategory);

// PUT update category by ID
router.put('/:id', validateRequest(z.object({
  params: CategoryIdParamSchema,
  body: UpdateCategoryInputSchema
})), updateCategory);

// DELETE category by ID
router.delete('/:id', validateRequest(z.object({ params: CategoryIdParamSchema })), deleteCategory);

export { router };