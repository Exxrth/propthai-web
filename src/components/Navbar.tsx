import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          🏠 Resipacial
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/listings?status=for_sale" className="hover:text-blue-600 transition-colors">ซื้อ</Link>
          <Link href="/listings?status=for_rent" className="hover:text-blue-600 transition-colors">เช่า</Link>
          <Link href="/listings" className="hover:text-blue-600 transition-colors">ทรัพย์ทั้งหมด</Link>
        </nav>
        <Link
          href="/admin"
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Admin
        </Link>
      </div>
    </header>
  )
}
