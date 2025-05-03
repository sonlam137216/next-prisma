// app/api/admin/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { promises as fsPromises } from "fs";

const prisma = new PrismaClient();

// GET /api/admin/blog - List all blog posts with pagination
export async function GET(req: NextRequest) {
  try {
    // Get pagination parameters from URL
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "9");

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // Get total count for pagination calculation
    const totalPosts = await prisma.blogPost.count();
    const totalPages = Math.ceil(totalPosts / pageSize);

    // Get posts for the requested page
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      skip: skip,
      take: pageSize,
    });

    // For each post, extract description from HTML content if available
    const postsWithDescription = await Promise.all(
      posts.map(async (post) => {
        let description = "";

        if (post.path) {
          try {
            const filePath = path.join(
              process.cwd(),
              "public",
              post.path.replace(/^\//, "")
            );
            if (fs.existsSync(filePath)) {
              const content = await fsPromises.readFile(filePath, "utf-8");
              // Try to extract description from meta tag
              const descriptionMatch = content.match(
                /<meta name="description" content="(.*?)"/
              );
              description = descriptionMatch ? descriptionMatch[1] : "";

              // If no description found, extract first paragraph (up to 150 chars)
              if (!description) {
                const bodyMatch = content.match(
                  /<body[^>]*>([\s\S]*?)<\/body>/
                );
                if (bodyMatch) {
                  const firstParagraphMatch = bodyMatch[1].match(
                    /<p[^>]*>([\s\S]*?)<\/p>/
                  );
                  if (firstParagraphMatch) {
                    // Strip HTML tags and limit to 150 chars
                    description = firstParagraphMatch[1]
                      .replace(/<[^>]*>/g, "")
                      .substring(0, 150);
                    if (description.length === 150) description += "...";
                  }
                }
              }
            }
          } catch (error) {
            console.error(
              `Error extracting description for ${post.slug}:`,
              error
            );
          }
        }

        return {
          ...post,
          description,
        };
      })
    );

    return NextResponse.json({
      posts: postsWithDescription,
      page,
      pageSize,
      totalPosts,
      totalPages,
    });
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
    console.log("post func");
    const formData = await req.formData();
    const postDataStr = formData.get("postData") as string;
    const content = formData.get("content") as string;
    const featuredImage = formData.get("featuredImage") as File;
    const saveToFile = formData.get("saveToFile") as string;

    // Parse post data
    const postData = JSON.parse(postDataStr);
    console.log({ contentInAPI: "content" });

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
      console.log({ htmlFilePath });
      await fsPromises.writeFile(htmlFilePath, wrappedContent);
      console.log("fsPromise");
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
      console.log("feature image 1");

      // Use the specific directory for featured images
      const featuredImagesDir = path.join(
        process.cwd(),
        "public",
        "featured-images"
      );

      if (!fs.existsSync(featuredImagesDir)) {
        await fsPromises.mkdir(featuredImagesDir, { recursive: true });
      }

      await fsPromises.writeFile(
        path.join(featuredImagesDir, filename),
        buffer
      );
      console.log("feature image 2");
      postData.featuredImage = `/featured-images/${filename}`;
    }

    // Save the post to the database using Prisma
    const post = await prisma.blogPost.create({
      data: {
        title: postData.title,
        slug: postData.slug,
        path: postData.path,
        featuredImage: postData.featuredImage, // Add the featuredImage to the database
        published: postData.published || false,
      },
    });

    console.log("post", post);

    return NextResponse.json({
      success: true,
      post,
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

    // Get the current post data to check if we already have a featuredImage
    const currentPost = await prisma.blogPost.findUnique({
      where: { id: Number(id) },
    });

    // Handle featured image upload if provided
    if (featuredImage) {
      const buffer = Buffer.from(await featuredImage.arrayBuffer());
      const filename = `${Date.now()}-${featuredImage.name.replace(
        /\s/g,
        "-"
      )}`;

      // Use featured-images directory
      const featuredImagesDir = path.join(
        process.cwd(),
        "public",
        "featured-images"
      );

      if (!fs.existsSync(featuredImagesDir)) {
        await fsPromises.mkdir(featuredImagesDir, { recursive: true });
      }

      await fsPromises.writeFile(
        path.join(featuredImagesDir, filename),
        buffer
      );

      // Delete previous featured image if it exists
      if (currentPost?.featuredImage) {
        const previousImagePath = path.join(
          process.cwd(),
          "public",
          currentPost.featuredImage.replace(/^\//, "")
        );

        try {
          if (fs.existsSync(previousImagePath)) {
            await fsPromises.unlink(previousImagePath);
          }
        } catch (err) {
          console.error("Error deleting previous image:", err);
        }
      }

      postData.featuredImage = `/featured-images/${filename}`;
    } else {
      // Keep the existing featured image if none provided
      postData.featuredImage = currentPost?.featuredImage;
    }

    // Update the post in the database
    const post = await prisma.blogPost.update({
      where: { id: Number(id) },
      data: {
        title: postData.title,
        slug: postData.slug,
        path: postData.path,
        featuredImage: postData.featuredImage,
        published: postData.published,
      },
    });

    return NextResponse.json({
      success: true,
      post,
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
  <meta name="description" content="${extractDescription(content, 160)}">
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
