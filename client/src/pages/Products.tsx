import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal } from 'lucide-react'
import { api } from '../lib/axios'
import { ProductCard } from '../components/ProductCard'

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  })

  const search = searchParams.get('search') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const sort = searchParams.get('sort') || ''

  const { data, isLoading } = useQuery({
    queryKey: ['products', search, categoryId, sort],
    queryFn: () =>
      api.get('/products', { params: { search, categoryId, sort } }).then((res) => res.data),
  })

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-56 shrink-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
          <SlidersHorizontal size={15} /> Filters
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            updateParam('search', searchInput)
          }}
          className="mb-5"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search..."
            className="w-full border rounded-md px-3 py-2 text-sm"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </form>

        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Category</p>
          <div className="space-y-1.5">
            <button
              onClick={() => updateParam('categoryId', '')}
              className={`block text-sm ${!categoryId ? 'font-semibold text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              All categories
            </button>
            {categories?.map((c: any) => (
              <button
                key={c.id}
                onClick={() => updateParam('categoryId', c.id)}
                className={`block text-sm ${categoryId === c.id ? 'font-semibold text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Sort by</p>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <option value="">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
          </select>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-gray-900">
            {search ? `Results for "${search}"` : 'All Products'}
          </h1>
          {data && <p className="text-sm text-gray-500">{data.length} items</p>}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : data?.length === 0 ? (
          <div className="text-center py-24 border rounded-lg" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-gray-500">No products match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {data?.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}