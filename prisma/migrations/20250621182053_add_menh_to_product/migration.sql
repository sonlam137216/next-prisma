-- CreateEnum
CREATE TYPE "Menh" AS ENUM ('KIM', 'MOC', 'THUY', 'HOA', 'THO');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "menh" "Menh";
