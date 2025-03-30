// app/api/admin/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const prisma = new PrismaClient();

// Helper function to create directory if it doesn't exist
async function ensureDirectory(dirPath: string) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

// Helper function to save an image
async function saveImage(file: File, directory: string, filename: string) {
  await ensureDirectory(directory);
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(directory, filename);
  await writeFile(filePath, buffer);
  return filePath;
}

// Helper function to generate a slug
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET /api/admin/blog - List all blog posts
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const postDataString = formData.get("postData") as string;
    const content = formData.get("content") as string;
    const featuredImage = formData.get("featuredImage") as File | null;

    if (!postDataString || !content) {
      return NextResponse.json(
        { message: "Post data and content are required" },
        { status: 400 }
      );
    }

    const postData = JSON.parse(postDataString);

    // Generate slug if not provided
    if (!postData.slug) {
      postData.slug = generateSlug(postData.title);
    }

    // Create post directory and save content
    const postsDir = path.join(process.cwd(), "content/blog");
    await ensureDirectory(postsDir);

    const postDir = path.join(postsDir, postData.slug);
    await ensureDirectory(postDir);

    // Save the MDX content
    const mdxPath = path.join(postDir, "index.mdx");
    await writeFile(mdxPath, content);

    // Save featured image if provided
    let featuredImagePath = "";
    if (featuredImage) {
      const featuredImagesDir = path.join(
        process.cwd(),
        "public/featured-images"
      );
      const filename = `${postData.slug}-${Date.now()}.${featuredImage.name
        .split(".")
        .pop()}`;
      featuredImagePath = await saveImage(
        featuredImage,
        featuredImagesDir,
        filename
      );
      featuredImagePath = `/featured-images/${filename}`;
    }

    // Create blog post in database
    const post = await prisma.blogPost.create({
      data: {
        title: postData.title,
        slug: postData.slug,
        path: `/content/blog/${postData.slug}/index.mdx`,
        published: postData.published || false,
      },
    });

    return NextResponse.json({
      post: { ...post, featuredImage: featuredImagePath },
    });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { message: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
