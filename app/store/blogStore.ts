// app/store/blogStore.ts
import { create } from "zustand";
import axios from "axios";
import { format } from 'date-fns';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description?: string;
  featuredImage?: string;
  path?: string;
  content?: string;
  category: string;
  readingTime: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  featuredPost: BlogPost | null;
  categories: string[];
  selectedCategory: string;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalPosts: number;
  };
  setSelectedCategory: (category: string) => void;
  fetchPosts: (page: number, category?: string) => Promise<void>;
  fetchPostById: (id: number) => Promise<void>;
  fetchPostBySlug: (slug: string) => Promise<void>;
  fetchFeaturedPost: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  createPost: (post: BlogPost, content: string, featuredImage?: File) => Promise<boolean>;
  updatePost: (post: BlogPost, content?: string, featuredImage?: File) => Promise<boolean>;
  deletePost: (id: number) => Promise<boolean>;
  setCurrentPost: (post: BlogPost | null) => void;
}

// Predefined categories
const CATEGORIES = [
  "Phong thủy",
  "Đá quý",
  "Kiến thức",
  "Tin tức",
];

// Create axios instance with default configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This ensures cookies are sent with requests
});

export const useBlogStore = create<BlogState>((set, get) => ({
  posts: [],
  currentPost: null,
  featuredPost: null,
  categories: CATEGORIES, // Initialize with predefined categories
  selectedCategory: 'Tất cả',
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 9,
    totalPages: 1,
    totalPosts: 0,
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().fetchPosts(1, category === 'Tất cả' ? undefined : category);
  },

  fetchPosts: async (page, category) => {
    try {
      set({ loading: true, error: null });
      const params = {
        page,
        pageSize: 9,
        category: category && category !== 'Tất cả' ? category : undefined,
      };
      
      const { data } = await api.get('/admin/blog', { params });

      if (!data.posts) {
        console.error('No posts in response:', data);
        throw new Error('Invalid response format');
      }

      set({
        posts: data.posts,
        pagination: {
          page: data.page,
          pageSize: data.pageSize,
          totalPages: data.totalPages,
          totalPosts: data.totalPosts,
        },
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ loading: false });
    }
  },

  fetchPostById: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const url = `/admin/blog/${id}`;
      
      const { data } = await api.get(url);
      
      if (!data.post) {
        console.error('No post in response:', data);
        throw new Error("Post not found");
      }

      set({ currentPost: data.post });
    } catch (error) {
      console.error("Error fetching post:", error);
      set({ error: error instanceof Error ? error.message : "An error occurred" });
    } finally {
      set({ loading: false });
    }
  },

  fetchPostBySlug: async (slug) => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.get(`/blog/${slug}`);
      
      // Fetch content from file if path exists
      if (data.post.path) {
        const contentResponse = await axios.get(data.post.path);
        if (contentResponse.status === 200) {
          data.post.content = contentResponse.data;
        }
      }
      
      set({ currentPost: data.post });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "An error occurred" });
    } finally {
      set({ loading: false });
    }
  },

  fetchFeaturedPost: async () => {
    try {
      const { data } = await api.get('/admin/blog/featured');
      set({ featuredPost: data.post });
    } catch (error) {
      console.error('Error fetching featured post:', error);
      set({ featuredPost: null });
    }
  },

  fetchCategories: async () => {
    // No need to fetch from API, just use predefined categories
    set({ categories: CATEGORIES });
  },

  createPost: async (post, content, featuredImage) => {
    try {
      set({ loading: true, error: null });
      const formData = new FormData();
      formData.append("postData", JSON.stringify(post));
      formData.append("content", content);
      if (featuredImage) {
        formData.append("featuredImage", featuredImage);
      }

      const { data } = await api.post("/admin/blog", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set((state) => ({
        posts: [...state.posts, data.post],
      }));

      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "An error occurred" });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updatePost: async (post, content, featuredImage) => {
    try {
      set({ loading: true, error: null });
      const formData = new FormData();
      formData.append("postData", JSON.stringify(post));
      if (content) {
        formData.append("content", content);
      }
      if (featuredImage) {
        formData.append("featuredImage", featuredImage);
      }

      const { data } = await api.put("/admin/blog", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      set((state) => ({
        posts: state.posts.map((p) => (p.id === post.id ? data.post : p)),
        currentPost: data.post,
      }));

      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "An error occurred" });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deletePost: async (id) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/admin/blog/${id}`);

      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        currentPost: state.currentPost?.id === id ? null : state.currentPost,
      }));

      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "An error occurred" });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  setCurrentPost: (post) => {
    set({ currentPost: post });
  },
}));
