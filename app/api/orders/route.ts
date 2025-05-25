// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const orderSchema = z.object({
  total: z.number(),
  paymentMethod: z.enum(['CARD', 'COD']),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  postalCode: z.string().optional(),
  orderItems: z.array(z.object({
    productId: z.number(),
    name: z.string(),
    quantity: z.number(),
    price: z.number(),
    imageUrl: z.string().optional(),
  })),
});

type OrderItem = z.infer<typeof orderSchema>['orderItems'][number];

// Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = orderSchema.parse(body);

    // Generate a unique order number (format: ORD-YYYYMMDD-XXXX)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const orderNumber = `ORD-${dateStr}`;

    // Extract order items to create separately
    const { orderItems, ...orderDetails } = validatedData;

    console.log(orderDetails, orderNumber, {
      create: orderItems.map((item: OrderItem) => ({
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
          create: orderItems.map((item: OrderItem) => ({
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
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
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
