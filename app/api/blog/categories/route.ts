import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fixed set of blog categories
    const categories = [
      "Tất cả",
      "Phong thủy",
      "Đá quý",
      "Kiến thức",
      "Tin tức"
    ];

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 