import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'
import { z } from 'zod'

const collectionSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  active: z.boolean().optional(),
  productIds: z.array(z.number()).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: parseInt((await params).id) },
      include: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    return NextResponse.json(collection)
  } catch (error) {
    console.error('Error fetching collection:', error)
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const validatedData = collectionSchema.parse(body)

    const collection = await prisma.collection.update({
      where: { id: parseInt((await params).id) },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        imageUrl: validatedData.imageUrl,
        active: validatedData.active,
        products: validatedData.productIds
          ? {
              set: validatedData.productIds.map((id) => ({ id })),
            }
          : undefined,
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
  } catch (error) {
    console.error('Error updating collection:', error)
    return NextResponse.json(
      { error: 'Failed to update collection' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await prisma.collection.delete({
      where: { id: parseInt((await params).id) },
    })

    return NextResponse.json({ message: 'Collection deleted successfully' })
  } catch (error) {
    console.error('Error deleting collection:', error)
    return NextResponse.json(
      { error: 'Failed to delete collection' },
      { status: 500 }
    );
  }
}