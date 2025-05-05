// app/store/blogStore.ts
import { create } from "zustand";
import axios from "axios";

export interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  description: string; // We'll extract this from HTML content
  path: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  featuredImage?: string;
  content?: string;
}

interface PaginationState {
  page: number;
  pageSize: number;
  totalPosts: number;
  totalPages: number;
}

interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationState;

  // Pagination methods
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Existing methods
  fetchPosts: (page?: number, pageSize?: number) => Promise<void>;
  fetchPostById: (id: number) => Promise<void>;
  fetchPostBySlug: (slug: string) => Promise<void>;
  createPost: (
    post: BlogPost,
    content: string,
    featuredImage?: File
  ) => Promise<boolean>;
  updatePost: (
    post: BlogPost,
    content?: string,
    featuredImage?: File
  ) => Promise<boolean>;
  deletePost: (id: number) => Promise<boolean>;
  setCurrentPost: (post: BlogPost | null) => void;
}

// Create axios instance with default configuration
const api = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const useBlogStore = create<BlogState>((set, get) => ({
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 9, // Show 9 posts per page (3x3 grid)
    totalPosts: 0,
    totalPages: 1,
  },

  setPage: (page: number) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        page,
      },
    }));
    // Fetch posts for the new page
    get().fetchPosts(page, get().pagination.pageSize);
  },

  setPageSize: (pageSize: number) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        pageSize,
        // Reset to page 1 when changing page size
        page: 1,
      },
    }));
    // Fetch posts with new page size
    get().fetchPosts(1, pageSize);
  },

  fetchPosts: async (page?: number, pageSize?: number) => {
    const currentPage = page || get().pagination.page;
    const currentPageSize = pageSize || get().pagination.pageSize;

    set({ loading: true, error: null });
    try {
      const response = await api.get(
        `/api/admin/blog?page=${currentPage}&pageSize=${currentPageSize}`
      );

      set({
        posts: response.data.posts,
        pagination: {
          page: currentPage,
          pageSize: currentPageSize,
          totalPosts: response.data.totalPosts,
          totalPages: response.data.totalPages,
        },
      });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchPostById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/admin/blog/${id}`);
      set({ currentPost: response.data.post });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchPostBySlug: async (slug: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/blog/${slug}`);
      set({ currentPost: response.data.post });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  createPost: async (post: BlogPost, content: string, featuredImage?: File) => {
    set({ loading: true, error: null });
    try {
      // Create FormData for the multipart request
      const formData = new FormData();

      // Add post data as JSON string
      formData.append("postData", JSON.stringify(post));

      // Add content and saveToFile flag
      formData.append("content", content);
      formData.append("saveToFile", "true");

      // Add the featured image if provided
      if (featuredImage) {
        formData.append("featuredImage", featuredImage);
      }

      console.log("Sending request to create blog post...");
      console.log("Content length:", content.length);

      // Debug formData contents
      for (let [key, value] of formData.entries()) {
        if (key === "content") {
          console.log(`${key}: [content length: ${value.toString().length}]`);
        } else if (key === "featuredImage" && value instanceof File) {
          console.log(
            `${key}: [file name: ${value.name}, size: ${value.size}]`
          );
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      // Make the request with a specific timeout
      const response = await api.post("/api/admin/blog", formData);

      console.log("Response received:", response.status);
      console.log("Blog post created successfully:", response.data);

      // Update the posts list
      set((state) => ({
        posts: [...state.posts, response.data.post],
      }));

      return true;
    } catch (error) {
      console.error("Error creating blog post:", error);

      // Handle Axios errors with better details
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error("API Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: errorMessage,
        });

        set({
          error: errorMessage,
        });
      } else {
        set({
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      }

      return false;
    } finally {
      set({ loading: false });
    }
  },

  updatePost: async (
    post: BlogPost,
    content?: string,
    featuredImage?: File
  ) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("postData", JSON.stringify(post));

      if (featuredImage) {
        formData.append("featuredImage", featuredImage);
      }

      if (content) {
        formData.append("content", content);
        formData.append("saveToFile", "true");
      }

      const response = await api.put("/api/admin/blog", formData);

      // Update the posts list and current post
      set((state) => ({
        posts: state.posts.map((p) =>
          p.id === post.id ? response.data.post : p
        ),
        currentPost: response.data.post,
      }));

      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || error.message,
        });
      } else {
        set({
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      }

      return false;
    } finally {
      set({ loading: false });
    }
  },

  deletePost: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/api/admin/blog/${id}`);

      // Update pagination counts and remove the post from the list
      set((state) => {
        const newTotalPosts = state.pagination.totalPosts - 1;
        const newTotalPages = Math.max(
          1,
          Math.ceil(newTotalPosts / state.pagination.pageSize)
        );

        return {
          posts: state.posts.filter((p) => p.id !== id),
          currentPost: state.currentPost?.id === id ? null : state.currentPost,
          pagination: {
            ...state.pagination,
            totalPosts: newTotalPosts,
            totalPages: newTotalPages,
            // Adjust current page if necessary
            page:
              state.pagination.page > newTotalPages
                ? newTotalPages
                : state.pagination.page,
          },
        };
      });

      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        set({
          error: error.response?.data?.message || error.message,
        });
      } else {
        set({
          error:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      }

      return false;
    } finally {
      set({ loading: false });
    }
  },

  setCurrentPost: (post: BlogPost | null) => {
    set({ currentPost: post });
  },
}));
