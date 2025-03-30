// app/api/admin/blog/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

const prisma = new PrismaClient();

async function saveImage(file: File, directory: string, filename: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(directory, filename);
  await writeFile(filePath, buffer);
  return filePath;
}

// GET /api/admin/blog/[id] - Get a single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    // Read the MDX content
    let content = "";
    const mdxPath = path.join(process.cwd(), post.path);
    if (existsSync(mdxPath)) {
      content = await readFile(mdxPath, "utf-8");
    }

    // Check for featured image
    const slug = post.slug;
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
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blog/[id] - Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const formData = await request.formData();

    const postDataString = formData.get("postData") as string;
    const content = formData.get("content") as string | null;
    const featuredImage = formData.get("featuredImage") as File | null;

    if (!postDataString) {
      return NextResponse.json(
        { message: "Post data is required" },
        { status: 400 }
      );
    }

    const postData = JSON.parse(postDataString);

    // Fetch existing post
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    // Update content if provided
    if (content) {
      const mdxPath = path.join(process.cwd(), existingPost.path);
      await writeFile(mdxPath, content);
    }

    // Update featured image if provided
    let featuredImagePath = "";
    if (featuredImage) {
      const featuredImagesDir = path.join(
        process.cwd(),
        "public/featured-images"
      );
      const filename = `${existingPost.slug}-${Date.now()}.${featuredImage.name
        .split(".")
        .pop()}`;
      featuredImagePath = await saveImage(
        featuredImage,
        featuredImagesDir,
        filename
      );
      featuredImagePath = `/featured-images/${filename}`;
    }

    // Update post in database
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title: postData.title,
        published: postData.published,
      },
    });

    return NextResponse.json({
      post: {
        ...updatedPost,
        featuredImage: featuredImagePath || postData.featuredImage,
      },
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { message: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/[id] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Fetch post to get the file path
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    // Delete the post from the database
    await prisma.blogPost.delete({
      where: { id },
    });

    // We could also delete the files, but might be safer to keep them
    // and just remove from the database for now

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { message: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
