import { Request, Response } from 'express';
import prisma from '../db';
import { CreateOrderInputSchema, UpdateOrderInputSchema } from '../../shared/validators/order';
import { z } from 'zod';

// Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true, // Include customer details
        producer: { // Include producer (User) details
          select: { id: true, email: true, companyName: true } // Select specific user fields
        },
        items: { // Include order items
          include: {
            productSku: { // Include product SKU details for each item
              include: {
                product: true // Optionally include product details for the SKU
              }
            }
          }
        }
      }
    });
    res.status(200).json(orders);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
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
          select: { id: true, email: true, companyName: true }
        },
        items: {
          include: {
            productSku: {
              include: {
                 product: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
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
       include: { // Include relations in the response
        customer: true,
        producer: {
          select: { id: true, email: true, companyName: true }
        }
      }
    });

    res.status(201).json(newOrder);
  } catch (error: any) {
     // Handle potential Prisma errors (e.g., invalid customerId or producerId)
     if (error.code === 'P2003') {
         return res.status(400).json({ message: 'Invalid customer ID or producer ID' });
     }
    console.error("Error creating order:", error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
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
       include: { // Include relations in the response
        customer: true,
        producer: {
          select: { id: true, email: true, companyName: true }
        },
         items: { // Include updated items if they were part of the update logic (not in current schema) a
           include: {
             productSku: true
           }
         }
      }
    });

    res.status(200).json(updatedOrder);
  } catch (error: any) {
    if (error.code === 'P2025') { // Prisma error code for record not found
      return res.status(404).json({ message: 'Order not found' });
    }
     if (error.code === 'P2003') { // Invalid customerId or producerId
         return res.status(400).json({ message: 'Invalid customer ID or producer ID' });
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
       include: { // Include relations in the response
        customer: true,
        producer: {
          select: { id: true, email: true, companyName: true }
        }
      }
    });

    res.status(200).json({ message: 'Order deleted successfully', order: deletedOrder });
  } catch (error: any) {
     if (error.code === 'P2025') { // Prisma error code for record not found
      return res.status(404).json({ message: 'Order not found' });
    }
    console.error(`Error deleting order with ID ${id}:`, error);
    res.status(500).json({ message: `Error deleting order with ID ${id}`, error: error.message });
  }
};

// TODO: Implement endpoints for managing OrderItems within an Order (e.g., Add Item, Update Item Quantity, Remove Item)
// This would likely require new controllers/routes or modifications to the existing ones.
