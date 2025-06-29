import { NextResponse } from "next/server";

// Define valid categories
const VALID_CATEGORIES = ["Tin tức", "Deal hot", "Bí quyết bảo quản trang sức",  "Tư vấn trang sức theo mệnh", "Thời trang nổi bật"];

export async function GET() {
  try {
    // Return the valid categories
    return NextResponse.json({ categories: VALID_CATEGORIES });
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 