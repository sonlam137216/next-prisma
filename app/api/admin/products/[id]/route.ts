import { cloudinary } from '@/lib/cloudinary';
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ProductType, ProductLine } from '@/app/types/product';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      const productId = parseInt(id);
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
      const detailedDescription = formData.get("detailedDescription") as string;
      const price = parseFloat(formData.get("price") as string);
      const quantity = parseInt(formData.get("quantity") as string);
      const categoryId = parseInt(formData.get("categoryId") as string);
      const type = formData.get("type") as string;
      const line = formData.get("line") as string;
      const inStock = formData.get("inStock") === "true";
      const collectionId = formData.get("collectionId") ? parseInt(formData.get("collectionId") as string) : null;

      // Get discount fields
      const hasDiscount = formData.get("hasDiscount") === "true";
      const discountPrice = formData.get("discountPrice") ? parseFloat(formData.get("discountPrice") as string) : null;
      const discountPercentage = formData.get("discountPercentage") ? parseInt(formData.get("discountPercentage") as string) : null;
      const discountStartDate = formData.get("discountStartDate") ? new Date(formData.get("discountStartDate") as string) : null;
      const discountEndDate = formData.get("discountEndDate") ? new Date(formData.get("discountEndDate") as string) : null;
  
      // Xử lý stoneSizes
      const stoneSizesRaw = formData.get("stoneSizes");
      let stoneSizes = [];
      if (stoneSizesRaw) {
        try {
          stoneSizes = JSON.parse(stoneSizesRaw as string);
        } catch (e) {
          return NextResponse.json({ error: "Invalid stoneSizes format" }, { status: 400 });
        }
      }
  
      // Update the product with discount fields
      await prisma.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          detailedDescription,
          price,
          quantity,
          categoryId,
          type: type as ProductType,
          line: line as ProductLine,
          inStock,
          hasDiscount,
          discountPrice,
          discountPercentage,
          discountStartDate,
          discountEndDate,
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
  
      // Xóa các stoneSizes cũ không còn trong danh sách mới
      const oldStoneSizes = await prisma.stoneSize.findMany({ where: { productId } });
      const newIds = (stoneSizes as any[]).filter((s) => s.id).map((s) => s.id);
      const toDelete = oldStoneSizes.filter((s) => !newIds.includes(s.id));
      if (toDelete.length > 0) {
        await prisma.stoneSize.deleteMany({ where: { id: { in: toDelete.map((s) => s.id) } } });
      }
      // Thêm mới hoặc cập nhật stoneSizes
      for (const s of stoneSizes as any[]) {
        if (s.id) {
          // Update
          await prisma.stoneSize.update({
            where: { id: s.id },
            data: { size: s.size, price: parseFloat(s.price) }
          });
        } else if (s.size && s.price) {
          // Create
          await prisma.stoneSize.create({
            data: { size: s.size, price: parseFloat(s.price), productId }
          });
        }
      }
  
      // Handle image updates
      const imageFiles = formData.getAll("images") as File[];
      const imageIsMain = formData.getAll("imageIsMain_0") as string[];
      const imageIds = formData.getAll("imageIds") as string[];

      // Delete old images if requested
      const deleteImages = formData.get("deleteImages") as string;
      if (deleteImages) {
        const imageIdsToDelete = JSON.parse(deleteImages);
        for (const imageId of imageIdsToDelete) {
          const image = existingProduct.images.find(img => img.id === imageId);
          if (image) {
            try {
              // Extract public_id from Cloudinary URL
              const publicId = image.url.split('/').slice(-1)[0].split('.')[0];
              await cloudinary.uploader.destroy(publicId);
            } catch (error) {
              console.error("Error deleting image from Cloudinary:", error);
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
          
          // Convert buffer to base64
          const base64String = buffer.toString('base64');
          const dataURI = `data:${file.type};base64,${base64String}`;
          
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'products',
            resource_type: 'auto'
          });

          await prisma.productImage.create({
            data: {
              url: result.secure_url,
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
          stoneSizes: true,
        },
      });
  
      return NextResponse.json(finalProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
        { error: "Failed to update product" },
        { status: 500 }
      );
    }
  }

export async function DELETE(
  request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    // Delete product images first
    await prisma.productImage.deleteMany({
      where: { productId: productId }, 
    });

    // Delete the product
    await prisma.product.delete({
      where: { id: productId },
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