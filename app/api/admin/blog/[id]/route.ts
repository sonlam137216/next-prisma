// app/api/admin/blog/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { promises as fsPromises } from "fs";

const prisma = new PrismaClient();

// GET /api/admin/blog/[id] - Get a single blog post
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

    // Fetch the post from the database
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    // If you want to read the content from the HTML file
    let content = "";
    if (post.path && post.path.startsWith("/blog-content/")) {
      const filePath = path.join(process.cwd(), "public", post.path);
      if (fs.existsSync(filePath)) {
        content = await fsPromises.readFile(filePath, "utf-8");
        // You might want to extract just the content part from the HTML
        // This is a simple version - you might need a more sophisticated HTML parser in production
        const contentMatch = content.match(
          /<article class="content">([\s\S]*?)<\/article>/
        );
        if (contentMatch && contentMatch[1]) {
          content = contentMatch[1].trim();
        }
      }
    }

    // You can send back the content if needed
    return NextResponse.json({
      post: {
        ...post,
        content: content || undefined,
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

// PUT /api/admin/blog/[id] - Update a blog post
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

    // Check if the post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const postDataStr = formData.get("postData") as string;
    const content = formData.get("content") as string;
    const featuredImage = formData.get("featuredImage") as File | null;
    const saveToFile = formData.get("saveToFile") as string;

    // Parse post data
    const postData = JSON.parse(postDataStr);

    // Process content
    if (saveToFile === "true" && content) {
      const slug = postData.slug;
      const publicDir = path.join(process.cwd(), "public");
      const blogDir = path.join(publicDir, "blog-content");

      // Create blog directory if it doesn't exist
      if (!fs.existsSync(blogDir)) {
        await fsPromises.mkdir(blogDir, { recursive: true });
      }

      // Create HTML file with wrapped content
      const htmlFilePath = path.join(blogDir, `${slug}.html`);
      const wrappedContent = wrapContentWithHtml(content, postData.title);
      await fsPromises.writeFile(htmlFilePath, wrappedContent);

      // Set the path in the database
      postData.path = `/blog-content/${slug}.html`;
    }

    // Handle featured image upload if provided
    if (featuredImage) {
      const buffer = Buffer.from(await featuredImage.arrayBuffer());
      const filename = `${Date.now()}-${featuredImage.name.replace(
        /\s/g,
        "-"
      )}`;
      const imagesDir = path.join(process.cwd(), "public", "uploads");

      if (!fs.existsSync(imagesDir)) {
        await fsPromises.mkdir(imagesDir, { recursive: true });
      }

      await fsPromises.writeFile(path.join(imagesDir, filename), buffer);
      postData.featuredImage = `/uploads/${filename}`;
    }

    // Update the post in the database
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title: postData.title,
        slug: postData.slug,
        path: postData.path,
        published: postData.published,
      },
    });

    return NextResponse.json({
      success: true,
      post: {
        ...updatedPost,
        featuredImage: postData.featuredImage,
      },
      message: "Post updated successfully",
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update blog post" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/admin/blog/[id] - Delete a blog post
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
    }

    // Find the post to get its details
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    // Delete the associated HTML file if it exists
    if (post.path && post.path.startsWith("/blog-content/")) {
      const filePath = path.join(process.cwd(), "public", post.path);
      if (fs.existsSync(filePath)) {
        await fsPromises.unlink(filePath);
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
      { success: false, message: "Failed to delete blog post" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
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
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
