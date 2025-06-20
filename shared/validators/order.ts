import { z } from 'zod';
import { OrderStatus, ApprovalPolicy, HandlingMethod } from '../enums';

export const OrderSchema = z.object({
  id: z.string().cuid(),
  orderDate: z.date(),
  status: OrderStatus,
  customerData: z.object({}).passthrough().nullable(),
  customerId: z.string().cuid().nullable(),
  producerId: z.string().cuid(),
  approvalPolicy: ApprovalPolicy,
  handlingMethod: HandlingMethod,
  confirmationMessage: z.string().nullable(),
  handlingEmail: z.string().email().nullable(),
  handlingEmailTemplate: z.string().nullable(),
  handlingApiUrl: z.string().url().nullable(),
});

export const CreateOrderInputSchema = z.object({
  // orderDate: z.date().optional(), // Will default to now()
  status: OrderStatus.optional(),
  customerData: z.object({}).passthrough().optional(),
  customerId: z.string().cuid().optional(),
  producerId: z.string().cuid(), // Producer must be assigned
  approvalPolicy: ApprovalPolicy.optional(),
  handlingMethod: HandlingMethod.optional(),
  confirmationMessage: z.string().optional(),
  handlingEmail: z.string().email().optional(),
  handlingEmailTemplate: z.string().optional(),
  handlingApiUrl: z.string().url().optional(),
  // items will be added separately, not in the main order creation
});

export const UpdateOrderInputSchema = z.object({
  status: OrderStatus.optional(),
  customerData: z.object({}).passthrough().optional(),
  customerId: z.string().cuid().optional().nullable(),
  producerId: z.string().cuid().optional(),
  approvalPolicy: ApprovalPolicy.optional(),
  handlingMethod: HandlingMethod.optional(),
  confirmationMessage: z.string().optional().nullable(),
  handlingEmail: z.string().email().optional().nullable(),
  handlingEmailTemplate: z.string().optional().nullable(),
  handlingApiUrl: z.string().url().optional().nullable(),
  // items update is complex, might need separate endpoints or nested structure
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update.",
});