import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  name: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductImage {
  id: number;
  url: string;
  isMain: boolean;
  productId: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
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
  description: string;
  price: number;
  quantity: number;
  images: ProductImage[];
  category?: Category;
  collection?: Collection;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
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

interface DashboardStore {
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

  // Cart operations
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;

  // Product operations
  fetchProducts: (
    page?: number, 
    pageSize?: number,
    filters?: {
      search?: string;
      categoryId?: number;
      collectionId?: number;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
    }
  ) => Promise<void>;
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
}

export const useDashboardStore = create<DashboardStore>()(
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
      fetchProducts: async (page = 1, pageSize = 20, filters = {}) => {
        try {
          set({ isLoading: true });
          
          // Build query parameters
          const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            ...(filters.search && { search: filters.search }),
            ...(filters.categoryId && { categoryId: filters.categoryId.toString() }),
            ...(filters.collectionId && { collectionId: filters.collectionId.toString() }),
            ...(filters.minPrice && { minPrice: filters.minPrice.toString() }),
            ...(filters.maxPrice && { maxPrice: filters.maxPrice.toString() }),
            ...(filters.sortBy && { sortBy: filters.sortBy }),
          });

          const response = await fetch(`/api/products?${params.toString()}`);
          if (!response.ok) throw new Error('Failed to fetch products');
          
          const data = await response.json();
          set({
            products: data.products,
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            totalProducts: data.totalProducts,
            pageSize: data.pageSize,
            isLoading: false
          });
        } catch (error) {
          console.error('Error fetching products:', error);
          set({ isLoading: false });
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

      addProduct: async (formData) => {
        try {
          const response = await fetch("/api/products", {
            method: "POST",
            body: formData,
          });
          if (!response.ok) throw new Error("Failed to add product");
          const newProduct = await response.json();
          set((state) => ({
            products: [...state.products, newProduct],
          }));
          return newProduct;
        } catch (error) {
          console.error("Error adding product:", error);
          throw error;
        }
      },

      updateProduct: async (id, formData) => {
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: "PUT",
            body: formData,
          });
          if (!response.ok) throw new Error("Failed to update product");
          const updatedProduct = await response.json();
          set((state) => ({
            products: state.products.map((product) =>
              product.id === id ? updatedProduct : product
            ),
          }));
          return updatedProduct;
        } catch (error) {
          console.error("Error updating product:", error);
          throw error;
        }
      },

      deleteProduct: async (id) => {
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) throw new Error("Failed to delete product");
          set((state) => ({
            products: state.products.filter((product) => product.id !== id),
          }));
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      },

      // Category operations
      fetchCategories: async () => {
        try {
          set({ loadingCategories: true });
          const response = await fetch("/api/categories");
          if (!response.ok) throw new Error("Failed to fetch categories");
          const data = await response.json();
          set({ categories: data });
        } catch (error) {
          console.error("Error fetching categories:", error);
        } finally {
          set({ loadingCategories: false });
        }
      },

      addCategory: async (category) => {
        try {
          const response = await fetch("/api/categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(category),
          });

          if (!response.ok) throw new Error("Failed to add category");

          const newCategory = await response.json();
          set((state) => ({
            categories: [...state.categories, newCategory],
          }));

          return newCategory;
        } catch (error) {
          console.error("Error adding category:", error);
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
