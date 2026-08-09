import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../lib/axios'
import { useAuthStore } from '../store/auth.store'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type FormData = z.infer<typeof schema>

export function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  async function onSubmit(data: FormData) {
    try {
      const res = await api.post('/auth/login', data)
      setAuth(res.data.user, res.data.token)
      toast.success('Welcome back!')
      navigate('/')
    } catch {
      toast.error('Invalid email or password')
    }
  }

  return (
    <div className="max-w-sm mx-auto py-16">
      <h1 className="text-2xl font-bold mb-6">Sign in</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input {...register('email')} placeholder="Email" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input {...register('password')} type="password" placeholder="Password" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <button disabled={isSubmitting} className="w-full bg-gray-900 text-white rounded-lg py-2 font-medium hover:bg-gray-800">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}