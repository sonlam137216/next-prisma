-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PHONG_THUY', 'THOI_TRANG');

-- CreateEnum
CREATE TYPE "ProductLine" AS ENUM ('CAO_CAP', 'TRUNG_CAP', 'PHO_THONG');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "line" "ProductLine" NOT NULL DEFAULT 'PHO_THONG',
ADD COLUMN     "type" "ProductType" NOT NULL DEFAULT 'THOI_TRANG';
