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
import { useDashboardStore } from "@/app/store/dashboardStore";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProductForm } from "@/components/ProductForm"; // Make sure the import path is correct

export default function ProductsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { products, fetchProducts, deleteProduct, fetchCategories } = useDashboardStore();
  
  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Fetch categories to ensure they're available for display
  }, [fetchProducts, fetchCategories]);
  
  const handleViewImages = (product: unknown) => {
    setSelectedProduct(product);
    setImagesDialogOpen(true);
  };
  
  const getMainImage = (product) => {
    if (!product.images || product.images.length === 0) {
      return null;
    }
    
    const mainImage = product.images.find((img: any) => img.isMain);
    return mainImage || product.images[0];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      <ProductForm open={isFormOpen} onOpenChange={setIsFormOpen} />
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const mainImage = getMainImage(product);
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    {mainImage ? (
                      <div className="relative group cursor-pointer" onClick={() => handleViewImages(product)}>
                        <img
                          src={mainImage.url}
                          alt={product.name}
                          className="h-10 w-10 object-cover rounded-md"
                        />
                        {product.images.length > 1 && (
                          <div className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {product.images.length}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {product.category ? (
                      <Badge variant="outline">{product.category.name}</Badge>
                    ) : (
                      <span className="text-gray-400 text-sm">No category</span>
                    )}
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <Badge variant={product.inStock ? "default" : "secondary"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewImages(product)}>
                          View Images
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Product</DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => deleteProduct(product.id)}
                        >
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  No products found. Add your first product with the button above.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
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