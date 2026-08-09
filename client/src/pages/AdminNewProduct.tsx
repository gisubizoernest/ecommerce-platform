import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '../lib/axios'

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(5),
  price: z.coerce.number().positive(),
  sku: z.string().min(2),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1),
  images: z.string().min(1),
})
type FormData = z.infer<typeof schema>

export function AdminNewProduct() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  })

  async function onSubmit(data: FormData) {
    try {
      await api.post('/products', data)
      toast.success('Product created')
      reset()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create product')
    }
  }

  return (
    <div className="max-w-lg mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register('name')} placeholder="Name" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <input {...register('slug')} placeholder="Slug (e.g. blue-t-shirt)" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}

        <textarea {...register('description')} placeholder="Description" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

        <input {...register('price')} placeholder="Price" type="number" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

        <input {...register('sku')} placeholder="SKU" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        {errors.sku && <p className="text-red-500 text-sm">{errors.sku.message}</p>}

        <input {...register('stock')} placeholder="Stock" type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}

        <select {...register('categoryId')} className="w-full border border-gray-300 rounded-lg px-3 py-2">
          <option value="">Select category</option>
          {categories?.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}

        <input {...register('images')} placeholder="Image URL" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}

        <button disabled={isSubmitting} className="w-full bg-gray-900 text-white rounded-lg py-2 font-medium hover:bg-gray-800">
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  )
}