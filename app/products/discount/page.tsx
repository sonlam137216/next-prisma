'use client';

import { useCollectionStore } from '@/app/store/collectionStore';
import { Product } from '@prisma/client';
import axios from 'axios';
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from 'react';
import DiscountProductsContent from './DiscountProductsContent';

interface DiscountProduct extends Product {
  images: {
    id: number;
    url: string;
    isMain: boolean;
    createdAt: Date;
    updatedAt: Date;
    productId: number;
  }[];
  category: { name: string } | null;
}

interface FormattedCollection {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function DiscountProductsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<DiscountProduct[]>([]);
  const [formattedCollections, setFormattedCollections] = useState<FormattedCollection[]>([]);
  const { collections, fetchCollections } = useCollectionStore();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      if (!isInitialLoad) return;
      
      try {
        setIsLoading(true);
        const [productsResponse, collectionsResponse] = await Promise.all([
          axios.get('/api/products/discount?page=1&limit=12'),
          fetchCollections()
        ]);
        
        setProducts(productsResponse.data.products);
        setFormattedCollections(collections.map(collection => ({
          ...collection,
          createdAt: new Date(collection.createdAt),
          updatedAt: new Date(collection.updatedAt)
        })));
        setIsInitialLoad(false);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchCollections, isInitialLoad]);

  // Update formatted collections when collections change
  useEffect(() => {
    if (!isInitialLoad && collections.length > 0) {
      setFormattedCollections(collections.map(collection => ({
        ...collection,
        createdAt: new Date(collection.createdAt),
        updatedAt: new Date(collection.updatedAt)
      })));
    }
  }, [collections, isInitialLoad]);

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto py-12 px-4 sm:px-5 lg:px-6">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6 mt-10">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="list-reset flex">
            <li>
              <Link href="/" className="hover:underline text-gray-700">Trang chủ</Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li>
              <Link href="/products" className="hover:underline text-gray-700">Sản phẩm</Link>
            </li>
            <li><span className="mx-2">/</span></li>
            <li className="text-primary font-semibold">Khuyến mãi</li>
          </ol>
        </nav>
      </div>

      {/* Banner Image */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-6">
        <div className="relative w-full h-[350px] mb-8">
          <Image
            src="/blog-content/GARNET-LUU-DO-CHARM-PHUC-1748676755615.jpg"
            alt="Banner Khuyến mãi"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

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
        <DiscountProductsContent initialData={{ products, categories: [], collections: formattedCollections }} />
      </Suspense>
    </>
  );
} 