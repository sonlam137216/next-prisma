import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define valid categories
const VALID_CATEGORIES = ["Phong thủy", "Đá quý", "Kiến thức", "Tin tức"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "9");
    const category = searchParams.get("category");

    const skip = (page - 1) * pageSize;

    const where = {
      published: true,
      ...(category && category !== 'Tất cả' && VALID_CATEGORIES.includes(category) ? { category } : {}),
    };

    const [posts, totalPosts] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.blogPost.count({ where }),
    ]);

    const totalPages = Math.ceil(totalPosts / pageSize);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalPosts,
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 