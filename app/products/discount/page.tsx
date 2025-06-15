'use client';

import { Suspense } from 'react';
import DiscountProductsPageContent from './DiscountProductsPageContent';

// interface DiscountProduct extends Product {
//   images: {
//     id: number;
//     url: string;
//     isMain: boolean;
//     createdAt: Date;
//     updatedAt: Date;
//     productId: number;
//   }[];
//   category: { name: string } | null;
// }

// interface FormattedCollection {
//   id: number;
//   name: string;
//   description: string | null;
//   imageUrl: string | null;
//   active: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

export default function DiscountProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1200px] mx-auto py-12 px-4 sm:px-5 lg:px-6">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    }>
      <DiscountProductsPageContent />
    </Suspense>
  );
} 