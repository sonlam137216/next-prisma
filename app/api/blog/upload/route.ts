import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = join(process.cwd(), "public", "blog-content");

  // Ensure the directory exists
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  // Create a unique filename
  const ext = file.name.split(".").pop();
  const base = file.name.replace(/\.[^/.]+$/, "");
  const filename = `${base}-${Date.now()}.${ext}`;
  const filePath = join(uploadDir, filename);

  await writeFile(filePath, buffer);

  // Return the public URL
  const url = `/blog-content/${filename}`;
  return NextResponse.json({ url });
} 