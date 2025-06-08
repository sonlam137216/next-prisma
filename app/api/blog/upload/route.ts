import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from '@/lib/cloudinary';

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
}

interface CloudinaryError {
  message: string;
  error?: {
    message: string;
    http_code?: number;
    name?: string;
  };
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  console.log("file", file);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("buffer size:", buffer.length);
    
    // Upload to Cloudinary with optimized settings
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "blog-content",
          resource_type: "image",
          chunk_size: 6000000, // 6MB chunks
          timeout: 120000, // 2 minutes timeout
          eager: [
            { width: 1000, crop: "scale" }, // Create a scaled version
          ],
          eager_async: true,
        },
        (error, result) => {
          console.log("Upload callback - error:", error);
          console.log("Upload callback - result:", result);
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
  } catch (error: unknown) {
    console.error('Error uploading image:', error);
    const cloudinaryError = error as CloudinaryError;
    return NextResponse.json(
      { 
        error: cloudinaryError.message || "Failed to upload image",
        details: cloudinaryError.error || error
      },
      { status: 500 }
    );
  }
} 