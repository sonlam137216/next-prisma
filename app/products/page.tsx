// app/products/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsContent from './ProductsContent';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Products | GEM Store',
  description: 'Browse our collection of high-quality products. Find the best deals on various categories including electronics, fashion, and more.',
  keywords: 'products, online store, shopping, deals, categories',
  openGraph: {
    title: 'Products | Your Store Name',
    description: 'Browse our collection of high-quality products. Find the best deals on various categories.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Your Store Name',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Products | Your Store Name',
    description: 'Browse our collection of high-quality products. Find the best deals on various categories.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

async function getInitialData() {
  try {
    const [products, categories, collections] = await Promise.all([
      prisma.product.findMany({
        take: 12,
        include: {
          category: true,
          images: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.category.findMany(),
      prisma.collection.findMany(),
    ]);

    // Convert Date objects to strings
    const formattedProducts = products.map(product => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      category: product.category ? {
        ...product.category,
        createdAt: product.category.createdAt.toISOString(),
      } : undefined,
      images: product.images.map(image => ({
        ...image,
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toISOString(),
      })),
    }));

    return {
      products: formattedProducts,
      categories: categories.map(cat => ({
        ...cat,
        createdAt: cat.createdAt.toISOString(),
      })),
      collections: collections.map(col => ({
        ...col,
        createdAt: col.createdAt.toISOString(),
        updatedAt: col.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      products: [],
      categories: [],
      collections: [],
    };
  }
}

export default async function ProductsPage() {
  const initialData = await getInitialData();

  return (
    <Suspense fallback={
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="h-[400px] bg-gray-100 animate-pulse rounded-lg" />
          </div>
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
                  <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductsContent initialData={initialData} />
    </Suspense>
  );
}