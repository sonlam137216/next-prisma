// app/store/blogStore.ts (updated with Axios)
import { create } from "zustand";
import axios from "axios";

export interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  description: string;
  path: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  featuredImage?: string;
  content?: string;
}

interface BlogState {
  posts: BlogPost[];
  currentPost: BlogPost | null;
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  fetchPostById: (id: number) => Promise<void>;
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

export const useBlogStore = create<BlogState>((set) => ({
  posts: [],
  currentPost: null,
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/admin/blog");
      set({ posts: response.data.posts });
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

      console.log("Sending request to update blog post...");

      const response = await api.put("/api/admin/blog", formData);

      console.log("Blog post updated successfully:", response.data);

      // Update the posts list and current post
      set((state) => ({
        posts: state.posts.map((p) =>
          p.id === post.id ? response.data.post : p
        ),
        currentPost: response.data.post,
      }));

      return true;
    } catch (error) {
      console.error("Error updating blog post:", error);

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
      const response = await api.delete(`/api/admin/blog/${id}`);

      // Remove the post from the list
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        currentPost: state.currentPost?.id === id ? null : state.currentPost,
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

  setCurrentPost: (post: BlogPost | null) => {
    set({ currentPost: post });
  },
}));
