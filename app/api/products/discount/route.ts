import { prisma } from "@/lib/prisma";
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from "next/server";
import { ProductType } from '@/app/types/product';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * pageSize;

    // Filter parameters
    let categories = searchParams.get('categories')?.split(',').map(Number) || [];
    categories = categories.filter((id) => !isNaN(id));
    let collections = searchParams.get('collections')?.split(',').map(Number) || [];
    collections = collections.filter((id) => !isNaN(id));
    const type = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sort') || 'discount';
    const now = new Date();

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      AND: [
        { hasDiscount: true },
        { discountStartDate: { lte: now } },
        { discountEndDate: { gte: now } },
        { inStock: true },
        ...(categories.length > 0 ? [{ categoryId: { in: categories } }] : []),
        ...(collections.length > 0 ? [{ collections: { some: { id: { in: collections } } } }] : []),
        ...(type ? [{ type: type as ProductType }] : []),
        { price: {
          gte: Number(minPrice || 0),
          lte: Number(maxPrice || 10000000)
        }}
      ]
    };

    // Build orderBy clause
    let orderBy: Prisma.ProductOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'price-asc':
        orderBy = { price: 'asc' };
        break;
      case 'price-desc':
        orderBy = { price: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'discount':
      default:
        orderBy = { discountPercentage: 'desc' };
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
      }
    });

    return NextResponse.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      pageSize
    });
  } catch (error) {
    console.error("Error fetching discount products:", error);
    return NextResponse.json(
      { error: "Error fetching discount products" },
      { status: 500 }
    );
  }
} 