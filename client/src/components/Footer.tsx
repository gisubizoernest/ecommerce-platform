export function Footer() {
  return (
    <footer className="border-t mt-16" style={{ background: 'var(--color-header)', borderColor: 'var(--color-header-light)' }}>
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="text-white font-semibold mb-3">ShopHub</h4>
          <p className="text-gray-400 text-xs leading-relaxed">Premium products, modern shopping experience.</p>
        </div>
        <div>
          <h4 className="text-gray-300 font-medium mb-3 text-xs uppercase tracking-wide">Shop</h4>
          <ul className="space-y-2 text-gray-400 text-xs">
            <li>All Products</li>
            <li>Categories</li>
            <li>Deals</li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-300 font-medium mb-3 text-xs uppercase tracking-wide">Support</h4>
          <ul className="space-y-2 text-gray-400 text-xs">
            <li>Shipping Info</li>
            <li>Returns</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-300 font-medium mb-3 text-xs uppercase tracking-wide">Company</h4>
          <ul className="space-y-2 text-gray-400 text-xs">
            <li>About</li>
            <li>Careers</li>
          </ul>
        </div>
      </div>
      <div className="border-t px-4 py-4 text-center text-xs text-gray-500" style={{ borderColor: 'var(--color-header-light)' }}>
        © {new Date().getFullYear()} ShopHub. Built with React, Express & Prisma.
      </div>
    </footer>
  )
}