// app/products/page.tsx
'use client';
import { Suspense } from 'react';
import ProductsPageContent from './ProductsPageContent';

export default function ProductsPage() {  
  return (
    <Suspense fallback={
      <div className="max-w-[1200px] mx-auto py-12 px-4 sm:px-5 lg:px-6">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}