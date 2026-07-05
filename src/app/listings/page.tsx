import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/properties/PropertyCard'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import type { PropertyFilters } from '@/types/property'

const PAGE_SIZE = 12

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'featured'

type Params = Record<string, string | string[] | undefined>

function str(p: Params, key: string): string | undefined {
  const v = p[key]; return typeof v === 'string' && v ? v : undefined
}
function num(p: Params, key: string): number | undefined {
  const v = p[key]; return v ? Number(v) : undefined
}

function parseFilters(params: Params): PropertyFilters & { page: number; sort: SortOption } {
  return {
    query:     str(params, 'query'),
    type:      str(params, 'type')  as PropertyFilters['type'],
    status:    str(params, 'status') as PropertyFilters['status'],
    province:  str(params, 'province'),
    min_price: num(params, 'min_price'),
    max_price: num(params, 'max_price'),
    min_area:  num(params, 'min_area'),
    max_area:  num(params, 'max_area'),
    bedrooms:  num(params, 'bedrooms'),
    page:      Math.max(1, num(params, 'page') ?? 1),
    sort:      (str(params, 'sort') ?? 'newest') as SortOption,
  }
}

function pageUrl(params: Params, page: number) {
  const q = new URLSearchParams()
  const keys = ['query', 'type', 'status', 'province', 'min_price', 'max_price', 'min_area', 'max_area', 'bedrooms', 'sort']
  for (const k of keys) { const v = params[k]; if (v && typeof v === 'string') q.set(k, v) }
  q.set('page', String(page))
  return `/listings?${q.toString()}`
}

