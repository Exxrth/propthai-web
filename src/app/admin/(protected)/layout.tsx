import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white shadow-sm flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="text-lg font-bold text-blue-600">🏠 Resipacial</Link>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: '/admin', label: '📊 Dashboard' },
            { href: '/admin/listings', label: '🏠 จัดการทรัพย์' },
            { href: '/admin/listings/new', label: '➕ เพิ่มทรัพย์' },
            { href: '/admin/inquiries', label: '📩 ข้อความติดต่อ' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="text-sm text-gray-400 hover:text-red-500 transition-colors">
              ออกจากระบบ
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
