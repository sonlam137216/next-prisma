"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useDashboardStore, Product } from "@/app/store/dashboardStore";
import { Upload, X, Star } from "lucide-react";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  quantity: z.coerce.number().min(0, "Quantity must be a positive number"),
  inStock: z.boolean().default(true),
  categoryId: z.string().min(1, "Category is required"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ImagePreview {
  file: File;
  preview: string;
  isMain: boolean;
}

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductForm({ open, onOpenChange, product }: ProductFormProps) {
  const { addProduct, updateProduct, categories, fetchCategories } = useDashboardStore();
  const [images, setImages] = useState<ImagePreview[]>([]);

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (product) {
        // Set form values for editing
        form.reset({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          inStock: product.inStock,
          categoryId: product.category?.id.toString() || "",
        });
        // Set existing images
        setImages(
          product.images.map((img) => ({
            file: new File([], img.url), // Create a dummy file since we can't recreate the original
            preview: img.url,
            isMain: img.isMain,
          }))
        );
      } else {
        // Reset form for new product
        form.reset({
          name: "",
          description: "",
          price: 0,
          quantity: 0,
          inStock: true,
          categoryId: "",
        });
        setImages([]);
      }
    }
  }, [open, product, fetchCategories]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      inStock: true,
      categoryId: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages: ImagePreview[] = [];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const isMain = images.length === 0 && newImages.length === 0;
        newImages.push({
          file,
          preview: reader.result as string,
          isMain
        });
        
        // Update state when all files are processed
        if (newImages.length === files.length) {
          setImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    
    // If we removed the main image, set the first one as main (if any exist)
    if (newImages.length > 0 && !newImages.some(img => img.isMain)) {
      newImages[0].isMain = true;
    }
    
    setImages(newImages);
  };

  const setMainImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isMain: i === index
    }));
    setImages(newImages);
  };

  const onSubmit = async (values: ProductFormValues) => {
    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description || "");
    formData.append("price", values.price.toString());
    formData.append("quantity", values.quantity.toString());
    formData.append("inStock", values.inStock.toString());
    formData.append("categoryId", values.categoryId);
    
    // Add the images
    images.forEach((image, index) => {
      formData.append(`images`, image.file);
      formData.append(`imageIsMain_${index}`, image.isMain.toString());
    });

    try {
      if (product) {
        await useDashboardStore.getState().updateProduct(product.id, formData);
      } else {
        await useDashboardStore.getState().addProduct(formData);
      }
      form.reset();
      setImages([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit product:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product details below."
              : "Fill in the details to add a new product to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem 
                          key={category.id} 
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="inStock"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>In Stock</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Product Images</FormLabel>
              <div className="grid grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMainImage(index)}
                      className={`absolute top-1 left-1 p-1 rounded-full transition-opacity ${
                        image.isMain
                          ? "bg-yellow-400 opacity-100"
                          : "bg-gray-500 opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <Star className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
                <label className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Upload className="h-8 w-8 text-gray-400" />
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">
                {product ? "Update Product" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}