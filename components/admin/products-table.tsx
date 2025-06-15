import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Product } from "@/app/store/dashboardStore";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export function ProductsTable({ products = [], onEdit, onDelete, loading = false }: ProductsTableProps) {
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleViewImages = (product: Product) => {
    setSelectedProduct(product);
    setImagesDialogOpen(true);
  };

  const getMainImage = (product: Product) => {
    if (!product.images || product.images.length === 0) {
      return null;
    }
    
    const mainImage = product.images.find((img) => img.isMain);
    return mainImage || product.images[0];
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Line</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                <TableCell><Skeleton className="h-8 w-[100px]" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Line</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const mainImage = getMainImage(product);
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    {mainImage ? (
                      <div className="relative h-10 w-10">
                        <Image
                          src={mainImage.url}
                          alt={product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name}</TableCell>
                  <TableCell>
                    <Badge variant={product.type === "PHONG_THUY" ? "default" : "secondary"}>
                      {product.type === "PHONG_THUY" ? "Phong Thuy" : "Thoi Trang"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      product.line === "CAO_CAP" ? "default" :
                      product.line === "TRUNG_CAP" ? "secondary" : "outline"
                    }>
                      {product.line === "CAO_CAP" ? "Cao Cap" :
                       product.line === "TRUNG_CAP" ? "Trung Cap" : "Pho Thong"}
                    </Badge>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <Badge variant={product.inStock ? "default" : "destructive"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewImages(product)}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
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
                {selectedProduct.images.map((image) => (
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
    </>
  );
} 