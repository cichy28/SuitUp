import { Router } from "express";
import {
	getAllProperties,
	getPropertyById,
	createProperty,
	updateProperty,
	deleteProperty,
} from "../controllers/propertiesController";
import validateRequest from "../middleware/validateRequest";
import { CreatePropertyInputSchema, UpdatePropertyInputSchema } from "../../../shared/validators/property";
import { z } from "zod";

const router = Router();

// Define a ZOD schema for validating the 'id' parameter in the URL
const PropertyIdParamSchema = z.object({
	id: z.string().cuid(), // Ensure the ID is a valid CUID
});

// GET all properties
router.get("/", getAllProperties);

// GET property by ID
router.get("/:id", validateRequest(z.object({ params: PropertyIdParamSchema })), getPropertyById);

// POST create new property
router.post("/", validateRequest(z.object({ body: CreatePropertyInputSchema })), createProperty);

// PUT update property by ID
router.put(
	"/:id",
	validateRequest(
		z.object({
			params: PropertyIdParamSchema,
			body: UpdatePropertyInputSchema,
		})
	),
	updateProperty
);

// DELETE property by ID
router.delete("/:id", validateRequest(z.object({ params: PropertyIdParamSchema })), deleteProperty);

// TODO: Consider adding routes for managing PropertyVariants associated with a Property

export { router };
