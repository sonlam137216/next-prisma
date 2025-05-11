"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDashboardStore, Product } from "@/app/store/dashboardStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductForm } from "@/components/ProductForm";
import { ProductsTable } from '@/components/admin/products-table'

export default function ProductsPage() {
  const { products, fetchProducts } = useDashboardStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  
  const handleViewImages = (product: Product) => {
    setSelectedProduct(product);
    setImagesDialogOpen(true);
  };
  
  const getMainImage = (product: Product) => {
    if (!product.images || product.images.length === 0) {
      return null;
    }
    
    const mainImage = product.images.find((img: any) => img.isMain);
    return mainImage || product.images[0];
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (editingProduct) {
      await useDashboardStore.getState().updateProduct(editingProduct.id, formData);
    } else {
      await useDashboardStore.getState().addProduct(formData);
    }
    setEditingProduct(null);
    setIsFormOpen(false);
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      <ProductsTable
        products={products}
        onEdit={handleEdit}
        onDelete={async (id) => {
          await useDashboardStore.getState().deleteProduct(id);
        }}
      />

      <ProductForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) {
            setEditingProduct(null);
          }
        }}
        product={editingProduct}
      />
      
      {/* Image Gallery Dialog */}
      <Dialog open={imagesDialogOpen} onOpenChange={setImagesDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">
              Images for {selectedProduct?.name}
            </h3>
            {selectedProduct && selectedProduct.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {selectedProduct.images.map((image: any) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.url}
                      alt={selectedProduct.name}
                      className="rounded-md object-cover w-full h-40"
                    />
                    {image.isMain && (
                      <div className="absolute top-0 right-0 bg-yellow-400 text-xs px-1 rounded-bl-md rounded-tr-md">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No images available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}