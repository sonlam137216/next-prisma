// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from '@/lib/cloudinary';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "collections",
          resource_type: "image",
          chunk_size: 6000000, // 6MB chunks
          timeout: 120000, // 2 minutes timeout
          eager: [
            { width: 800, crop: "scale" }, // Create a scaled version
          ],
          eager_async: true,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as CloudinaryUploadResult);
          }
        }
      );

      // Handle stream errors
      uploadStream.on('error', (error) => {
        console.error('Stream error:', error);
        reject(error);
      });

      // Write the buffer to the stream
      uploadStream.end(buffer);
    });

    // Return the Cloudinary URL
    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
