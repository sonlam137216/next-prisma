'use client';

import { useEffect, useState } from 'react';
import { useDashboardStore } from '@/app/store/dashboardStore';
import { useCollectionStore } from '@/app/store/collectionStore';
import ProductsContent from './ProductsContent';
import { useSearchParams } from 'next/navigation';

export default function ProductsPageContent() {
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const { products, fetchProducts, fetchCategories } = useDashboardStore();
  const { collections, fetchCollections } = useCollectionStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const filters = {
          categoryId: categoryId ? parseInt(categoryId) : undefined,
          page: 1,
          limit: 12
        };
        await Promise.all([
          fetchProducts(1, 12, filters),
          fetchCategories(),
          fetchCollections()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchProducts, fetchCategories, fetchCollections, categoryId]);

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto py-12 px-4 sm:px-5 lg:px-6">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return <ProductsContent initialData={{ products, categories: [], collections }} />;
} 