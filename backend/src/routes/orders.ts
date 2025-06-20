import { Router } from "express";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from "../controllers/ordersController";
import validateRequest from "../middleware/validateRequest";
import { CreateOrderInputSchema, UpdateOrderInputSchema } from "../../../shared/validators/order";
import { z } from "zod";

const router = Router();

// Define a ZOD schema for validating the 'id' parameter in the URL
const OrderIdParamSchema = z.object({
	id: z.string().cuid(), // Ensure the ID is a valid CUID
});

// GET all orders
router.get("/", getAllOrders);

// GET order by ID
router.get("/:id", validateRequest(z.object({ params: OrderIdParamSchema })), getOrderById);

// POST create new order
router.post("/", validateRequest(z.object({ body: CreateOrderInputSchema })), createOrder);

// PUT update order by ID
router.put(
	"/:id",
	validateRequest(
		z.object({
			params: OrderIdParamSchema,
			body: UpdateOrderInputSchema,
		})
	),
	updateOrder
);

// DELETE order by ID
router.delete("/:id", validateRequest(z.object({ params: OrderIdParamSchema })), deleteOrder);

// TODO: Add routes for managing OrderItems within an Order (e.g., POST /api/orders/:orderId/items, DELETE /api/orders/:orderId/items/:itemId, PUT /api/orders/:orderId/items/:itemId)

export { router };
