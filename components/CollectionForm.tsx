// app/admin/collections/components/CollectionForm.tsx
"use client";

import { useCollectionStore, Collection } from "@/app/store/collectionStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface CollectionFormProps {
  collectionId: number | null;
  onClose: () => void;
}

export default function CollectionForm({
  collectionId,
  onClose,
}: CollectionFormProps) {
  const { collections, addCollection, updateCollection } = useCollectionStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [active, setActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  // Load existing collection data when editing
  useEffect(() => {
    if (collectionId !== null) {
      const collection = collections.find((c: Collection) => c.id === collectionId);
      if (collection) {
        setName(collection.name);
        setDescription(collection.description || "");
        setActive(collection.active);
        setExistingImage(collection.imageUrl);
      }
    }
  }, [collectionId, collections]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      setRemoveExistingImage(true);

      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (existingImage) {
      setRemoveExistingImage(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("active", active.toString());

      // Only append image if one is selected or if keeping existing
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (existingImage && !removeExistingImage) {
        // No need to send the existing image, just don't indicate removal
      } else {
        // Explicitly indicate image removal
        formData.append("removeImage", "true");
      }

      if (collectionId) {
        // Update existing collection
        await updateCollection(collectionId, formData);
      } else {
        // Create new collection
        await addCollection(formData);
      }

      onClose();
    } catch (error) {
      console.error("Error submitting collection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {collectionId ? "Edit Collection" : "Create Collection"}
          </DialogTitle>
          <DialogDescription>
            {collectionId
              ? "Update the details of your collection."
              : "Add a new collection to organize your products."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Collection name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the collection"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Image</Label>

            {/* Image preview */}
            {(imagePreview || (existingImage && !removeExistingImage)) && (
              <div className="relative w-full h-40 rounded-md overflow-hidden border mb-2">
                <Image
                  src={imagePreview || existingImage || ""}
                  alt="Collection preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Image upload */}
            {!imagePreview && (!existingImage || removeExistingImage) && (
              <div className="border border-dashed rounded-lg p-4 text-center">
                <Label
                  htmlFor="image-upload"
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">Click to upload</span>
                  <span className="text-xs text-muted-foreground">
                    SVG, PNG, JPG or GIF (max. 2MB)
                  </span>
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Switch id="active" checked={active} onCheckedChange={setActive} />
            <Label htmlFor="active" className="cursor-pointer">
              Active collection
            </Label>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {collectionId ? "Updating..." : "Creating..."}
                </>
              ) : collectionId ? (
                "Update Collection"
              ) : (
                "Create Collection"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
