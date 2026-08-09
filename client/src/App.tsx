import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Products } from './pages/Products'
import { ProductDetail } from './pages/ProductDetail'
import { Login } from './pages/Login'
import { AdminNewProduct } from './pages/AdminNewProduct'
import { Cart } from './pages/Cart'
import { CheckoutSuccess } from './pages/CheckoutSuccess'
import { AdminRoute } from './components/AdminRoute'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminOrders } from './pages/AdminOrders'
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/products/new" element={<AdminNewProduct />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/products/new" element={<AdminNewProduct />} />
</Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App