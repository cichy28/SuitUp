import { Router } from 'express';
import {
  getAllMultimedia,
  getMultimediaById,
  createMultimedia,
  updateMultimedia,
  deleteMultimedia,
} from '../controllers/multimediaController';
import validateRequest from '../middleware/validateRequest';
import { CreateMultimediaInputSchema, UpdateMultimediaInputSchema } from '../../shared/validators/multimedia';
import { z } from 'zod';

const router = Router();

// Define a ZOD schema for validating the 'id' parameter in the URL
const MultimediaIdParamSchema = z.object({
  id: z.string().cuid(), // Ensure the ID is a valid CUID
});

// GET all multimedia
router.get('/', getAllMultimedia);

// GET multimedia by ID
router.get('/:id', validateRequest(z.object({ params: MultimediaIdParamSchema })), getMultimediaById);

// POST create new multimedia (database record)
// Note: Actual file upload should be handled by a different middleware before this.
router.post('/', validateRequest(z.object({ body: CreateMultimediaInputSchema })), createMultimedia);

// PUT update multimedia by ID
router.put('/:id', validateRequest(z.object({
  params: MultimediaIdParamSchema,
  body: UpdateMultimediaInputSchema
})), updateMultimedia);

// DELETE multimedia by ID
router.delete('/:id', validateRequest(z.object({ params: MultimediaIdParamSchema })), deleteMultimedia);

export { router };