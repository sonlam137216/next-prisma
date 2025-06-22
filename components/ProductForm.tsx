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
import { StoneSize } from "@/app/types/product";

const MenhEnum = z.enum(["KIM", "MOC", "THUY", "HOA", "THO"]);

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  detailedDescription: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  quantity: z.coerce.number().min(0, "Quantity must be a positive number"),
  inStock: z.boolean().default(true),
  categoryId: z.string().min(1, "Category is required"),
  type: z.enum(["PHONG_THUY", "THOI_TRANG"]).default("THOI_TRANG"),
  line: z.enum(["CAO_CAP", "TRUNG_CAP", "PHO_THONG"]).default("PHO_THONG"),
  menh: z.array(MenhEnum).optional().default([]),
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
  const [stoneSizes, setStoneSizes] = useState<StoneSize[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      detailedDescription: "",
      price: 0,
      quantity: 0,
      inStock: true,
      categoryId: "",
      type: "THOI_TRANG",
      line: "PHO_THONG",
      menh: [],
      hasDiscount: false,
    },
  });

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (product) {
        form.reset({
          name: product.name,
          description: product.description ?? '',
          detailedDescription: product.detailedDescription ?? '',
          price: product.price,
          quantity: product.quantity,
          inStock: product.inStock,
          categoryId: product.category?.id.toString() || "",
          type: product.type || "THOI_TRANG",
          line: product.line || "PHO_THONG",
          menh: product.menh || [],
          hasDiscount: product.hasDiscount || false,
          discountPrice: product.discountPrice || undefined,
          discountPercentage: product.discountPercentage || undefined,
          discountStartDate: product.discountStartDate ? new Date(product.discountStartDate).toISOString().split('T')[0] : undefined,
          discountEndDate: product.discountEndDate ? new Date(product.discountEndDate).toISOString().split('T')[0] : undefined,
        });
        setImages(
          product.images.map((img) => ({
            file: new File([], img.url),
            preview: img.url,
            isMain: img.isMain,
            id: img.id
          }))
        );
        setDeletedImageIds([]);
        setStoneSizes(product.stoneSizes || []);
      } else {
        form.reset({
          name: "",
          description: "",
          detailedDescription: "",
          price: 0,
          quantity: 0,
          inStock: true,
          categoryId: "",
          type: "THOI_TRANG",
          line: "PHO_THONG",
          menh: [],
          hasDiscount: false,
        });
        setImages([]);
        setDeletedImageIds([]);
        setStoneSizes([]);
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

  const handleAddStoneSize = () => {
    setStoneSizes([...stoneSizes, { id: Date.now(), size: '', price: 0 }]);
  };

  const handleRemoveStoneSize = (id: number) => {
    setStoneSizes(stoneSizes.filter(s => s.id !== id));
  };

  const handleStoneSizeChange = (id: number, field: 'size' | 'price', value: string | number) => {
    setStoneSizes(stoneSizes.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSubmit = async (values: ProductFormValues) => {
    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description || "");
    formData.append("detailedDescription", values.detailedDescription || "");
    formData.append("price", values.price.toString());
    formData.append("quantity", values.quantity.toString());
    formData.append("inStock", values.inStock.toString());
    formData.append("categoryId", values.categoryId);
    formData.append("type", values.type);
    formData.append("line", values.line);
    if (values.menh && values.menh.length > 0) {
      formData.append("menh", JSON.stringify(values.menh));
    }
    formData.append("hasDiscount", values.hasDiscount.toString());
    if (values.hasDiscount) {
      if (values.discountPrice) formData.append("discountPrice", values.discountPrice.toString());
      if (values.discountPercentage) formData.append("discountPercentage", values.discountPercentage.toString());
      if (values.discountStartDate) formData.append("discountStartDate", values.discountStartDate);
      if (values.discountEndDate) formData.append("discountEndDate", values.discountEndDate);
    }
    
    images.forEach((image, index) => {
      if (image.file.size > 0) {
        formData.append(`images`, image.file);
      }
      formData.append(`imageIsMain_${index}`, image.isMain.toString());
      if (image.id) {
        formData.append(`imageIds`, image.id.toString());
      }
    });

    if (deletedImageIds.length > 0) {
      formData.append("deleteImages", JSON.stringify(deletedImageIds));
    }

    formData.append("stoneSizes", JSON.stringify(stoneSizes.map(({ id, ...rest }) => rest)));

      await onSubmit(formData);
  };

  const hasDiscount = form.watch("hasDiscount");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{product ? "Edit Product" : "Create New Product"}</DialogTitle>
              <DialogDescription>
                {product ? "Update the product details." : "Fill in the form to create a new product."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl><Input placeholder="Product name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" min="0" step="0.01" placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="quantity" render={({ field }) => (<FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" min="0" step="1" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="categoryId" render={({ field }) => (<FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Loại sản phẩm</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Chọn loại sản phẩm" /></SelectTrigger></FormControl><SelectContent><SelectItem value="PHONG_THUY">Phong thủy</SelectItem><SelectItem value="THOI_TRANG">Thời trang</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="line" render={({ field }) => (<FormItem><FormLabel>Dòng sản phẩm</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Chọn dòng sản phẩm" /></SelectTrigger></FormControl><SelectContent><SelectItem value="CAO_CAP">Cao cấp</SelectItem><SelectItem value="TRUNG_CAP">Trung cấp</SelectItem><SelectItem value="PHO_THONG">Phổ thông</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="inStock" render={({ field }) => (<FormItem className="flex flex-row items-center justify-center space-x-3 space-y-0 rounded-md border p-4 h-full"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>In Stock</FormLabel></div></FormItem>)} />
                </div>

                <FormField
                  control={form.control}
                  name="menh"
                  render={() => (
                    <FormItem>
                      <FormLabel>Mệnh</FormLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {MenhEnum.options.map((item) => (
                          <FormField key={item} control={form.control} name="menh" render={({ field }) => (<FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={field.value?.includes(item)} onCheckedChange={(checked) => {return checked ? field.onChange([...(field.value || []), item]) : field.onChange(field.value?.filter((value) => value !== item))}} /></FormControl><FormLabel className="font-normal">{item}</FormLabel></FormItem>)} />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 rounded-md border p-4">
                  <FormField control={form.control} name="hasDiscount" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Has Discount?</FormLabel></FormItem>)} />
                  {hasDiscount && (<div className="space-y-4"><FormField control={form.control} name="discountPrice" render={({ field }) => (<FormItem><FormLabel>Discount Price</FormLabel><FormControl><Input type="number" min="0" step="0.01" placeholder="Discounted price" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} /><FormField control={form.control} name="discountPercentage" render={({ field }) => (<FormItem><FormLabel>Discount Percentage</FormLabel><FormControl><Input type="number" min="0" max="100" placeholder="e.g., 20 for 20%" {...field} value={field.value ?? ''}/></FormControl><FormMessage /></FormItem>)} /><div className="grid grid-cols-2 gap-4"><FormField control={form.control} name="discountStartDate" render={({ field }) => (<FormItem><FormLabel>Discount Start</FormLabel><FormControl><Input type="date" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} /><FormField control={form.control} name="discountEndDate" render={({ field }) => (<FormItem><FormLabel>Discount End</FormLabel><FormControl><Input type="date" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} /></div></div>)}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Short product description for list views" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="detailedDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed product description for product page"
                          {...field}
                          value={field.value || ""}
                          rows={8}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4 rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold">Quản lý size đá</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddStoneSize}>Thêm size</Button>
                  </div>
                  <div className="space-y-2">
                    {stoneSizes.map((s, index) => (
                      <div key={s.id} className="flex items-center gap-2">
                        <Input placeholder="Size (e.g., 10 li)" value={s.size} onChange={(e) => handleStoneSizeChange(s.id, 'size', e.target.value)} className="flex-1" />
                        <Input type="number" placeholder="Price" value={s.price} onChange={(e) => handleStoneSizeChange(s.id, 'price', parseFloat(e.target.value))} className="flex-1" />
                        <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveStoneSize(s.id)}><X size={16} /></Button>
                      </div>
                    ))}
                </div>
              </div>

                <div className="space-y-2">
                  <FormLabel>Images</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                  {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <Image src={image.preview} alt={`preview ${index}`} width={100} height={100} className="w-full h-24 object-cover rounded-md" />
                        <div className="absolute top-1 right-1 flex gap-1">
                          <Button type="button" size="icon" variant="destructive" className="h-6 w-6" onClick={() => removeImage(index)}><X size={12} /></Button>
                          <Button type="button" size="icon" variant={image.isMain ? 'secondary' : 'outline'} className="h-6 w-6" onClick={() => setMainImage(index)}><Star size={12} fill={image.isMain ? 'currentColor' : 'none'} /></Button>
                        </div>
                    </div>
                  ))}
                    <label className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer">
                      <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
                    <Upload className="h-8 w-8 text-gray-400" />
                  </label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}