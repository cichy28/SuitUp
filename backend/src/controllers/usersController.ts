import { Request, Response } from "express";
import prisma from "../db";
import { CreateUserInputSchema, UpdateUserInputSchema } from "../../../shared/validators/user";

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
	try {
		// Exclude sensitive fields like password
		const users = await prisma.user.findMany({
			select: {
				id: true,
				email: true,
				companyName: true,
				companyData: true,
				role: true,
				logoId: true,
				startScreenImageId: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		res.status(200).json(users);
	} catch (error: any) {
		console.error("Error fetching users:", error);
		res.status(500).json({ message: "Error fetching users", error: error.message });
	}
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		// Exclude sensitive fields like password
		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				companyName: true,
				companyData: true,
				role: true,
				logoId: true,
				startScreenImageId: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (error: any) {
		console.error(`Error fetching user with ID ${id}:`, error);
		res.status(500).json({ message: `Error fetching user with ID ${id}`, error: error.message });
	}
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
	try {
		const userData = CreateUserInputSchema.parse(req.body);
		// TODO: Implement password hashing before saving to DB

		const newUser = await prisma.user.create({
			data: userData, // Warning: Saving plain password for now
		});

		// Return user without password
		const { password, ...userWithoutPassword } = newUser;

		res.status(201).json(userWithoutPassword);
	} catch (error: any) {
		if (error.code === "P2002" && error.meta?.target?.includes("email")) {
			return res.status(409).json({ message: "User with this email already exists" });
		}
		console.error("Error creating user:", error);
		res.status(500).json({ message: "Error creating user", error: error.message });
	}
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const userData = UpdateUserInputSchema.parse(req.body);
		// TODO: Handle password update separately and securely

		const updatedUser = await prisma.user.update({
			where: { id },
			data: userData,
			select: {
				// Return updated user without password
				id: true,
				email: true,
				companyName: true,
				companyData: true,
				role: true,
				logoId: true,
				startScreenImageId: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		res.status(200).json(updatedUser);
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "User not found" });
		}
		if (error.code === "P2002" && error.meta?.target?.includes("email")) {
			return res.status(409).json({ message: "User with this email already exists" });
		}
		console.error(`Error updating user with ID ${id}:`, error);
		res.status(500).json({ message: `Error updating user with ID ${id}`, error: error.message });
	}
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const deletedUser = await prisma.user.delete({
			where: { id },
			select: {
				// Return deleted user without password
				id: true,
				email: true,
				companyName: true,
				companyData: true,
				role: true,
				logoId: true,
				startScreenImageId: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		res.status(200).json({ message: "User deleted successfully", user: deletedUser });
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "User not found" });
		}
		// TODO: Handle potential foreign key constraints if user has related records
		console.error(`Error deleting user with ID ${id}:`, error);
		res.status(500).json({ message: `Error deleting user with ID ${id}`, error: error.message });
	}
};
