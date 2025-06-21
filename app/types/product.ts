export type ProductType = 'PHONG_THUY' | 'THOI_TRANG';
export type ProductLine = 'CAO_CAP' | 'TRUNG_CAP' | 'PHO_THONG';

export const PRODUCT_TYPES: ProductType[] = ['PHONG_THUY', 'THOI_TRANG'];
export const PRODUCT_LINES: ProductLine[] = ['CAO_CAP', 'TRUNG_CAP', 'PHO_THONG'];

export interface StoneSize {
  id: number;
  size: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  detailedDescription?: string;
  price: number;
  quantity: number;
  inStock: boolean;
  stoneSizes: StoneSize[];
} 