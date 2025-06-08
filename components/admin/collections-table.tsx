'use client'

import { Collection } from '@/app/store/collections-store'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash } from 'lucide-react'
import { EditCollectionDialog } from './edit-collection-dialog'
import { useState } from 'react'
import { useCollectionsStore } from '@/app/store/collections-store'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface CollectionsTableProps {
  collections: Collection[]
}

export function CollectionsTable({ collections }: CollectionsTableProps) {
  const { deleteCollection } = useCollectionsStore()
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this collection?')) {
      await deleteCollection(id)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => (
            <TableRow key={collection.id}>
              <TableCell>
                {collection.imageUrl ? (
                  <div className="relative h-16 w-16 rounded-md overflow-hidden">
                    <Image
                      src={collection.imageUrl}
                      alt={collection.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{collection.name}</TableCell>
              <TableCell>{collection.description}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {collection.products.map((product) => (
                    <Badge key={product.id} variant="secondary">
                      {product.name}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    collection.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {collection.active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                {new Date(collection.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <EditCollectionDialog
                    collection={collection}
                    open={editingCollection?.id === collection.id}
                    onOpenChange={(open) =>
                      setEditingCollection(open ? collection : null)
                    }
                  >
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </EditCollectionDialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(collection.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 