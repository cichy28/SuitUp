import { z } from 'zod';

export const UserRole = z.enum(['ADMIN', 'PRODUCER']);
export const FileType = z.enum(['JPG', 'PNG', 'GIF']);
export const OrderStatus = z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'CANCELLED']);
export const ApprovalPolicy = z.enum(['AUTOMATIC', 'MANUAL']);
export const HandlingMethod = z.enum(['EMAIL', 'API']);