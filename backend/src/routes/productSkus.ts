import { Router } from "express";
import {
	getAllProductSkus,
	getProductSkuById,
	createProductSku,
	updateProductSku,
	deleteProductSku,
} from "../controllers/productSkusController";
import validateRequest from "../middleware/validateRequest";
import { CreateProductSkuInputSchema, UpdateProductSkuInputSchema } from "../../../shared/validators/productSku";
import { z } from "zod";

const router = Router();

// Define a ZOD schema for validating the 'id' parameter in the URL
const ProductSkuIdParamSchema = z.object({
	id: z.string().cuid(), // Ensure the ID is a valid CUID
});

// GET all product SKUs
router.get("/", getAllProductSkus);

// GET product SKU by ID
router.get("/:id", validateRequest(z.object({ params: ProductSkuIdParamSchema })), getProductSkuById);

// POST create new product SKU
router.post("/", validateRequest(z.object({ body: CreateProductSkuInputSchema })), createProductSku);

// PUT update product SKU by ID
router.put(
	"/:id",
	validateRequest(
		z.object({
			params: ProductSkuIdParamSchema,
			body: UpdateProductSkuInputSchema,
		})
	),
	updateProductSku
);

// DELETE product SKU by ID
router.delete("/:id", validateRequest(z.object({ params: ProductSkuIdParamSchema })), deleteProductSku);

// TODO: Add routes for managing ProductSkuPropertyVariants for a given ProductSku
// e.g., POST /api/product-skus/:skuId/variants (to link a variant)
// e.g., DELETE /api/product-skus/:skuId/variants/:variantId (to unlink a variant)

export { router };
