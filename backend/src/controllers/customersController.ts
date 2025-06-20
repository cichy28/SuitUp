import { Request, Response } from "express";
import prisma from "../db";
import { CreateCustomerInputSchema, UpdateCustomerInputSchema } from "../../../shared/validators/customer";

// Get all customers
export const getAllCustomers = async (req: Request, res: Response) => {
	try {
		const customers = await prisma.customer.findMany();
		res.status(200).json(customers);
	} catch (error: any) {
		console.error("Error fetching customers:", error);
		res.status(500).json({ message: "Error fetching customers", error: error.message });
	}
};

// Get customer by ID
export const getCustomerById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const customer = await prisma.customer.findUnique({
			where: { id },
		});

		if (!customer) {
			return res.status(404).json({ message: "Customer not found" });
		}

		res.status(200).json(customer);
	} catch (error: any) {
		console.error(`Error fetching customer with ID ${id}:`, error);
		res.status(500).json({ message: `Error fetching customer with ID ${id}`, error: error.message });
	}
};

// Create a new customer
export const createCustomer = async (req: Request, res: Response) => {
	try {
		// ZOD validation already happened in the middleware
		const customerData = CreateCustomerInputSchema.parse(req.body);

		const newCustomer = await prisma.customer.create({
			data: customerData,
		});

		res.status(201).json(newCustomer);
	} catch (error: any) {
		// This catch will primarily handle potential Prisma errors (e.g., unique constraint violation)
		// Zod validation errors are handled by the validateRequest middleware
		console.error("Error creating customer:", error);
		res.status(500).json({ message: "Error creating customer", error: error.message });
	}
};

// Update a customer
export const updateCustomer = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		// ZOD validation already happened in the middleware
		const customerData = UpdateCustomerInputSchema.parse(req.body);

		const updatedCustomer = await prisma.customer.update({
			where: { id },
			data: customerData,
		});

		res.status(200).json(updatedCustomer);
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "Customer not found" });
		}
		console.error(`Error updating customer with ID ${id}:`, error);
		res.status(500).json({ message: `Error updating customer with ID ${id}`, error: error.message });
	}
};

// Delete a customer
export const deleteCustomer = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const deletedCustomer = await prisma.customer.delete({
			where: { id },
		});

		res.status(200).json({ message: "Customer deleted successfully", customer: deletedCustomer });
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "Customer not found" });
		}
		console.error(`Error deleting customer with ID ${id}:`, error);
		res.status(500).json({ message: `Error deleting customer with ID ${id}`, error: error.message });
	}
};
