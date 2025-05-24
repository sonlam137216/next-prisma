// app/api/admin/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { promises as fsPromises } from "fs";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

const prisma = new PrismaClient();

// Helper function to check authentication
async function checkAuth() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("adminAuthToken")?.value;
  
  if (!authToken) {
    return false;
  }

  const payload = await verifyToken(authToken);
  return payload && payload.role === "admin";
}

// GET /api/admin/blog - List all blog posts with pagination
export async function GET(request: Request) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "9");
    const category = searchParams.get("category");


    const skip = (page - 1) * pageSize;

    const where: Prisma.BlogPostWhereInput = {
      published: true,
      ...(category && category !== 'Tất cả' ? { category } : {}),
    };


    const [posts, totalPosts] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.blogPost.count({ where }),
    ]);


    const totalPages = Math.ceil(totalPosts / pageSize);

    const response = {
      posts,
      page,
      pageSize,
      totalPosts,
      totalPages,
    };


    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog
export async function POST(request: Request) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const postData = JSON.parse(formData.get("postData") as string);
    const content = formData.get("content") as string;
    const featuredImage = formData.get("featuredImage") as File | null;

    // Generate slug from title
    const slug = postData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Save content to file
    const contentPath = `/blog-content/${slug}.html`;
    const fullPath = path.join(process.cwd(), "public", contentPath);
    await writeFile(fullPath, content);

    // Handle featured image if provided
    let featuredImagePath = null;
    if (featuredImage) {
      const buffer = Buffer.from(await featuredImage.arrayBuffer());
      const fileName = `${uuidv4()}-${featuredImage.name}`;
      const imagePath = `/blog-images/${fileName}`;
      const fullImagePath = path.join(process.cwd(), "public", imagePath);
      await writeFile(fullImagePath, buffer);
      featuredImagePath = imagePath;
    }

    // Create blog post without content
    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        slug,
        path: contentPath,
        featuredImage: featuredImagePath,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blog
export async function PUT(request: Request) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const postData = JSON.parse(formData.get("postData") as string);
    const content = formData.get("content") as string | null;
    const featuredImage = formData.get("featuredImage") as File | null;

    // Handle featured image if provided
    let featuredImagePath = postData.featuredImage;
    if (featuredImage) {
      const buffer = Buffer.from(await featuredImage.arrayBuffer());
      const fileName = `${uuidv4()}-${featuredImage.name}`;
      const imagePath = `/blog-images/${fileName}`;
      const fullImagePath = path.join(process.cwd(), "public", imagePath);
      await writeFile(fullImagePath, buffer);
      featuredImagePath = imagePath;
    }

    // Update content file if provided
    if (content) {
      const contentPath = `/blog-content/${postData.slug}.html`;
      const fullPath = path.join(process.cwd(), "public", contentPath);
      await writeFile(fullPath, content);
      postData.path = contentPath;
    }

    // Update blog post without content
    const post = await prisma.blogPost.update({
      where: { id: postData.id },
      data: {
        ...postData,
        featuredImage: featuredImagePath,
      },
    });

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = parseInt(params.id);
    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to wrap content with HTML template
function wrapContentWithHtml(content: string, title: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${extractDescription(content, 160)}">
  <style>
    body {
      font-family: 'Montserrat', "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1, h2, h3 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 2em auto;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    p {
      margin-bottom: 1.5em;
    }
    .content {
      margin-top: 2em;
    }
    .image-container {
      text-align: center;
      margin: 2em 0;
    }
    .text-center {
      text-align: center;
    }
    ul, ol {
      margin-bottom: 1.5em;
      padding-left: 2em;
    }
    code {
      background: #f4f4f4;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Courier New', Courier, monospace;
    }
    pre {
      background: #f4f4f4;
      padding: 1em;
      border-radius: 5px;
      overflow-x: auto;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding: 0 1em;
      margin-left: 0;
      color: #666;
    }
  </style>
</head>
<body>
  <article class="content">
    ${content}
  </article>
</body>
</html>
  `;
}

// Helper function to extract description from content
function extractDescription(content: string, maxLength: number = 160) {
  // Strip HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, "");

  // Limit to maxLength characters and add ellipsis if needed
  let description = plainText.substring(0, maxLength).trim();
  if (plainText.length > maxLength) {
    description += "...";
  }

  // Escape double quotes for use in meta tag
  return description.replace(/"/g, "&quot;");
}
