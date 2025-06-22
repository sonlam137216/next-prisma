import { Product, StoneSize } from '@prisma/client';

export type { Product, StoneSize };

export type ProductType = 'PHONG_THUY' | 'THOI_TRANG';
export type ProductLine = 'CAO_CAP' | 'TRUNG_CAP' | 'PHO_THONG';
export type Menh = "KIM" | "MOC" | "THUY" | "HOA" | "THO";

export const PRODUCT_TYPES: ProductType[] = ['PHONG_THUY', 'THOI_TRANG'];
export const PRODUCT_LINES: ProductLine[] = ['CAO_CAP', 'TRUNG_CAP', 'PHO_THONG']; 