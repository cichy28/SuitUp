-- AlterTable
ALTER TABLE "ProductSku" ADD COLUMN     "imageId" TEXT;

-- AddForeignKey
ALTER TABLE "ProductSku" ADD CONSTRAINT "ProductSku_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Multimedia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
