import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/usersController";
import validateRequest from "../middleware/validateRequest";
import { CreateUserInputSchema, UpdateUserInputSchema } from "../../../shared/validators/user";
import { z } from "zod";

const router = Router();

// Define a ZOD schema for validating the 'id' parameter in the URL
const UserIdParamSchema = z.object({
	id: z.string().cuid(), // Ensure the ID is a valid CUID
});

// GET all users
router.get("/", getAllUsers);

// GET user by ID
router.get("/:id", validateRequest(z.object({ params: UserIdParamSchema })), getUserById);

// POST create new user
router.post("/", validateRequest(z.object({ body: CreateUserInputSchema })), createUser);

// PUT update user by ID
router.put(
	"/:id",
	validateRequest(
		z.object({
			params: UserIdParamSchema,
			body: UpdateUserInputSchema,
		})
	),
	updateUser
);

// DELETE user by ID
router.delete("/:id", validateRequest(z.object({ params: UserIdParamSchema })), deleteUser);

export { router };
