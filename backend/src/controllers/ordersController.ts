import { Request, Response } from "express";
import prisma from "../db";
import { CreateOrderInputSchema, UpdateOrderInputSchema } from "../../../shared/validators/order";
import { z } from "zod";
import { sendOrderConfirmationEmail } from "../services/emailService"; // Import the email service
import * as fs from 'fs/promises'; // Import fs for reading templates
import * as path from 'path'; // Import path for resolving template paths
import { Order, Customer, User, OrderItem, ProductSku, Product, Prisma } from '@prisma/client'; // Import Prisma types

// Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
	try {
		const orders = await prisma.order.findMany({
			include: {
				customer: true, // Include customer details
				producer: {
					// Include producer (User) details
					select: { id: true, email: true, companyName: true }, // Select specific user fields
				},
				items: {
					// Include order items
					include: {
						productSku: {
							// Include product SKU details for each item
							include: {
								product: true, // Optionally include product details for the SKU
							},
						},
					},
				},
			},
		});
		res.status(200).json(orders);
	} catch (error: any) {
		console.error("Error fetching orders:", error);
		res.status(500).json({ message: "Error fetching orders", error: error.message });
	}
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const order = await prisma.order.findUnique({
			where: { id },
			include: {
				customer: true,
				producer: {
					select: { id: true, email: true, companyName: true },
				},
				items: {
					include: {
						productSku: {
							include: {
								product: true,
							},
						},
					},
				},
			},
		});

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		res.status(200).json(order);
	} catch (error: any) {
		console.error(`Error fetching order with ID ${id}:`, error);
		res.status(500).json({ message: `Error fetching order with ID ${id}`, error: error.message });
	}
};

// Create a new order
// Note: Creating an order with items typically requires a more complex input structure.
// For simplicity here, we'll assume order creation is without items initially,
// and items are added via separate endpoints, or we'd need a nested ZOD schema.
// The current CreateOrderInputSchema does not include items.
export const createOrder = async (req: Request, res: Response) => {
	try {
		const orderData = CreateOrderInputSchema.parse(req.body);

		const newOrder = await prisma.order.create({
			data: orderData,
			include: {
				// Include relations in the response
				customer: true,
				producer: {
					select: { id: true, email: true, companyName: true },
				},
			},
		});

		res.status(201).json(newOrder);
	} catch (error: any) {
		// Handle potential Prisma errors (e.g., invalid customerId or producerId)
		if (error.code === "P2003") {
			return res.status(400).json({ message: "Invalid customer ID or producer ID" });
		}
		console.error("Error creating order:", error);
		res.status(500).json({ message: "Error creating order", error: error.message });
	}
};

// Update an order
export const updateOrder = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		const orderData = UpdateOrderInputSchema.parse(req.body);

		const updatedOrder = await prisma.order.update({
			where: { id },
			data: orderData,
			include: {
				// Include relations in the response
				customer: true,
				producer: {
					select: { id: true, email: true, companyName: true },
				},
				items: {
					// Include updated items if they were part of the update logic (not in current schema) a
					include: {
						productSku: true,
					},
				},
			},
		});

		res.status(200).json(updatedOrder);
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "Order not found" });
		}
		if (error.code === "P2003") {
			// Invalid customerId or producerId
			return res.status(400).json({ message: "Invalid customer ID or producer ID" });
		}
		console.error(`Error updating order with ID ${id}:`, error);
		res.status(500).json({ message: `Error updating order with ID ${id}`, error: error.message });
	}
};

// Delete an order
export const deleteOrder = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		// Note: Your schema has `onDelete: Cascade` for OrderItem, so deleting an order
		// will automatically delete its related order items.

		const deletedOrder = await prisma.order.delete({
			where: { id },
			include: {
				// Include relations in the response
				customer: true,
				producer: {
					select: { id: true, email: true, companyName: true },
				},
			},
		});

		res.status(200).json({ message: "Order deleted successfully", order: deletedOrder });
	} catch (error: any) {
		if (error.code === "P2025") {
			// Prisma error code for record not found
			return res.status(404).json({ message: "Order not found" });
		}
		console.error(`Error deleting order with ID ${id}:`, error);
		res.status(500).json({ message: `Error deleting order with ID ${id}`, error: error.message });
	}
};

// TODO: Implement endpoints for managing OrderItems within an Order (e.g., Add Item, Update Item Quantity, Remove Item)
// This would likely require new controllers/routes or modifications to the existing ones.

