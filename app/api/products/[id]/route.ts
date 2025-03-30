// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    // Find the product first to get all the images
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete the product from the database
    // The cascading delete will also remove all associated images
    await prisma.product.delete({
      where: { id: productId },
    });

    // Delete all image files
    if (product.images.length > 0) {
      for (const image of product.images) {
        try {
          const imagePath = path.join(process.cwd(), "public", image.url);
          await fs.unlink(imagePath);
        } catch (error) {
          console.error("Error deleting image file:", error);
          // Continue even if image deletion fails
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 }
    );
  }
}
