import { z } from 'zod';
import { UserRole } from '../enums';

export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email().nullable(),
  password: z.string().nullable(), // Note: Password should not be returned in read operations usually
  companyName: z.string().nullable(),
  companyData: z.object({}).passthrough().nullable(), // Assuming JSON can be any object
  role: UserRole,
  logoId: z.string().cuid().nullable(),
  startScreenImageId: z.string().cuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserInputSchema = z.object({
  email: z.string().email().optional(),
  password: z.string(),
  companyName: z.string().optional(),
  companyData: z.object({}).passthrough().optional(),
  role: UserRole.optional(),
  logoId: z.string().cuid().optional(),
  startScreenImageId: z.string().cuid().optional(),
});

export const UpdateUserInputSchema = z.object({
  email: z.string().email().optional(),
  // password: z.string().optional(), // Password change should be a separate process
  companyName: z.string().optional(),
  companyData: z.object({}).passthrough().optional(),
  role: UserRole.optional(),
  logoId: z.string().cuid().optional().nullable(),
  startScreenImageId: z.string().cuid().optional().nullable(),
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update.",
});