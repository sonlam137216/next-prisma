import { create } from 'zustand';

export interface Collection {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CollectionStore {
  collections: Collection[];
  loading: boolean;
  error: string | null;
  fetchCollections: () => Promise<void>;
  addCollection: (formData: FormData) => Promise<void>;
  updateCollection: (id: number, formData: FormData) => Promise<void>;
  deleteCollection: (id: number) => Promise<void>;
  toggleActiveStatus: (id: number) => Promise<void>;
}

export const useCollectionStore = create<CollectionStore>((set) => ({
  collections: [],
  loading: false,
  error: null,

  fetchCollections: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('/api/collections');
      if (!response.ok) throw new Error('Failed to fetch collections');
      const data = await response.json();
      set({ collections: data, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
    }
  },

  addCollection: async (formData: FormData) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('/api/collections', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to add collection');
      const newCollection = await response.json();
      set((state) => ({
        collections: [...state.collections, newCollection],
        loading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
      throw error;
    }
  },

  updateCollection: async (id: number, formData: FormData) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`/api/collections/${id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update collection');
      const updatedCollection = await response.json();
      set((state) => ({
        collections: state.collections.map((c) => (c.id === id ? updatedCollection : c)),
        loading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
      throw error;
    }
  },

  deleteCollection: async (id: number) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`/api/collections/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete collection');
      set((state) => ({
        collections: state.collections.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
      throw error;
    }
  },

  toggleActiveStatus: async (id: number) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(`/api/collections/${id}/toggle-active`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to toggle collection status');
      const updatedCollection = await response.json();
      set((state) => ({
        collections: state.collections.map((c) => (c.id === id ? updatedCollection : c)),
        loading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', loading: false });
      throw error;
    }
  },
})); 