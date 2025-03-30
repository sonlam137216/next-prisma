// app/admin/blog/components/ImageUpload.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onChange: (value: string) => void;
  value?: string;
  label?: string;
}

export function ImageUpload({ onChange, value, label = 'Cover Image' }: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real implementation, you would upload the file to your server or cloud storage
    // For this example, we'll just use a local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = event.target?.result as string;
      setImagePreview(preview);
      onChange(preview);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="cover-image">{label}</Label>
      
      {imagePreview ? (
        <div className="relative aspect-video overflow-hidden rounded-md border">
          <img
            src={imagePreview}
            alt="Cover preview"
            className="object-cover w-full h-full"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border rounded-md flex items-center justify-center flex-col p-6 aspect-video bg-muted/20">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <div className="text-sm text-muted-foreground">
            Drag & drop or click to upload
          </div>
          <Button 
            type="button" 
            variant="secondary" 
            size="sm" 
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </Button>
        </div>
      )}
      
      <Input
        id="cover-image"
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}