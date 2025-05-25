// app/api/products/route.ts
import { prisma } from "@/lib/prisma";
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

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
      price: {
        gte: Number(minPrice || 0),
        lte: Number(maxPrice || 1000)
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
      },
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
    const images = formData.getAll("images") as File[];

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
        collections: {
          connect: collectionIds.map(id => ({ id }))
        }
      },
    });

    // Handle image uploads
    if (images.length > 0) {
      // TODO: Implement image upload to storage service
      // For now, we'll just create placeholder image records
      await prisma.productImage.createMany({
        data: images.map((_, index) => ({
          url: `/placeholder-${index + 1}.jpg`,
          isMain: index === 0,
          productId: product.id,
        })),
      });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
