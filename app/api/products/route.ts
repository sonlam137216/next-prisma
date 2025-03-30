// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const quantity = parseInt(formData.get("quantity") as string);
    const categoryId = parseInt(formData.get("categoryId") as string);
    const inStock = formData.get("inStock") === "true";

    // For demonstration purposes, hardcoding an authorId
    // In a real app, you'd get this from the authenticated user

    // Create product in database first
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity,
        inStock,
        categoryId,
      },
    });

    // Get all the image files from the formData
    const imageFiles: File[] = formData.getAll("images") as File[];

    if (imageFiles && imageFiles.length > 0) {
      // Create directory if it doesn't exist
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "images",
        "products"
      );
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        console.error("Error creating directory:", error);
      }

      // Process each image file
      for (let i = 0; i < imageFiles.length; i++) {
        const image = imageFiles[i];

        // Generate unique filename
        const fileExtension = image.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = path.join(uploadDir, fileName);

        // Write file to disk
        const buffer = Buffer.from(await image.arrayBuffer());
        await writeFile(filePath, buffer);

        // Set image URL relative to public directory
        const imageUrl = `/images/products/${fileName}`;

        // Check if this is the main image
        const isMainStr = formData.get(`imageIsMain_${i}`);
        const isMain = isMainStr === "true";

        // Create image record in database
        await prisma.productImage.create({
          data: {
            url: imageUrl,
            isMain,
            productId: product.id,
          },
        });
      }
    }

    // Fetch the complete product with images
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: { images: true },
    });

    return NextResponse.json(completeProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error creating product" },
      { status: 500 }
    );
  }
}
