/*
  Warnings:

  - Changed the column `menh` on the `Product` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "menh" SET DATA TYPE "Menh"[] USING ARRAY[menh];
