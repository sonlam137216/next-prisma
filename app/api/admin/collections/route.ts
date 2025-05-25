import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'
import { z } from 'zod'

const collectionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  active: z.boolean().optional(),
  productIds: z.array(z.number()).optional(),
})

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    return NextResponse.json(collections)
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = collectionSchema.parse(body)

    const collection = await prisma.collection.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        imageUrl: validatedData.imageUrl,
        active: validatedData.active ?? true,
        products: {
          connect: validatedData.productIds?.map((id) => ({ id })) || [],
        },
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(collection)
  } catch {
    return NextResponse.json(
      { error: 'Failed to create collection' },
      { status: 500 }
    );
  }
} 