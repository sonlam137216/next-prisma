// app/api/products/route.ts
import { prisma } from "@/lib/prisma";
import { Prisma, Menh } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { cloudinary } from "@/lib/cloudinary";
import { ProductType, ProductLine } from '@/app/types/product';

// const productSchema = z.object({
//   name: z.string(),
//   description: z.string().optional(),
//   price: z.number(),
//   quantity: z.number(),
//   inStock: z.boolean(),
//   categoryId: z.number(),
//   images: z.array(z.object({
//     url: z.string(),
//     isMain: z.boolean(),
//   })),
// });

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * pageSize;

    // Filter parameters
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const collectionId = searchParams.get('collectionId');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const type = searchParams.get('type');
    const line = searchParams.get('line');
    const menh = searchParams.get('menh');
    const validTypes = ['PHONG_THUY', 'THOI_TRANG'];
    const validLines = ['CAO_CAP', 'TRUNG_CAP', 'PHO_THONG'];
    const validMenh = ['KIM', 'MOC', 'THUY', 'HOA', 'THO'];

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(categoryId && !isNaN(Number(categoryId)) && { categoryId: Number(categoryId) }),
      ...(collectionId && !isNaN(Number(collectionId)) && {
        collections: {
          some: {
            id: Number(collectionId)
          }
        }
      }),
      ...(type && validTypes.includes(type) && { type: type as ProductType }),
      ...(line && validLines.includes(line) && { line: line as ProductLine }),
      ...(menh && validMenh.includes(menh) && { menh: { has: menh as Menh } }),
      price: {
        gte: Number(minPrice || 0),
        lte: Number(maxPrice || 1000000)
      }
    };

    // Build orderBy clause
    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Get total count for pagination
    const totalProducts = await prisma.product.count({ where });
    const totalPages = Math.ceil(totalProducts / pageSize);

    // Fetch products with filters and pagination
    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        images: true,
        category: true,
        collections: true,
        stoneSizes: true,
      }
    });

    return NextResponse.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      pageSize
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
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
    const categoryId = parseInt(formData.get("categoryId") as string);
    const collectionIds = formData.getAll("collectionIds").map(id => parseInt(id as string));
    const inStock = formData.get("inStock") === "true";
    const quantity = parseInt(formData.get("quantity") as string);
    const type = formData.get("type") as "PHONG_THUY" | "THOI_TRANG";
    const line = formData.get("line") as "CAO_CAP" | "TRUNG_CAP" | "PHO_THONG";
    const images = formData.getAll("images") as File[];
    const imageIsMain = formData.getAll("imageIsMain_0") as string[];

    if (!name || !description || !price || !categoryId || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        inStock,
        quantity,
        type: type || "THOI_TRANG",
        line: line || "PHO_THONG",
        collections: {
          connect: collectionIds.map(id => ({ id }))
        }
      },
    });

    // Handle image uploads
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
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

    // Fetch the complete product with images and category
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: true,
        category: true,
        collections: true,
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
