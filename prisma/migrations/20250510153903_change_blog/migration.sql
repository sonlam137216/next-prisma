-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Uncategorized',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "readingTime" INTEGER NOT NULL DEFAULT 5,
ALTER COLUMN "path" DROP NOT NULL;
