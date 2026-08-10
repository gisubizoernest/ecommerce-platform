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
import { Categories } from './pages/Categories'
import { AdminProducts } from './pages/AdminProducts'
import { AdminEditProduct } from './pages/AdminEditProduct'
import { Wishlist } from './pages/Wishlist'
import { Orders } from './pages/Orders'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={<Orders />} />

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/new" element={<AdminNewProduct />} />
              <Route path="/admin/products/:id/edit" element={<AdminEditProduct />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App