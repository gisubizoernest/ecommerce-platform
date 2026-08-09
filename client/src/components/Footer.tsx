export function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-24">
      <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-gray-500 flex justify-between">
        <p>© {new Date().getFullYear()} ShopHub. All rights reserved.</p>
        <p>Built with React, Express & Prisma</p>
      </div>
    </footer>
  )
}