import { z } from "zod";

export const UserRole = z.enum(["ADMIN", "PRODUCER"]);
export const FileType = z.enum(["JPG", "PNG", "GIF", "WEBP", "PDF"]);
export const OrderStatus = z.enum(["PENDING", "CONFIRMED", "SHIPPED", "CANCELLED"]);
export const ApprovalPolicy = z.enum(["AUTOMATIC", "MANUAL"]);
export const HandlingMethod = z.enum(["EMAIL", "API"]);
export const BodyShape = z.enum(["INVERTED_TRIANGLE", "HOURGLASS", "OVAL", "RECTANGLE", "TRIANGLE"]);
export const StylePreference = z.enum(["FITTED_WEAR", "OVERSIZE_WEAR", "RETRO_SHAPES", "MASCULINE_SHAPES"]);
