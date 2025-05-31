// app/api/admin/blog/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import axios from "axios";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for authentication cookie
    const cookieStore = await cookies();
    const authToken = cookieStore.get("adminAuthToken")?.value;
    
    if (!authToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const payload = await verifyToken(authToken);
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    // Validate ID
    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    // Fetch content from Cloudinary if path exists
    let content = "";
    if (post.path) {
      try {
        const response = await axios.get(post.path);
        content = response.data;
      } catch (error) {
        console.error("Error fetching content from Cloudinary:", error);
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

    const response = {
      post: {
        ...post,
        content,
        description,
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in request handling:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    // Get the post to check if there are files to delete
    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) },
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
      where: { id: parseInt(id) },
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
