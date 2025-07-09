-- AlterEnum
ALTER TYPE "FileType" ADD VALUE 'GIF';

-- AlterTable
ALTER TABLE "ProductSku" ADD COLUMN     "priceMultiplier" DECIMAL(65,30) NOT NULL DEFAULT 1.0;

-- AlterTable
ALTER TABLE "PropertyVariant" ADD COLUMN     "priceAdjustment" DECIMAL(65,30) NOT NULL DEFAULT 0.00;
