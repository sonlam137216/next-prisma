import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define valid categories
const VALID_CATEGORIES = ["Phong thủy", "Đá quý", "Kiến thức", "Tin tức"];

export async function GET(request: Request) {
  console.log('Debug - Blog API: Received request');
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "9");
    const category = searchParams.get("category");

    console.log('Debug - Blog API: Query params:', { page, pageSize, category });

    const skip = (page - 1) * pageSize;

    const where = {
      published: true,
      ...(category && category !== 'Tất cả' && VALID_CATEGORIES.includes(category) ? { category } : {}),
    };

    console.log('Debug - Blog API: Query where clause:', where);

    const [posts, totalPosts] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.blogPost.count({ where }),
    ]);

    console.log('Debug - Blog API: Found posts:', posts.length);
    console.log('Debug - Blog API: Total posts:', totalPosts);

    const totalPages = Math.ceil(totalPosts / pageSize);

    const response = {
      posts,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalPosts,
      },
    };

    console.log('Debug - Blog API: Sending response');
    return NextResponse.json(response);
  } catch (error) {
    console.error("Debug - Blog API: Error fetching blog posts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 