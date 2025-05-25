import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const featuredPost = await prisma.blogPost.findFirst({
      where: { 
        published: true
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ post: featuredPost });
  } catch (error) {
    console.error('Error fetching featured post:', error);
    return NextResponse.json(
      { message: 'Failed to fetch featured post' },
      { status: 500 }
    );
  }
} 