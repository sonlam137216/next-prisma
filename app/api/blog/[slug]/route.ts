import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { promises as fsPromises } from "fs";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
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