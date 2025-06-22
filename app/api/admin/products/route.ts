import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { cloudinary } from '@/lib/cloudinary'
import { ProductType, ProductLine } from '@/app/types/product'
import { Menh } from '@prisma/client'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const detailedDescription = formData.get("detailedDescription") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = parseInt(formData.get("categoryId") as string);
    const inStock = formData.get("inStock") === "true";
    const quantity = parseInt(formData.get("quantity") as string);
    const type = formData.get("type") as string;
    const line = formData.get("line") as string;
    const menhRaw = formData.get("menh") as string | null;
    let menh: Menh[] = [];
    if (menhRaw) {
      try {
        menh = JSON.parse(menhRaw);
      } catch (e) {
        console.error("Error parsing menh:", e);
        // ignore error if parsing fails
      }
    }
    const imageFiles = formData.getAll("images") as File[];
    const imageIsMain = formData.getAll("imageIsMain_0") as string[];

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
        console.error("Error parsing stoneSizes:", e);
        return NextResponse.json({ error: "Invalid stoneSizes format" }, { status: 400 });
      }
    }

    if (!name || !price || !categoryId || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create product with discount fields
    const product = await prisma.product.create({
      data: {
        name,
        description,
        detailedDescription,
        price,
        categoryId,
        inStock,
        quantity,
        type: type as ProductType,
        line: line as ProductLine,
        menh: {
          set: menh,
        },
        hasDiscount,
        discountPrice,
        discountPercentage,
        discountStartDate,
        discountEndDate,
      },
    });

    // Lưu stoneSizes vào DB
    if (Array.isArray(stoneSizes) && stoneSizes.length > 0) {
      for (const s of stoneSizes) {
        if (s.size && s.price) {
          await prisma.stoneSize.create({
            data: {
              size: s.size,
              price: parseFloat(s.price),
              productId: product.id,
            },
          });
        }
      }
    }

    // Handle image uploads
    if (imageFiles.length > 0) {
      // Upload new images to Cloudinary
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
              productId: product.id,
            },
          });
        }
      }
    }

    // Fetch the complete product with images, category, stoneSizes
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: true,
        category: true,
        stoneSizes: true,
      },
    });

    return NextResponse.json(completeProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
} 