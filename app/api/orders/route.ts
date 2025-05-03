// app/api/orders/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Create a new order
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    // Generate a unique order number (format: ORD-YYYYMMDD-XXXX)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const orderNumber = `ORD-${dateStr}`;

    // Extract order items to create separately
    const { orderItems, ...orderDetails } = orderData;

    console.log(orderDetails, orderNumber, {
      create: orderItems.map((item: any) => ({
        productId: Number(item.productId), // Ensure integer conversion
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.imageUrl || null, // Handle null case
      })),
    });
    // Create the order without transaction to avoid INT4 issue
    const newOrder = await prisma.order.create({
      data: {
        ...orderDetails,
        orderNumber,
        orderItems: {
          create: orderItems.map((item: any) => ({
            productId: Number(item.productId), // Ensure integer conversion
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            imageUrl: item.imageUrl || null, // Handle null case
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    // Update product quantities separately
    for (const item of orderItems) {
      const product = await prisma.product.findUnique({
        where: { id: Number(item.productId) },
      });

      if (product) {
        const newQuantity = product.quantity - item.quantity;
        await prisma.product.update({
          where: { id: Number(item.productId) },
          data: {
            quantity: newQuantity,
            inStock: newQuantity > 0,
          },
        });
      }
    }

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: newOrder,
        orderNumber: newOrder.orderNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Failed to create order", error: String(error) },
      { status: 500 }
    );
  }
}

// GET customer orders by email
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");
    if (!email) {
      return NextResponse.json(
        { message: "Email parameter is required" },
        { status: 400 }
      );
    }
    const orders = await prisma.order.findMany({
      where: { email },
      orderBy: { createdAt: "desc" },
      include: { orderItems: true },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
