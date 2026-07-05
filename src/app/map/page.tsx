import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import MapClientWrapper from '@/components/MapClientWrapper'

export const metadata = { title: 'ค้นหาบนแผนที่' }

export default async function MapPage() {
  const supabase = await createClient()
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .in('status', ['for_sale', 'for_rent'])
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)

  return (
    <>
      <Navbar />
      <main className="flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="px-4 pt-4 pb-2 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="font-bold text-gray-900">
              🗺️ ค้นหาบนแผนที่
              <span className="ml-2 text-sm font-normal text-blue-600">
                ({(properties ?? []).length} ทรัพย์)
              </span>
            </h1>
            <a href="/listings" className="text-sm text-blue-600 hover:underline">
              ← รายการทรัพย์
            </a>
          </div>
          {(properties ?? []).length === 0 && (
            <p className="text-xs text-amber-600 mt-1 max-w-7xl mx-auto">
              ⚠️ ยังไม่มีทรัพย์ที่มีพิกัดค่ะ — ใส่ Latitude/Longitude ผ่าน Admin เพื่อให้ปรากฏบนแผนที่
            </p>
          )}
        </div>
        <div className="flex-1 p-4 max-w-7xl mx-auto w-full">
          <MapClientWrapper properties={properties ?? []} />
        </div>
      </main>
    </>
  )
}
