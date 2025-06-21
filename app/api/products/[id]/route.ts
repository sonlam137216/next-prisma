// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const productId = parseInt((await params).id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        category: true,
        collections: true,
        stoneSizes: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const productId = parseInt((await params).id);
    const formData = await request.formData();

    // Get the product first to check if it exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Extract form data
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const quantity = parseInt(formData.get("quantity") as string);
    const categoryId = formData.get("categoryId") ? parseInt(formData.get("categoryId") as string) : null;
    const collectionId = formData.get("collectionId") ? parseInt(formData.get("collectionId") as string) : null;
    const inStock = formData.get("inStock") === "true";
    const type = formData.get("type") as "PHONG_THUY" | "THOI_TRANG";
    const line = formData.get("line") as "CAO_CAP" | "TRUNG_CAP" | "PHO_THONG";

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
        quantity,
        categoryId: categoryId || existingProduct.categoryId,
        inStock,
        type: type || existingProduct.type,
        line: line || existingProduct.line,
        collections: collectionId ? {
          set: [{ id: collectionId }]
        } : undefined
      },
      include: {
        images: true,
        category: true,
        collections: true,
      },
    });

    // Handle image uploads if any
    const imageFiles = formData.getAll("images") as File[];
    if (imageFiles.length > 0) {
      // Delete old images if requested
      const deleteImages = formData.get("deleteImages") as string;
      if (deleteImages) {
        const imageIdsToDelete = JSON.parse(deleteImages);
        for (const imageId of imageIdsToDelete) {
          const image = existingProduct.images.find(img => img.id === imageId);
          if (image) {
            try {
              const imagePath = path.join(process.cwd(), "public", image.url);
              await fs.unlink(imagePath);
            } catch (error) {
              console.error("Error deleting image file:", error);
            }
          }
        }
        await prisma.productImage.deleteMany({
          where: { id: { in: imageIdsToDelete } },
        });
      }

      // Upload new images
      for (const file of imageFiles) {
        if (file.size > 0) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `${Date.now()}-${file.name}`;
          const filePath = path.join(process.cwd(), "public", "uploads", fileName);
          await fs.writeFile(filePath, buffer);

          await prisma.productImage.create({
            data: {
              url: `/uploads/${fileName}`,
              isMain: existingProduct.images.length === 0, // Make first image main if no images exist
              productId,
            },
          });
        }
      }
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const productId = parseInt((await params).id);

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