export default async function ListingsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams
  const filters = parseFilters(params)
  const { page, sort } = filters
  const from = (page - 1) * PAGE_SIZE
  const to   = from + PAGE_SIZE - 1

  const supabase = await createClient()

  function applyFilters(q: any) {
    q = q.in('status', ['for_sale', 'for_rent'])
    if (filters.type)      q = q.eq('type', filters.type)
    if (filters.status)    q = q.eq('status', filters.status)
    if (filters.province)  q = q.ilike('province', `%${filters.province}%`)
    if (filters.min_price) q = q.gte('price', filters.min_price)
    if (filters.max_price) q = q.lte('price', filters.max_price)
    if (filters.min_area)  q = q.gte('area_sqm', filters.min_area)
    if (filters.max_area)  q = q.lte('area_sqm', filters.max_area)
    if (filters.bedrooms)  q = q.gte('bedrooms', filters.bedrooms)
    if (filters.query)     q = q.or(`title.ilike.%${filters.query}%,location.ilike.%${filters.query}%,description.ilike.%${filters.query}%`)
    return q
  }

  let dataQuery = applyFilters(supabase.from('properties').select('*'))
  if (sort === 'price_asc')  dataQuery = dataQuery.order('price', { ascending: true })
  else if (sort === 'price_desc') dataQuery = dataQuery.order('price', { ascending: false })
  else if (sort === 'featured') dataQuery = dataQuery.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
  else dataQuery = dataQuery.order('created_at', { ascending: false })  // newest
  dataQuery = dataQuery.range(from, to)

  const [{ count }, { data: properties, error }] = await Promise.all([
    applyFilters(supabase.from('properties').select('id', { count: 'exact', head: true })),
    dataQuery,
  ])

  const totalCount  = count ?? 0
  const totalPages  = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const showingFrom = totalCount === 0 ? 0 : from + 1
  const showingTo   = Math.min(to + 1, totalCount)

  const sel = 'border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300'
  const inp = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300'
  const bedroomOpts = [1, 2, 3, 4]

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ── Filter Panel ── */}
        <form method="get" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8 space-y-4">
          {/* Row 1: keyword + type + status + province + submit */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <input name="query" defaultValue={filters.query ?? ''} placeholder="ค้นหา..."
              className={`col-span-2 ${inp}`} />
            <select name="type" defaultValue={filters.type ?? ''} className={sel}>
              <option value="">ทุกประเภท</option>
              <option value="house">บ้านเดี่ยว</option>
              <option value="condo">คอนโด</option>
              <option value="townhouse">ทาวน์เฮ้าส์</option>
              <option value="land">ที่ดิน</option>
              <option value="commercial">พาณิชย์</option>
            </select>
            <select name="status" defaultValue={filters.status ?? ''} className={sel}>
              <option value="">ซื้อ/เช่า</option>
              <option value="for_sale">ขาย</option>
              <option value="for_rent">เช่า</option>
            </select>
            <input name="province" defaultValue={filters.province ?? ''} placeholder="จังหวัด" className={inp} />
            <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition-colors">
              ค้นหา
            </button>
          </div>

          {/* Row 2: price range + area range + bedrooms + sort */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
            {/* Price range */}
            <div className="col-span-2 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 block mb-1">ราคาต่ำสุด (฿)</label>
                <input name="min_price" type="number" min={0} step={100000}
                  defaultValue={filters.min_price ?? ''} placeholder="0"
                  className={`w-full ${inp}`} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">ราคาสูงสุด (฿)</label>
                <input name="max_price" type="number" min={0} step={100000}
                  defaultValue={filters.max_price ?? ''} placeholder="ไม่จำกัด"
                  className={`w-full ${inp}`} />
              </div>
            </div>

            {/* Area range */}
            <div className="col-span-2 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500 block mb-1">พื้นที่ต่ำสุด (ตร.ม.)</label>
                <input name="min_area" type="number" min={0}
                  defaultValue={filters.min_area ?? ''} placeholder="0"
                  className={`w-full ${inp}`} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">พื้นที่สูงสุด (ตร.ม.)</label>
                <input name="max_area" type="number" min={0}
                  defaultValue={filters.max_area ?? ''} placeholder="ไม่จำกัด"
                  className={`w-full ${inp}`} />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">ห้องนอน</label>
              <div className="flex gap-1">
                {bedroomOpts.map((n) => (
                  <label key={n} className={`flex-1 text-center text-xs py-2 rounded-lg border cursor-pointer transition-colors
                    ${filters.bedrooms === n ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                    <input type="radio" name="bedrooms" value={n}
                      defaultChecked={filters.bedrooms === n} className="sr-only" />
                    {n}+
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">เรียงตาม</label>
              <select name="sort" defaultValue={filters.sort} className={`w-full ${sel}`}>
                <option value="newest">ใหม่ล่าสุด</option>
                <option value="featured">แนะนำก่อน</option>
                <option value="price_asc">ราคา ต่ำ → สูง</option>
                <option value="price_desc">ราคา สูง → ต่ำ</option>
              </select>
            </div>
          </div>

          {/* Active filters + clear */}
          {(filters.query || filters.type || filters.status || filters.province ||
            filters.min_price || filters.max_price || filters.min_area || filters.max_area || filters.bedrooms) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400">ตัวกรองที่ใช้:</span>
              {filters.query    && <Chip label={`"${filters.query}"`}   />}
              {filters.type     && <Chip label={filters.type}           />}
              {filters.status   && <Chip label={filters.status === 'for_sale' ? 'ขาย' : 'เช่า'} />}
              {filters.province && <Chip label={filters.province}       />}
              {filters.min_price && <Chip label={`฿${filters.min_price.toLocaleString()}+`} />}
              {filters.max_price && <Chip label={`ไม่เกิน ฿${filters.max_price.toLocaleString()}`} />}
              {filters.min_area  && <Chip label={`${filters.min_area}+ ตร.ม.`} />}
              {filters.max_area  && <Chip label={`ไม่เกิน ${filters.max_area} ตร.ม.`} />}
              {filters.bedrooms  && <Chip label={`${filters.bedrooms}+ ห้องนอน`} />}
              <a href="/listings" className="text-xs text-red-500 hover:underline ml-1">✕ ล้างทั้งหมด</a>
            </div>
          )}
        </form>

        {/* ── Results header ── */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            ทรัพย์ทั้งหมด <span className="text-blue-600">({totalCount.toLocaleString()})</span>
          </h1>
          <div className="flex items-center gap-3">
            {totalCount > 0 && (
              <p className="text-sm text-gray-400 hidden sm:block">
                แสดง {showingFrom}–{showingTo} จาก {totalCount.toLocaleString()}
              </p>
            )}
            <Link href="/map" className="flex items-center gap-1.5 text-sm border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              🗺️ ดูแผนที่
            </Link>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">เกิดข้อผิดพลาด: {error.message}</p>}

        {properties && properties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {currentPage > 1 && (
                  <Link href={pageUrl(params, currentPage - 1)}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    ← ก่อนหน้า
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                  .reduce<(number | '...')[]>((acc, p, i, arr) => {
                    if (i > 0 && (p as number) - (arr[i-1] as number) > 1) acc.push('...')
                    acc.push(p); return acc
                  }, [])
                  .map((item, i) => item === '...' ? (
                    <span key={`e${i}`} className="px-2 text-gray-400">…</span>
                  ) : (
                    <Link key={item} href={pageUrl(params, item as number)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                        ${item === currentPage ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {item}
                    </Link>
                  ))}
                {currentPage < totalPages && (
                  <Link href={pageUrl(params, currentPage + 1)}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    ถัดไป →
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🏚</p>
            <p>ไม่พบทรัพย์ที่ตรงกับเงื่อนไขค่ะ</p>
          </div>
        )}
      </main>
    </>
  )
}

function Chip({ label }: { label: string }) {
  return (
    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{label}</span>
  )
}
