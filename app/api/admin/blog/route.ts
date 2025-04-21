// app/api/admin/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { promises as fsPromises } from "fs";

const prisma = new PrismaClient();

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
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const postDataStr = formData.get("postData") as string;
    const content = formData.get("content") as string;
    const featuredImage = formData.get("featuredImage") as File;
    const saveToFile = formData.get("saveToFile") as string;

    // Parse post data
    const postData = JSON.parse(postDataStr);
    console.log({ contentInAPI: content });

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

    // Save the post to the database using Prisma
    const post = await prisma.blogPost.create({
      data: {
        title: postData.title,
        slug: postData.slug,
        path: postData.path,
        published: postData.published || false,
      },
    });

    // Return the created post with any additional fields
    const savedPost = {
      ...post,
      featuredImage: postData.featuredImage,
    };

    return NextResponse.json({
      success: true,
      post: savedPost,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create post" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: NextRequest) {
  try {
    const formData = await req.formData();
    const postDataStr = formData.get("postData") as string;
    const content = formData.get("content") as string;
    const featuredImage = formData.get("featuredImage") as File;
    const saveToFile = formData.get("saveToFile") as string;

    // Parse post data
    const postData = JSON.parse(postDataStr);
    const id = postData.id;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Post ID is required" },
        { status: 400 }
      );
    }

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
    const post = await prisma.blogPost.update({
      where: { id: Number(id) },
      data: {
        title: postData.title,
        slug: postData.slug,
        path: postData.path,
        published: postData.published,
      },
    });

    // Return the updated post with any additional fields
    const updatedPost = {
      ...post,
      featuredImage: postData.featuredImage,
    };

    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: "Post updated successfully",
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update post" },
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
