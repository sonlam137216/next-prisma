import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Get content from Cloudinary if available
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
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 