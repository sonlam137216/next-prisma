"use client";

import { Product, useDashboardStore } from "@/app/store/dashboardStore";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  quantity: z.coerce.number().min(0, "Quantity must be a positive number"),
  inStock: z.boolean().default(true),
  categoryId: z.string().min(1, "Category is required"),
  type: z.enum(["PHONG_THUY", "THOI_TRANG"]).default("THOI_TRANG"),
  line: z.enum(["CAO_CAP", "TRUNG_CAP", "PHO_THONG"]).default("PHO_THONG"),
  hasDiscount: z.boolean().default(false),
  discountPrice: z.coerce.number().min(0, "Discount price must be a positive number").optional(),
  discountPercentage: z.coerce.number().min(0, "Discount percentage must be between 0 and 100").max(100).optional(),
  discountStartDate: z.string().optional(),
  discountEndDate: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ImagePreview {
  file: File;
  preview: string;
  isMain: boolean;
  id?: number;
}

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSubmit: (formData: FormData) => Promise<void>;
}

export function ProductForm({ open, onOpenChange, product, onSubmit }: ProductFormProps) {
  const { categories, fetchCategories } = useDashboardStore();
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      inStock: true,
      categoryId: "",
      type: "THOI_TRANG",
      line: "PHO_THONG",
      hasDiscount: false,
      discountPrice: undefined,
      discountPercentage: undefined,
      discountStartDate: undefined,
      discountEndDate: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (product) {
        // Set form values for editing
        form.reset({
          name: product.name,
          description: product.description ?? '',
          price: product.price,
          quantity: product.quantity,
          inStock: product.inStock,
          categoryId: product.category?.id.toString() || "",
          type: product.type || "THOI_TRANG",
          line: product.line || "PHO_THONG",
          hasDiscount: product.hasDiscount || false,
          discountPrice: product.discountPrice || undefined,
          discountPercentage: product.discountPercentage || undefined,
          discountStartDate: product.discountStartDate ? new Date(product.discountStartDate).toISOString().split('T')[0] : undefined,
          discountEndDate: product.discountEndDate ? new Date(product.discountEndDate).toISOString().split('T')[0] : undefined,
        });
        // Set existing images
        setImages(
          product.images.map((img) => ({
            file: new File([], img.url), // Create a dummy file since we can't recreate the original
            preview: img.url,
            isMain: img.isMain,
            id: img.id
          }))
        );
        setDeletedImageIds([]);
      } else {
        // Reset form for new product
        form.reset({
          name: "",
          description: "",
          price: 0,
          quantity: 0,
          inStock: true,
          categoryId: "",
          type: "THOI_TRANG",
          line: "PHO_THONG",
          hasDiscount: false,
          discountPrice: undefined,
          discountPercentage: undefined,
          discountStartDate: undefined,
          discountEndDate: undefined,
        });
        setImages([]);
        setDeletedImageIds([]);
      }
    }
  }, [open, product, fetchCategories, form]);

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
    const removedImage = newImages[index];
    
    if (removedImage.id) {
      setDeletedImageIds(prev => [...prev, removedImage.id!]);
    }
    
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

  const handleSubmit = async (values: ProductFormValues) => {
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
    formData.append("type", values.type);
    formData.append("line", values.line);
    formData.append("hasDiscount", values.hasDiscount.toString());
    if (values.hasDiscount) {
      if (values.discountPrice) {
        formData.append("discountPrice", values.discountPrice.toString());
      }
      if (values.discountPercentage) {
        formData.append("discountPercentage", values.discountPercentage.toString());
      }
      if (values.discountStartDate) {
        formData.append("discountStartDate", values.discountStartDate);
      }
      if (values.discountEndDate) {
        formData.append("discountEndDate", values.discountEndDate);
      }
    }
    
    // Add the images
    images.forEach((image, index) => {
      if (image.file.size > 0) {
        // Only append file if it's a new image (has actual file data)
        formData.append(`images`, image.file);
      }
      // Always append isMain status for both existing and new images
      formData.append(`imageIsMain_${index}`, image.isMain.toString());
      // If it's an existing image, append its ID
      if (image.id) {
        formData.append(`imageId_${index}`, image.id.toString());
      }
    });

    if (deletedImageIds.length > 0) {
      formData.append("deleteImages", JSON.stringify(deletedImageIds));
    }

    try {
      await onSubmit(formData);
      form.reset();
      setImages([]);
      setDeletedImageIds([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit product:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Update the product details below."
              : "Fill in the details to add a new product to your inventory."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PHONG_THUY">Phong Thuy</SelectItem>
                            <SelectItem value="THOI_TRANG">Thoi Trang</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="line"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Line</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product line" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CAO_CAP">Cao Cap</SelectItem>
                            <SelectItem value="TRUNG_CAP">Trung Cap</SelectItem>
                            <SelectItem value="PHO_THONG">Pho Thong</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
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
                          className="min-h-[100px]"
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

                <div className="space-y-4 border rounded-lg p-4">
                  <FormField
                    control={form.control}
                    name="hasDiscount"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Enable Discount</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("hasDiscount") && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="discountPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount Price</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="discountPercentage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discount Percentage</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  placeholder="0"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="discountStartDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="discountEndDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column - Images */}
              <div className="space-y-4">
                <FormLabel>Product Images</FormLabel>
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={image.preview}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {!image.isMain && (
                        <button
                          type="button"
                          onClick={() => setMainImage(index)}
                          className="absolute bottom-2 right-2 bg-yellow-500 text-white rounded-full p-1"
                        >
                          <Star className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <label className="flex items-center justify-center aspect-square border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
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