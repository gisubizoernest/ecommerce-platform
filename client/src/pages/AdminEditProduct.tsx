import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Upload } from 'lucide-react'
import { api } from '../lib/axios'

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1),
  images: z.string().min(1),
})
type FormData = z.infer<typeof schema>

export function AdminEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then((res) => res.data),
  })
  const product = products?.find((p: any) => p.id === id)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((res) => res.data),
  })

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const imagesValue = watch('images')

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: Number(product.price),
        stock: product.stock,
        categoryId: product.categoryId,
        images: product.images,
      })
      setPreviewUrl(product.images)
    }
  }, [product, reset])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setValue('images', res.data.url, { shouldValidate: true })
      setPreviewUrl(res.data.url)
      toast.success('Image uploaded')
    } catch {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => api.put(`/products/${id}`, data),
    onSuccess: () => {
      toast.success('Product updated')
      navigate('/admin/products')
    },
    onError: () => toast.error('Failed to update product'),
  })

  if (!product) return <p>Loading...</p>

  return (
    <div className="max-w-lg mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="space-y-4">
        <input {...register('name')} placeholder="Name" className="w-full border rounded-lg px-3 py-2" style={{ borderColor: 'var(--color-border)' }} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <textarea {...register('description')} placeholder="Description" className="w-full border rounded-lg px-3 py-2" style={{ borderColor: 'var(--color-border)' }} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

        <input {...register('price')} type="number" step="0.01" placeholder="Price" className="w-full border rounded-lg px-3 py-2" style={{ borderColor: 'var(--color-border)' }} />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}

        <input {...register('stock')} type="number" placeholder="Stock" className="w-full border rounded-lg px-3 py-2" style={{ borderColor: 'var(--color-border)' }} />
        {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}

        <select {...register('categoryId')} className="w-full border rounded-lg px-3 py-2" style={{ borderColor: 'var(--color-border)' }}>
          {categories?.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}

        <div>
          <label className="flex items-center gap-2 border-2 border-dashed rounded-lg px-4 py-6 cursor-pointer text-sm text-gray-500 hover:border-gray-400 transition-colors" style={{ borderColor: 'var(--color-border)' }}>
            <Upload size={18} />
            {uploading ? 'Uploading...' : 'Click to upload a new image (optional)'}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
          </label>
          <input type="hidden" {...register('images')} />
          {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}
          {(previewUrl || imagesValue) && (
            <img src={previewUrl || imagesValue} alt="Preview" className="mt-3 w-24 h-24 object-cover rounded-lg border" style={{ borderColor: 'var(--color-border)' }} />
          )}
        </div>

        <button disabled={isSubmitting || uploading} className="w-full text-white rounded-lg py-2 font-medium" style={{ background: 'var(--color-header)' }}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}