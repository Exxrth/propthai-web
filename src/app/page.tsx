import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/properties/PropertyCard'
import Navbar from '@/components/Navbar'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: featured } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .in('status', ['for_sale', 'for_rent'])
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">ค้นหาบ้านในฝันของคุณ</h1>
            <p className="text-blue-100 text-lg mb-10">
              อสังหาริมทรัพย์คุณภาพ บ้าน คอนโด ที่ดิน ทั่วประเทศไทย
            </p>
            <form action="/listings" method="get" className="flex gap-2 max-w-2xl mx-auto">
              <input
                name="query"
                type="text"
                placeholder="ค้นหา เช่น บ้านสุขุมวิท, คอนโดใกล้ BTS..."
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                ค้นหา
              </button>
            </form>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {[
                { label: '🏠 ซื้อบ้าน', href: '/listings?status=for_sale&type=house' },
                { label: '🏢 ซื้อคอนโด', href: '/listings?status=for_sale&type=condo' },
                { label: '🔑 เช่า', href: '/listings?status=for_rent' },
                { label: '🌳 ที่ดิน', href: '/listings?type=land' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-full transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">⭐ ทรัพย์แนะนำ</h2>
            <Link href="/listings" className="text-sm text-blue-600 hover:underline">ดูทั้งหมด →</Link>
          </div>
          {featured && featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-12">ยังไม่มีทรัพย์แนะนำค่ะ</p>
          )}
        </section>

        {/* Stats */}
        <section className="bg-blue-50 py-12">
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
            {[
              { label: 'ทรัพย์ทั้งหมด', value: '500+' },
              { label: 'จังหวัดทั่วไทย', value: '77' },
              { label: 'ลูกค้าพึงพอใจ', value: '1,000+' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-blue-600">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="bg-gray-800 text-gray-400 text-sm text-center py-6 mt-auto">
        © 2026 Resipacial — 𝗧𝗮𝗸𝗲 𝗮 𝗿𝗲𝘀𝘁 𝘄𝗶𝘁𝗵 𝘆𝗼𝘂𝗿 𝘀𝗽𝗲𝗰𝗶𝗮𝗹 𝗽𝗹𝗮𝗰𝗲
      </footer>
    </>
  )
}
