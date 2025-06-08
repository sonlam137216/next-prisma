'use client'

import { useState, useEffect } from 'react'
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

export function CreateCollectionDialog({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [active, setActive] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { createCollection } = useCollectionsStore()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let imageUrl = ''
      
      // Upload image if selected
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

      await createCollection({
        name,
        description,
        active,
        imageUrl,
        productIds: selectedProducts,
      })
      
      setOpen(false)
      setName('')
      setDescription('')
      setActive(true)
      setSelectedProducts([])
      setImageFile(null)
      setImagePreview(null)
      toast.success('Collection created successfully')
    } catch (error) {
      console.error('Error creating collection:', error)
      toast.error('Failed to create collection')
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
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
            {imagePreview ? (
              <div className="relative h-40 w-40 rounded-md overflow-hidden mb-2">
                <Image
                  src={imagePreview}
                  alt="Collection preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}
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
            <Button type="submit">Create Collection</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 