export const placeOrder = async (req: Request, res: Response) => {
    try {
        // 1. Validate input
        const { product, selectedVariants, customerData } = req.body;
        // TODO: Add Zod validation for this payload

        // Find or create customer
        let customer = await prisma.customer.findUnique({
            where: { email: customerData.email },
        });

        if (!customer) {
            // If customer doesn't exist, create a new one
            customer = await prisma.customer.create({
                data: {
                    name: customerData.name,
                    email: customerData.email,
                    phone: customerData.phone || null,
                    address: customerData.address ? { street: customerData.address.street, city: customerData.address.city, zipCode: customerData.address.zipCode } : Prisma.JsonNull, // Store address as JSON
                },
            });
        }

        // 2. Find the corresponding ProductSku
        // This is a simplified logic. A robust implementation would need to
        // match all selected variants to find the exact SKU.
        const productSku = await prisma.productSku.findFirst({
            where: {
                productId: product.id,
                // This condition assumes variant values are stored in a way that allows searching
                // This might need adjustment based on the actual data structure
            },
            include: {
                product: true, // Include product details for email
            },
        });

        if (!productSku) {
            return res.status(404).json({ message: "Product variant not found" });
        }

        // 3. Create the Order
        const newOrder = await prisma.order.create({
            data: {
                customerId: customer.id, // Link to the created/found customer
                producerId: product.ownerId, // Assuming the product owner is the producer
                items: {
                    create: [
                        {
                            productSkuId: productSku.id,
                            quantity: 1,
                            pricePerUnitAtOrder: product.basePrice, // Or a calculated price based on variants
                        },
                    ],
                },
            },
            include: {
                items: {
                    include: {
                        productSku: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
                customer: true, // Include customer details
                producer: true, // Include producer details
            },
        });

        // 4. Send Confirmation Emails
        const currentYear = new Date().getFullYear();

        // Read email templates
        const customerEmailTemplatePath = path.join(__dirname, '../../templates/emails/customerOrderConfirmation.html');
        const producerEmailTemplatePath = path.join(__dirname, '../../templates/emails/producerOrderNotification.html');

        let customerEmailHtml = await fs.readFile(customerEmailTemplatePath, 'utf8');
        let producerEmailHtml = await fs.readFile(producerEmailTemplatePath, 'utf8');

        // Prepare order items HTML for email
        const orderItemsHtml = newOrder.items.map(item => `
            <tr>
                <td>${item.productSku.product.name}</td>
                <td>${item.productSku.skuCode || 'N/A'}</td>
                <td>${item.quantity}</td>
                <td>${item.pricePerUnitAtOrder.toNumber().toFixed(2)}</td>
            </tr>
        `).join('');

        // Populate customer email template
        customerEmailHtml = customerEmailHtml
            .replace(/{customerName}/g, newOrder.customer?.name || 'Kliencie')
            .replace(/{orderId}/g, newOrder.orderNumber.toString())
            .replace(/{orderDate}/g, (newOrder.createdAt ?? new Date()).toLocaleDateString('pl-PL'))
            .replace(/{producerCompanyName}/g, newOrder.producer?.companyName || 'N/A')
            .replace(/{orderItems}/g, orderItemsHtml)
            .replace(/{totalAmount}/g, newOrder.items.reduce((sum, item) => sum + (item.quantity * item.pricePerUnitAtOrder.toNumber()), 0).toFixed(2))
            .replace(/{currentYear}/g, currentYear.toString());

        // Parse customer address JSON
        const customerAddress: any = newOrder.customer?.address || {};

        // Populate producer email template
        producerEmailHtml = producerEmailHtml
            .replace(/{producerCompanyName}/g, newOrder.producer?.companyName || 'Producencie')
            .replace(/{orderId}/g, newOrder.orderNumber.toString())
            .replace(/{orderDate}/g, (newOrder.createdAt ?? new Date()).toLocaleDateString('pl-PL'))
            .replace(/{customerName}/g, newOrder.customer?.name || 'N/A')
            .replace(/{customerEmail}/g, newOrder.customer?.email || 'N/A')
            .replace(/{customerAddress}/g, `${customerAddress.street || ''}, ${customerAddress.city || ''}, ${customerAddress.zipCode || ''}`.trim())
            .replace(/{customerPhone}/g, newOrder.customer?.phone || 'N/A')
            .replace(/{orderItems}/g, orderItemsHtml)
            .replace(/{totalAmount}/g, newOrder.items.reduce((sum, item) => sum + (item.quantity * item.pricePerUnitAtOrder.toNumber()), 0).toFixed(2))
            .replace(/{currentYear}/g, currentYear.toString());

        // Send email to customer
        if (newOrder.customer?.email) {
            await sendOrderConfirmationEmail(
                newOrder.customer.email,
                `Potwierdzenie zamówienia #${newOrder.orderNumber}`,
                customerEmailHtml
            );
        }

        // Send email to producer
        if (newOrder.producer?.email) {
            await sendOrderConfirmationEmail(
                newOrder.producer.email,
                `Nowe zamówienie #${newOrder.orderNumber} od ${newOrder.customer?.name || ''}`,
                producerEmailHtml
            );
        }

        res.status(201).json(newOrder);
    } catch (error: any) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
};