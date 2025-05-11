import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { PrismaClient } from "@prisma/client";
import { promises as fsPromises } from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function GET(request: Request) {
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

    // Find the most recent published post
    const post = await prisma.blogPost.findFirst({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!post) {
      return NextResponse.json(
        { message: "No featured post found" },
        { status: 404 }
      );
    }


    // Read content from file if path exists
    let content = "";
    if (post.path) {
      try {
        const fullPath = path.join(process.cwd(), "public", post.path);
        content = await fsPromises.readFile(fullPath, "utf-8");
      } catch (error) {
        console.error("Error reading content file:", error);
      }
    }

    const response = {
      post: {
        ...post,
        content,
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