// app/api/admin/blog/route.ts
import { cloudinary } from '@/lib/cloudinary';
import { verifyToken } from "@/lib/jwt";
import { Prisma, PrismaClient } from "@prisma/client";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const prismaClient = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
}

// const blogPostSchema = z.object({
//   title: z.string().min(1),
//   description: z.string().optional(),
//   content: z.string().optional(),
//   featuredImage: z.string().optional(),
//   published: z.boolean().default(false),
//   category: z.string().optional(),
// });

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
      prismaClient.blogPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prismaClient.blogPost.count({ where }),
    ]);

    // Fetch content for each post
    const postsWithContent = await Promise.all(
      posts.map(async (post) => {
        let content = "";
        if (post.path) {
          try {
            const response = await axios.get(post.path);
            content = response.data;
          } catch (error) {
            console.error(`Error fetching content for post ${post.id}:`, error);
          }
        }
        return {
          ...post,
          content,
        };
      })
    );

    const totalPages = Math.ceil(totalPosts / pageSize);

    const response = {
      posts: postsWithContent,
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

async function uploadToCloudinary(
  file: Buffer | string,
  options: {
    resource_type: "raw" | "image";
    format?: string;
  }
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: options.resource_type,
        format: options.format,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result as CloudinaryUploadResult);
        }
      }
    );

    if (typeof file === "string") {
      uploadStream.end(Buffer.from(file));
    } else {
      uploadStream.end(file);
    }
  });
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

    // Upload content to Cloudinary
    const contentBuffer = Buffer.from(content);
    const contentResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "blog-content",
          resource_type: "raw",
          public_id: slug,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as CloudinaryUploadResult);
          }
        }
      ).end(contentBuffer);
    });

    // Handle featured image if provided
    let featuredImageUrl = null;
    if (featuredImage) {
      const imageBuffer = await featuredImage.arrayBuffer();
      const imageResult = await uploadToCloudinary(Buffer.from(imageBuffer), {
        resource_type: "image"
      });
      featuredImageUrl = imageResult.secure_url;
    }

    // Create blog post
    const { id, createdAt, updatedAt, ...postDataWithoutId } = postData;
    console.log(id, createdAt, updatedAt);
    const post = await prismaClient.blogPost.create({
      data: {
        ...postDataWithoutId,
        slug,
        path: contentResult.secure_url,
        featuredImage: featuredImageUrl,
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
export async function PUT(req: NextRequest) {
  try {
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

    const formData = await req.formData();
    const postData = JSON.parse(formData.get("postData") as string);
    const content = formData.get("content") as string;
    const featuredImage = formData.get("featuredImage") as File;

    if (!postData.id || !postData.title || !postData.slug || !postData.category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get existing post to check if we need to update content
    const existingPost = await prismaClient.blogPost.findUnique({
      where: { id: parseInt(postData.id) },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: {
      title: string;
      slug: string;
      category: string;
      published: boolean;
      description: string;
      readingTime: number;
      path?: string;
      featuredImage?: string;
    } = {
      title: postData.title,
      slug: postData.slug,
      category: postData.category,
      published: postData.published,
      description: postData.description,
      readingTime: postData.readingTime,
    };

    // Only update content if new content is provided
    if (content) {
      const contentResult = await uploadToCloudinary(content, {
        resource_type: "raw",
        format: "html",
      });
      updateData.path = contentResult.secure_url;
    } else if (existingPost.path) {
      // Preserve existing content path if no new content is provided
      // Convert null to undefined if needed
      updateData.path = existingPost.path;
    }

    // Handle featured image if provided
    if (featuredImage && featuredImage.size > 0) {
      const imageBuffer = await featuredImage.arrayBuffer();
      const imageResult = await uploadToCloudinary(Buffer.from(imageBuffer), {
        resource_type: "image",
      });
      updateData.featuredImage = imageResult.secure_url;
    } else if (existingPost.featuredImage !== null) {
      // Only set featuredImage if it's not null
      updateData.featuredImage = existingPost.featuredImage;
    }

    const updatedPost = await prismaClient.blogPost.update({
      where: { id: parseInt(postData.id) },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update post" },
      { status: 500 }
    );
  } finally {
    await prismaClient.$disconnect();
  }
}

// DELETE /api/admin/blog/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    // Get the blog post to delete
    const post = await prismaClient.blogPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
    }

    // Delete content from Cloudinary
    if (post.path) {
      const publicId = post.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`blog-content/${publicId}`);
      }
    }

    // Delete featured image from Cloudinary
    if (post.featuredImage) {
      const publicId = post.featuredImage.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`blog-featured-images/${publicId}`);
      }
    }

    // Delete from database
    await prismaClient.blogPost.delete({ where: { id: parseInt(id) } });

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
// function wrapContentWithHtml(content: string, title: string) {
//   return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>${title}</title>
//   <meta name="description" content="${extractDescription(content, 160)}">
//   <style>
//     body {
//       font-family: 'Montserrat', "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
//       line-height: 1.6;
//       max-width: 800px;
//       margin: 0 auto;
//       padding: 20px;
//       color: #333;
//     }
//     h1, h2, h3 {
//       margin-top: 1.5em;
//       margin-bottom: 0.5em;
//     }
//     img {
//       max-width: 100%;
//       height: auto;
//       display: block;
//       margin: 2em auto;
//       border-radius: 8px;
//       box-shadow: 0 4px 8px rgba(0,0,0,0.1);
//     }
//     p {
//       margin-bottom: 1.5em;
//     }
//     .content {
//       margin-top: 2em;
//     }
//     .image-container {
//       text-align: center;
//       margin: 2em 0;
//     }
//     .text-center {
//       text-align: center;
//     }
//     ul, ol {
//       margin-bottom: 1.5em;
//       padding-left: 2em;
//     }
//     code {
//       background: #f4f4f4;
//       padding: 0.2em 0.4em;
//       border-radius: 3px;
//       font-family: 'Courier New', Courier, monospace;
//     }
//     pre {
//       background: #f4f4f4;
//       padding: 1em;
//       border-radius: 5px;
//       overflow-x: auto;
//     }
//     blockquote {
//       border-left: 4px solid #ddd;
//       padding: 0 1em;
//       margin-left: 0;
//       color: #666;
//     }
//   </style>
// </head>
// <body>
//   <article class="content">
//     ${content}
//   </article>
// </body>
// </html>
//   `;
// }

// Helper function to extract description from content
// function extractDescription(content: string, maxLength: number = 160) {
//   // Strip HTML tags and get plain text
//   const plainText = content.replace(/<[^>]*>/g, "");

//   // Limit to maxLength characters and add ellipsis if needed
//   let description = plainText.substring(0, maxLength).trim();
//   if (plainText.length > maxLength) {
//     description += "...";
//   }

//   // Escape double quotes for use in meta tag
//   return description.replace(/"/g, "&quot;");
// }

