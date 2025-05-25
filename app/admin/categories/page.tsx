'use client';
import { Category, useDashboardStore } from '@/app/store/dashboardStore';
import { CategoriesTable } from '@/components/admin/categories-table';
import CategoryForm from '@/components/CategoryForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { 
    categories, 
    loadingCategories: loading, 
    fetchCategories, 
    deleteCategory,
    addCategory,
    updateCategory 
  } = useDashboardStore();

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // Added fetchCategories to dependency array

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleFormSubmit = async (formData: Partial<Category>) => {
    try {
      if (editingCategory) {
        // Update category
        await updateCategory(editingCategory.id, formData);
        toast.success('Category updated successfully');
      } else {
        // Add new category
        await addCategory(formData as Omit<Category, 'id' | 'createdAt' | 'products'>);
        toast.success('Category added successfully');
      }
      
      // Refresh the list
      await fetchCategories();
      
      // Reset form state
      handleFormClose();
    } catch (error) {
      console.error('Error submitting category:', error);
      toast.error('Failed to save category');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <CategoriesTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={deleteCategory}
        />
      )}

      <CategoryForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingCategory}
      />
    </div>
  );
}