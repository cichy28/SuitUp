import { Router } from "express";
import {
	getAllCustomers,
	getCustomerById,
	createCustomer,
	updateCustomer,
	deleteCustomer,
} from "../controllers/customersController";
import validateRequest from "../middleware/validateRequest";
import { CreateCustomerInputSchema, UpdateCustomerInputSchema } from "../../../shared/validators/customer";
import { z } from "zod";

const router = Router();

// Define a ZOD schema for validating the 'id' parameter in the URL
const CustomerIdParamSchema = z.object({
	id: z.string().cuid(), // Ensure the ID is a valid CUID
});

// GET all customers
router.get("/", getAllCustomers);

// GET customer by ID
// Use a middleware to validate the 'id' parameter
router.get("/:id", validateRequest(z.object({ params: CustomerIdParamSchema })), getCustomerById);

// POST create new customer
// Use middleware to validate the request body using CreateCustomerInputSchema
router.post("/", validateRequest(z.object({ body: CreateCustomerInputSchema })), createCustomer);

// PUT update customer by ID
// Use middleware to validate both the 'id' parameter and the request body
router.put(
	"/:id",
	validateRequest(
		z.object({
			params: CustomerIdParamSchema,
			body: UpdateCustomerInputSchema,
		})
	),
	updateCustomer
);

// DELETE customer by ID
// Use a middleware to validate the 'id' parameter
router.delete("/:id", validateRequest(z.object({ params: CustomerIdParamSchema })), deleteCustomer);

export { router };
