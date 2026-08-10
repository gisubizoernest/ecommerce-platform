import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'

export function Categories() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Shop by Category</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories?.map((c: any) => (
          <Link
            key={c.id}
            to={`/products?categoryId=${c.id}`}
            className="border rounded-lg p-6 text-center font-medium hover:shadow-md transition"
            style={{ borderColor: 'var(--color-border)' }}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  )
}