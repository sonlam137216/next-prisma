import { create } from "zustand";

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

export const useBlogStore = create<BlogState>((set) => ({
  posts: [],
  currentPost: null,
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/admin/blog");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch blog posts");
      }

      set({ posts: data.posts });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchPostById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/admin/blog/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch blog post");
      }

      set({ currentPost: data.post });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },

  createPost: async (post: BlogPost, content: string, featuredImage?: File) => {
    set({ loading: true, error: null });
    try {
      // First create the post to get the ID
      const formData = new FormData();
      formData.append("postData", JSON.stringify(post));

      if (featuredImage) {
        formData.append("featuredImage", featuredImage);
      }

      formData.append("content", content);

      const response = await fetch("/api/admin/blog", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create blog post");
      }

      // Update the posts list
      set((state) => ({
        posts: [...state.posts, data.post],
      }));

      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
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
      }

      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update blog post");
      }

      // Update the posts list and current post
      set((state) => ({
        posts: state.posts.map((p) => (p.id === post.id ? data.post : p)),
        currentPost: data.post,
      }));

      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deletePost: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete blog post");
      }

      // Remove the post from the list
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        currentPost: state.currentPost?.id === id ? null : state.currentPost,
      }));

      return true;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  setCurrentPost: (post: BlogPost | null) => {
    set({ currentPost: post });
  },
}));
