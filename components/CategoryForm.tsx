'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Category } from '@/app/store/dashboardStore';
import { ChangeEvent } from 'react';

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Category>) => Promise<void>;
  initialData?: Category | null;
}

export default function CategoryForm({ open, onClose, onSubmit, initialData }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    slug: initialData?.slug || ''
  });
 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        slug: initialData.slug || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        slug: ''
      });
    }
  }, [initialData]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => {
      if (!slugEdited) {
        return {
          ...prev,
          name,
          slug: slugify(name)
        };
      }
      return { ...prev, name };
    });
  };

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  };

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlugEdited(true);
    setFormData(prev => ({ ...prev, slug: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
   
    try {
      await onSubmit(formData);
      // The form will be closed by the parent component after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  function slugify(str: string) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        </DialogHeader>
       
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Enter category name"
              required
            />
          </div>
         
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Enter category description"
              rows={3}
            />
          </div>
         
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={handleSlugChange}
              required
            />
          </div>
         
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}