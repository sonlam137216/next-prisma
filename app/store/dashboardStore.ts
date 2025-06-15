import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  name: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// interface ProductImage {
//   id: number;
//   url: string;
//   isMain: boolean;
//   productId: number;
//   createdAt: string;
//   updatedAt: string;
// }

export interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  products?: Product[];
}

export interface Collection {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  inStock: boolean;
  type: "PHONG_THUY" | "THOI_TRANG";
  line: "CAO_CAP" | "TRUNG_CAP" | "PHO_THONG";
  createdAt: string;
  updatedAt?: string;
  categoryId: number;
  images: Array<{
    id: number;
    url: string;
    isMain: boolean;
  }>;
  category?: Category;
  collection?: Collection;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  maxQuantity: number; // The available stock
}

interface BlogPost {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  author?: User;
}

interface ProductFilters {
  search?: string;
  categoryId?: number;
  collectionId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
  type?: string;
  line?: string;
}

interface DashboardState {
  users: User[];
  products: Product[];
  categories: Category[];
  blogPosts: BlogPost[];
  loadingCategories: boolean;
  cart: CartItem[];
  isCartOpen: boolean;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  pageSize: number;
  isLoading: boolean;
  loading: boolean;
  error: string | null;

  // Cart operations
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;

  // Product operations
  fetchProducts: (page: number, limit: number, filters?: ProductFilters) => Promise<void>;
  fetchProduct: (id: number) => Promise<Product | null>;
  addProduct: (formData: FormData) => Promise<void>;
  updateProduct: (id: number, formData: FormData) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;

