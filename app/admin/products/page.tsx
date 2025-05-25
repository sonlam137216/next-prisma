"use client";
import { Product, useDashboardStore } from "@/app/store/dashboardStore";
import { ProductForm } from "@/components/ProductForm";
import { ProductsTable } from '@/components/admin/products-table';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ProductImage {
  id: number;
  url: string;
  isMain: boolean;
}

export default function ProductsPage() {
  const { 
    products, 
    fetchProducts,
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useDashboardStore();
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
    try {
      if (editingProduct) {
        const productId = Number(editingProduct.id);
        formData.append('id', productId.toString());
        
        await updateProduct(productId, formData);
        
        await fetchProducts();
      } else {
        await addProduct(formData);
        await fetchProducts();
      }
      
      setEditingProduct(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const productId = Number(id);
      await deleteProduct(productId);
      // Refresh the products list after deletion
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      <ProductsTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
        onSubmit={handleFormSubmit}
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
                {selectedProduct.images.map((image: ProductImage) => (
                  <div key={image.id} className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={selectedProduct.name}
                      fill
                      className="rounded-md object-cover"
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