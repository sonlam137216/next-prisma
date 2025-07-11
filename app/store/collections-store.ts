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
  products: Product[]
}

interface Product {
  id: number
  name: string
  stoneSizes: import("@/app/types/product").StoneSize[]
}

interface CollectionsState {
  collections: Collection[]
  loading: boolean
  error: string | null
  fetchCollections: () => Promise<void>
  createCollection: (data: {
    name: string
    description?: string
    imageUrl?: string
    active: boolean
    productIds: number[]
  }) => Promise<void>
  updateCollection: (id: number, data: {
    name?: string
    description?: string
    imageUrl?: string
    active?: boolean
    productIds?: number[]
  }) => Promise<void>
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
    } catch {
      console.error('Failed to fetch collections')
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
    } catch {
      console.error('Failed to create collection')
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
    } catch {
      console.error('Failed to update collection')
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
    } catch {
      console.error('Failed to delete collection')
      set({ error: 'Failed to delete collection', loading: false })
    }
  },
})) 