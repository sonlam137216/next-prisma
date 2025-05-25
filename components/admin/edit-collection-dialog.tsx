'use client'

import { useState, useEffect } from 'react'
import { Collection } from '@/app/store/collections-store'
import { useCollectionsStore } from '@/app/store/collections-store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import Image from 'next/image'

interface Product {
  id: number
  name: string
}

interface EditCollectionDialogProps {
  collection: Collection
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EditCollectionDialog({
  collection,
  children,
  open,
  onOpenChange,
}: EditCollectionDialogProps) {
  const [name, setName] = useState(collection.name)
  const [description, setDescription] = useState(collection.description || '')
  const [active, setActive] = useState(collection.active)
  const [selectedProducts, setSelectedProducts] = useState<number[]>(
    collection.products.map((p) => p.id)
  )
  const [products, setProducts] = useState<Product[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { updateCollection } = useCollectionsStore()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let imageUrl = collection.imageUrl
      
      // Upload new image if selected
      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        
        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }
        
        const { url } = await uploadResponse.json()
        imageUrl = url
      }

      await updateCollection(collection.id, {
        name,
        description,
        active,
        imageUrl,
        productIds: selectedProducts,
      })
      
      if (onOpenChange) {
        onOpenChange(false)
      }
      toast.success('Collection updated successfully')
    } catch (error) {
      console.error('Error updating collection:', error)
      toast.error('Failed to update collection')
    }
  }

  // Fetch products when dialog opens
  useEffect(() => {
    if (open) {
      fetch('/api/admin/products')
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch(() => toast.error('Failed to fetch products'))
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Thumbnail Image</Label>
            {collection.imageUrl && (
              <div className="mb-2">
                <Image
                  src={collection.imageUrl}
                  alt={collection.name}
                  width={80}
                  height={80}
                  className="object-cover rounded"
                />
              </div>
            )}
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Products</Label>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-2">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`product-${product.id}`}
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProducts([...selectedProducts, product.id])
                        } else {
                          setSelectedProducts(
                            selectedProducts.filter((id) => id !== product.id)
                          )
                        }
                      }}
                    />
                    <Label htmlFor={`product-${product.id}`}>{product.name}</Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={active}
              onCheckedChange={setActive}
            />
            <Label htmlFor="active">Active</Label>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 