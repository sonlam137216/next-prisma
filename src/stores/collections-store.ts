import { create } from 'zustand'
import axios from 'axios'

export interface Collection {
  id: number
  name: string
  description?: string
  imageUrl?: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

interface CollectionsState {
  collections: Collection[]
  loading: boolean
  error: string | null
  fetchCollections: () => Promise<void>
  createCollection: (data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateCollection: (id: number, data: Partial<Collection>) => Promise<void>
  deleteCollection: (id: number) => Promise<void>
}

export const useCollectionsStore = create<CollectionsState>((set) => ({
  collections: [],
  loading: false,
  error: null,

  fetchCollections: async () => {
    set({ loading: true, error: null })
    try {
      const response = await axios.get('/api/admin/collections')
      set({ collections: response.data, loading: false })
    } catch (error) {
      set({ error: 'Failed to fetch collections', loading: false })
    }
  },

  createCollection: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.post('/api/admin/collections', data)
      set((state) => ({
        collections: [...state.collections, response.data],
        loading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to create collection', loading: false })
    }
  },

  updateCollection: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.put(`/api/admin/collections/${id}`, data)
      set((state) => ({
        collections: state.collections.map((collection) =>
          collection.id === id ? response.data : collection
        ),
        loading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to update collection', loading: false })
    }
  },

  deleteCollection: async (id) => {
    set({ loading: true, error: null })
    try {
      await axios.delete(`/api/admin/collections/${id}`)
      set((state) => ({
        collections: state.collections.filter((collection) => collection.id !== id),
        loading: false,
      }))
    } catch (error) {
      set({ error: 'Failed to delete collection', loading: false })
    }
  },
})) 