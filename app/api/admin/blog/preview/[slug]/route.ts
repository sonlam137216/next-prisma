// app/api/admin/blog/preview/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log({ slug });

    // Fetch the post by slug
    const post = await prisma.blogPost.findFirst({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    // Read the MDX content
    let content = "";
    const mdxPath = path.join(process.cwd(), post.path || "");
    if (existsSync(mdxPath)) {
      content = await readFile(mdxPath, "utf-8");
    }

    // Check for featured image
    const featuredImagesDir = path.join(
      process.cwd(),
      "public/featured-images"
    );
    const featuredImages = existsSync(featuredImagesDir)
      ? await import("fs").then((fs) => fs.readdirSync(featuredImagesDir))
      : [];

    const featuredImage = featuredImages.find((img) => img.startsWith(slug));
    const featuredImagePath = featuredImage
      ? `/featured-images/${featuredImage}`
      : "";

    return NextResponse.json({
      post: {
        ...post,
        content,
        featuredImage: featuredImagePath,
      },
    });
  } catch (error) {
    console.error("Error fetching blog preview:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog preview" },
      { status: 500 }
    );
  }
}
