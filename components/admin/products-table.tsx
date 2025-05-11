import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Product } from "@/app/store/dashboardStore";

interface ProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
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

  return (
    <>
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
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
                {selectedProduct.images.map((image) => (
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
    </>
  );
} 