import { Router } from "express";
import {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
} from "../controllers/productsController";
import validateRequest from "../middleware/validateRequest";
import { CreateProductInputSchema, UpdateProductInputSchema } from "../../../shared/validators/product";
import { z } from "zod";

const router = Router();

// Define a ZOD schema for validating the 'id' parameter in the URL
const ProductIdParamSchema = z.object({
	id: z.string().cuid(), // Ensure the ID is a valid CUID
});

// GET all products
router.get("/", getAllProducts);

// GET product by ID
router.get("/:id", validateRequest(z.object({ params: ProductIdParamSchema })), getProductById);

// POST create new product
router.post("/", validateRequest(z.object({ body: CreateProductInputSchema })), createProduct);

// PUT update product by ID
router.put(
	"/:id",
	validateRequest(
		z.object({
			params: ProductIdParamSchema,
			body: UpdateProductInputSchema,
		})
	),
	updateProduct
);

// DELETE product by ID
router.delete("/:id", validateRequest(z.object({ params: ProductIdParamSchema })), deleteProduct);

export { router };
