// app/api/categories/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    // Check if category with same name exists
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: "A category with this name already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
