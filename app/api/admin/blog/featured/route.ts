import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const featuredPost = await prisma.blogPost.findFirst({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(featuredPost);
  } catch (error) {
    console.error('Error fetching featured post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured post' },
      { status: 500 }
    );
  }
} 