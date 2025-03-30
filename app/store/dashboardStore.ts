import { create } from "zustand";

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

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  inStock: boolean;
  createdAt: string;
  updatedAt?: string;
  authorId: number;
  categoryId: number;
  category?: Category;
  author?: User;
  images: ProductImage[];
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

  // User operations
  fetchUsers: () => Promise<void>;
  deleteUser: (id: number) => Promise<void>;

  // Product operations
  fetchProducts: () => Promise<void>;
  addProduct: (formData: FormData) => Promise<void>;
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

export const useDashboardStore = create<DashboardStore>((set) => ({
  users: [],
  products: [],
  categories: [],
  blogPosts: [],
  loadingCategories: false,

  // User operations
  fetchUsers: async () => {
    try {
      // const response = await fetch("/api/users");
      // if (!response.ok) throw new Error("Failed to fetch users");
      // const users = await response.json();
      set({ users: [] });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  },

  // Product operations
  fetchProducts: async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const products = await response.json();
      set({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
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
}));
