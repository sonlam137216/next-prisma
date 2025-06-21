-- CreateTable
CREATE TABLE "StoneSize" (
    "id" SERIAL NOT NULL,
    "size" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "StoneSize_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StoneSize" ADD CONSTRAINT "StoneSize_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