  // Category operations
  fetchCategories: () => Promise<void>;
  addCategory: (
    category: Omit<Category, "id" | "createdAt" | "products">
  ) => Promise<void>;
  updateCategory: (id: number, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;

  // Blog operations
  fetchBlogPosts: () => Promise<void>;

  setInitialData: (products: Product[]) => void;
}

export const useDashboardStore = create<DashboardState & {
  fetchProducts: (page: number, limit: number, filters?: ProductFilters) => Promise<void>;
  fetchCategories: () => Promise<void>;
  addProduct: (formData: FormData) => Promise<void>;
  updateProduct: (id: number, formData: FormData) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}>(
  persist(
    (set, get) => ({
      users: [],
      products: [],
      categories: [],
      blogPosts: [],
      loadingCategories: false,
      cart: [],
      isCartOpen: false,
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      pageSize: 20,
      isLoading: false,
      loading: false,
      error: null,

      // Cart operations
      addToCart: (product, quantity) => {
        const cart = get().cart;
        const existingItemIndex = cart.findIndex(
          (item) => item.productId === product.id
        );

        if (existingItemIndex >= 0) {
          // Item already exists in cart, update quantity
          const updatedCart = [...cart];
          const newQuantity = Math.min(
            updatedCart[existingItemIndex].quantity + quantity,
            product.quantity // Don't exceed available stock
          );

          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: newQuantity,
          };

          set({ cart: updatedCart });
        } else {
          // Add new item to cart
          const mainImage =
            product.images.find((img) => img.isMain) || product.images[0];
          const imageUrl = mainImage ? mainImage.url : "";

          const newItem: CartItem = {
            id: Date.now(), // Unique identifier for cart item
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: Math.min(quantity, product.quantity),
            imageUrl,
            maxQuantity: product.quantity,
          };

          set({ cart: [...cart, newItem] });
        }
      },

      removeFromCart: (productId) => {
        set({
          cart: get().cart.filter((item) => item.productId !== productId),
        });
      },

      updateCartItemQuantity: (productId, quantity) => {
        const cart = get().cart;
        const updatedCart = cart.map((item) => {
          if (item.productId === productId) {
            return {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.maxQuantity)),
            };
          }
          return item;
        });

        set({ cart: updatedCart });
      },

      toggleCart: () => {
        set({ isCartOpen: !get().isCartOpen });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      // Product operations
      fetchProducts: async (page = 1, limit = 20, filters: ProductFilters = {}) => {
        set({ loading: true, error: null });
        try {
          const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
          });
          if (filters.search) params.append('search', filters.search);
          if (filters.type) params.append('type', filters.type);
          if (filters.line) params.append('line', filters.line);
          if (filters.categoryId) params.append('categoryId', String(filters.categoryId));
          if (filters.collectionId) params.append('collectionId', String(filters.collectionId));
          if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
          if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
          if (filters.sortBy) params.append('sortBy', filters.sortBy);
          const response = await fetch(`/api/products?${params.toString()}`);
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to fetch products');
          }
          const data = await response.json();
          set({ products: data.products || [], loading: false });
        } catch (error) {
          console.error('Error fetching products:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            loading: false,
            products: [] 
          });
        }
      },

      fetchProduct: async (id) => {
        try {
          const response = await fetch(`/api/products/${id}`);
          if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error('Failed to fetch product');
          }
          const product = await response.json();
          return product;
        } catch (error) {
          console.error('Error fetching product:', error);
          return null;
        }
      },

      updateProduct: async (id, formData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            body: formData,
          });
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update product');
          }
          const updatedProduct = await response.json();
          set((state) => ({
            products: state.products.map((p) => 
              p.id === id ? { ...updatedProduct, images: updatedProduct.images || [] } : p
            ),
            loading: false,
          }));
        } catch (error) {
          console.error('Error updating product:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            loading: false 
          });
        }
      },

      addProduct: async (formData) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/products', {
            method: 'POST',
            body: formData,
          });
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add product');
          }
          const newProduct = await response.json();
          set((state) => ({
            products: [...state.products, newProduct],
            loading: false,
          }));
        } catch (error) {
          console.error('Error adding product:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            loading: false 
          });
        }
      },

      deleteProduct: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
          });
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete product');
          }
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
            loading: false,
          }));
        } catch (error) {
          console.error('Error deleting product:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            loading: false 
          });
        }
      },

      // Category operations
      fetchCategories: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/categories');
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch categories');
          }
          const data = await response.json();
          set({ categories: data, loading: false });
        } catch (error) {
          console.error('Error fetching categories:', error);
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            loading: false,
            categories: [] 
          });
        }
      },

      addCategory: async (category) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch("/api/categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(category),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add category');
          }

          const newCategory = await response.json();
          set((state) => ({
            categories: [...state.categories, newCategory],
            loading: false
          }));

          return newCategory;
        } catch (error) {
          console.error("Error adding category:", error);
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred',
            loading: false 
          });
          throw error;
        }
      },

      updateCategory: async (id, data) => {
        try {
          const response = await fetch(`/api/categories/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) throw new Error("Failed to update category");

          const updatedCategory = await response.json();
          set((state) => ({
            categories: state.categories.map((cat) =>
              cat.id === id ? updatedCategory : cat
            ),
          }));

          return updatedCategory;
        } catch (error) {
          console.error("Error updating category:", error);
          throw error;
        }
      },

      deleteCategory: async (id) => {
        try {
          const response = await fetch(`/api/categories/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Failed to delete category");

          set((state) => ({
            categories: state.categories.filter((cat) => cat.id !== id),
          }));
        } catch (error) {
          console.error("Error deleting category:", error);
          throw error;
        }
      },

      // Blog operations
      fetchBlogPosts: async () => {
        try {
          const response = await fetch("/api/blog-posts");
          if (!response.ok) throw new Error("Failed to fetch blog posts");
          const blogPosts = await response.json();
          set({ blogPosts });
        } catch (error) {
          console.error("Error fetching blog posts:", error);
        }
      },

      setInitialData: (products: Product[]) => {
        set({ products });
      },
    }),
    {
      name: 'dashboard-store',
      partialize: (state) => ({
        cart: state.cart,
        isCartOpen: state.isCartOpen,
      }),
    }
  )
);
