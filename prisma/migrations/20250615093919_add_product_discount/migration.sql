-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discountEndDate" TIMESTAMP(3),
ADD COLUMN     "discountPercentage" INTEGER,
ADD COLUMN     "discountPrice" DOUBLE PRECISION,
ADD COLUMN     "discountStartDate" TIMESTAMP(3),
ADD COLUMN     "hasDiscount" BOOLEAN NOT NULL DEFAULT false;
