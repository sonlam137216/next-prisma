// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Helper function to create directory if it doesn't exist
async function ensureDirectory(dirPath: string) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const postSlug = formData.get("postSlug") as string | null;

    if (!file || !postSlug) {
      return NextResponse.json(
        { message: "File and post slug are required" },
        { status: 400 }
      );
    }

    // Determine file type and create appropriate path
    const fileType = file.name.split(".").pop()?.toLowerCase();
    const allowedTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

    if (!fileType || !allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { message: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Create images directory for the post
    const postsDir = path.join(process.cwd(), "public/blog-images", postSlug);
    await ensureDirectory(postsDir);

    // Generate filename with timestamp to prevent conflicts
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(postsDir, filename);

    // Save the file
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/blog-images/${postSlug}/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { message: "Failed to upload file" },
      { status: 500 }
    );
  }
}
