// app/admin/blog/components/ImageUpload.tsx
'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onFileChange: (file: File | null) => void;
  previewUrl?: string;
  className?: string;
}

export function ImageUpload({ onFileChange, previewUrl, className = '' }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileChange(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    onFileChange(null);
  };

  return (
    <div className={`relative ${className}`}>
      {previewUrl ? (
        <div className="relative w-full h-full rounded-md overflow-hidden group">
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              variant="secondary" 
              size="sm" 
              className="mr-2"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-4 w-4 mr-1" />
              Change
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={previewUrl} 
            alt="Featured image preview" 
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-md flex flex-col items-center justify-center p-6 h-full ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-8 w-8 mb-2 text-gray-500" />
          <p className="text-sm text-gray-500 mb-2">Drag and drop an image, or</p>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Browse
          </Button>
        </div>
      )}
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}