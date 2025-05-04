'use client'

import { useEffect } from 'react'
import { useCollectionsStore } from '@/app/store/collections-store'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CollectionsTable } from '@/components/admin/collections-table'
import { CreateCollectionDialog } from '@/components/admin/create-collection-dialog'

export default function CollectionsPage() {
  const { collections, loading, error, fetchCollections } = useCollectionsStore()

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Collections</h1>
        <CreateCollectionDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Collection
          </Button>
        </CreateCollectionDialog>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <CollectionsTable collections={collections} />
      )}
    </div>
  )
} 