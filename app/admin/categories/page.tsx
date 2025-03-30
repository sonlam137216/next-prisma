'use client';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryList from '@/components/CategoryList';
import CategoryForm from '@/components/CategoryForm';
import { useDashboardStore } from '@/app/store/dashboardStore';

export default function CategoriesPage() {
  // Local UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Only use store for API-related operations
  const {
    categories,
    loadingCategories,
    fetchCategories,
    deleteCategory,
    addCategory,
    updateCategory
  } = useDashboardStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      
      // Refresh the list
      await fetchCategories();
      
      // Reset form state
      handleFormClose();
    } catch (error) {
      console.error('Error submitting category:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      // Refresh the list
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Button onClick={handleAddNew}>Add New Category</Button>
      </div>
      {loadingCategories ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <CategoryList
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
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