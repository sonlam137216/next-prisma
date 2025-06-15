'use client';

import { Collection } from '@/app/store/collectionStore';
import { Category, Product } from '@/app/store/dashboardStore';
import { Suspense } from 'react';
import ProductsContentWithParams from './ProductsContentWithParams';

interface InitialData {
  products: Product[];
  categories: Category[];
  collections: Collection[];
}

interface ProductsContentProps {
  initialData: InitialData;
}

export default function ProductsContent({ initialData }: ProductsContentProps) {
  return (
    <Suspense fallback={
      <div className="max-w-[1200px] mx-auto py-12 px-4 sm:px-5 lg:px-6">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ProductsContentWithParams initialData={initialData} />
    </Suspense>
  );
} 