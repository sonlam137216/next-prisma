/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `BlogPost` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "featuredImage" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
