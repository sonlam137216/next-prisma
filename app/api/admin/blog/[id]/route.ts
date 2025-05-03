// app/api/admin/blog/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Get content if available
    let content = "";

    if (post.path) {
      const filePath = path.join(
        process.cwd(),
        "public",
        post.path.replace(/^\//, "")
      );

      if (fs.existsSync(filePath)) {
        content = await fsPromises.readFile(filePath, "utf-8");
      }
    }

    // Extract description from content if available
    let description = "";
    if (content) {
      // Try to extract from meta tag first
      const descriptionMatch = content.match(
        /<meta name="description" content="(.*?)"/
      );
      if (descriptionMatch) {
        description = descriptionMatch[1];
      } else {
        // Extract first paragraph as fallback
        const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/);
        if (bodyMatch) {
          const firstParagraphMatch = bodyMatch[1].match(
            /<p[^>]*>([\s\S]*?)<\/p>/
          );
          if (firstParagraphMatch) {
            // Strip HTML tags and limit to 200 chars
            description = firstParagraphMatch[1]
              .replace(/<[^>]*>/g, "")
              .substring(0, 200);
            if (description.length === 200) description += "...";
          }
        }
      }
    }

    // Return post with content and description
    return NextResponse.json({
      post: {
        ...post,
        content,
        description,
      },
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { message: "Failed to fetch blog post" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    // Get the post to check if there are files to delete
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Delete the HTML content file if it exists
    if (post.path) {
      const contentPath = path.join(
        process.cwd(),
        "public",
        post.path.replace(/^\//, "")
      );

      try {
        if (fs.existsSync(contentPath)) {
          await fsPromises.unlink(contentPath);
        }
      } catch (err) {
        console.error("Error deleting content file:", err);
      }
    }

    // Delete featured image if it exists
    if (post.featuredImage) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        post.featuredImage.replace(/^\//, "")
      );

      try {
        if (fs.existsSync(imagePath)) {
          await fsPromises.unlink(imagePath);
        }
      } catch (err) {
        console.error("Error deleting featured image:", err);
      }
    }

    // Delete the post from the database
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete post" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
