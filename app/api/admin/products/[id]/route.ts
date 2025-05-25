import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

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
  
      // Update the product
      await prisma.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          price,
          quantity,
          categoryId: categoryId || existingProduct.categoryId,
          inStock,
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
  
      // Handle image updates
      const imageFiles = formData.getAll("images") as File[];
      const imageIsMain = formData.getAll("imageIsMain_0") as string[];
      const imageIds = formData.getAll("imageId_0") as string[];

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

      // Update existing images' isMain status
      for (let i = 0; i < imageIds.length; i++) {
        const imageId = parseInt(imageIds[i]);
        const isMain = imageIsMain[i] === "true";
        await prisma.productImage.update({
          where: { id: imageId },
          data: { isMain }
        });
      }
  
      // Upload new images
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (file.size > 0) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `${Date.now()}-${file.name}`;
          const filePath = path.join(process.cwd(), "public", "uploads", fileName);
          await fs.writeFile(filePath, buffer);
  
          await prisma.productImage.create({
            data: {
              url: `/uploads/${fileName}`,
              isMain: imageIsMain[i] === "true",
              productId,
            },
          });
        }
      }
  
      // Get the final updated product with all images
      const finalProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          images: true,
          category: true,
          collections: true,
        },
      });
  
      return NextResponse.json(finalProduct);
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
    { params }: { params: Promise<{ id: number }> }
) {
  try {
    const { id } = await params;

    // Delete product images first
    await prisma.productImage.deleteMany({
      where: { productId: id },
    });

    // Delete the product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
} 